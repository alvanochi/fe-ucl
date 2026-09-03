import { Icon } from "@iconify-icon/react";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useDosen from "../../../../../repo/dosen";
import useCRUD from "../../../../../hooks/useCRUD";
import { Loading } from "../../../../../components/Loading";
import EditNilai from "../../../../../components/EditPenilaian/edit-nilai";
import Link from "next/link";
import Accordion from "../../../../../components/Accordion";
import date from "../../../../../utils/date";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import EditNilaiSidang from "../../../../../components/EditPenilaian/edit-nilai-sidang";
import { escapeHtmlDeep } from "../../../../../utils/escapeHtml";
import { getDateNow } from "../../../../../repo/bulan-tahun";

export default function PelaksanaanSidang() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/detail-penilaian-sidang`;
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/ttd`;
  const FILE_URL_KOP = `${process.env.NEXT_PUBLIC_API_URL}/img`;

  // Data ttd lama (peninggalan prod) kadang tersimpan sebagai URL penuh atau
  // sudah menyertakan prefix "ttd/", beda dengan data baru yang cuma nama
  // file — kalau digabung mentah-mentah dengan FILE_URL hasilnya broken image.
  const buildTtdUrl = (value) => {
    if (!value) return null;
    const v = String(value).trim();
    if (!v) return null;
    if (/^https?:\/\//i.test(v)) return v;
    const cleaned = v.replace(/^\/+/, "").replace(/^(public\/)?ttd\//i, "");
    return `${FILE_URL}/${cleaned}`;
  };

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    sidang_id: "",
    nama_lengkap: "",
    semester: "",
    email: "",
    no_hp: "",
    npm: "",
    judul_skripsi: "",
    link_dok_mhs_aktif: "",
    link_dok_pembayaran: "",
    sidang_pembimbing_1: "",
    sidang_pembimbing_2: "",
    sidang_pembimbing_3: null,
    sidang_status_pem_1: "",
    sidang_status_pem_2: "",
    sidang_status_pem_3: "",
    penguji_1: "",
    penguji_2: "",
    // jadwal_pelaksanaan: "",
    statusDosen: "",
    penilaian_1: "",
    penilaian_2: "",
    penilaian_3: "",
    penilaian_4: "",
    komentar_singkat: "",
    dosen_id: "",
    penilaian_sidang: null,
    nilai_akhir: {},
    link_draft_final_skripsi: "",
    nama: "",
    npm: "",
    judul: "",
    tanggal: "",
    waktu: "",
    tempat: "",
    ketua_penguji: "",
    pembimbing_1: "",
    pembimbing_2: "",
    penguji_1: "",
    penguji_2: "",
    sekertaris_sidang: "",
    status_kelulusan: "",
    komentar: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    status_kelulusan: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  });

  const [isPrinting, setIsPrinting] = useState(false);

  const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return "-";
    const tgl = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return tgl.toLocaleDateString('id-ID', options);
  };

  const handleCetakBeritaAcara = async () => {
    setIsPrinting(true);
    try {
      const BA_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/berita-acara-sidang/${router.query.id}`;
      const response = await axios.get(BA_URL);
      // Data ini dirakit jadi HTML mentah lewat document.write() di bawah (bukan
      // JSX, jadi tidak auto-escape React) — escape semua nilai string di sini,
      // di satu titik, sebelum dipakai di template manapun.
      const ba = escapeHtmlDeep(response.data?.data);

      if (!ba) {
        throw new Error(response.data?.message || "Data berita acara tidak ditemukan atau format respon tidak sesuai.");
      }

      const nilaiAkhir = ba.nilai_akhir;
      const tanggalFormatted = formatTanggalIndo(ba.jadwal_pelaksanaan);
      const waktu = ba.waktu || "....";
      const tempat = ba.tempat || "Ruang Sidang Fakultas Teknik UIKA Bogor";

      const penilaianList = ba.penilaian_list || [];

      const getDosenNama = (id) => {
        if (!id || id === "0" || id === 0) return "-";
        if (listDosen) {
          const found = listDosen.find((d) => String(d.user_id) === String(id));
          if (found) return found.nama_lengkap;
        }
        return "-";
      };

      const getDosenNip = (id) => {
        if (!id || id === "0" || id === 0) return "";
        if (listDosen) {
          const found = listDosen.find((d) => String(d.user_id) === String(id));
          if (found) return found.nip || "";
        }
        return "";
      };

      const getDosenTtd = (id) => {
        if (!id || id === "0" || id === 0) return null;
        if (listDosen) {
          const found = listDosen.find((d) => String(d.user_id) === String(id));
          if (found) return found.ttd || null;
        }
        return null;
      };

      const pembimbing1Nama = ba.nama_pembimbing_1 || getDosenNama(ba.sidang_pembimbing_1);
      const pembimbing2Nama = ba.nama_pembimbing_2 || getDosenNama(ba.sidang_pembimbing_2);
      const pembimbing3Nama = ba.nama_pembimbing_3 || getDosenNama(ba.sidang_pembimbing_3);
      const penguji1Nama = ba.nama_penguji_1 || getDosenNama(ba.penguji_1);
      const penguji2Nama = ba.nama_penguji_2 || getDosenNama(ba.penguji_2);
      const ketuaPengujiNama = ba.nama_ketua_penguji || getDosenNama(ba.ketua_penguji) || pembimbing1Nama;
      const sekretarisSidangNama = ba.nama_sekertaris_sidang || getDosenNama(ba.sekertaris_sidang) || penguji1Nama;

      const kaprodiNama = ba.kaprodi?.nama_lengkap || "Hersanto Fajri, S.Ds., M.MD";
      const kaprodiNIK = ba.kaprodi?.nip || "";
      const kaprodiTTD = ba.kaprodi?.ttd || null;

      const ttdImgTag = kaprodiTTD
        ? `<img src="${buildTtdUrl(kaprodiTTD)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;" />`
        : `<div style="height:50px;"></div>`;

      let calcP1 = nilaiAkhir?.penilaian_1;
      let calcP2 = nilaiAkhir?.penilaian_2;
      let calcP3 = nilaiAkhir?.penilaian_3;
      let calcP4 = nilaiAkhir?.penilaian_4;
      let calcFinal = nilaiAkhir?.nilai_akhir;
      let calcMutu = nilaiAkhir?.huruf_mutu;

      if (penilaianList && penilaianList.length > 0) {
        if (!calcP1) calcP1 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_1 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP2) calcP2 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_2 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP3) calcP3 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_3 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP4) calcP4 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_4 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcFinal) {
          calcFinal = (
            parseFloat(calcP1) * 0.4 +
            parseFloat(calcP2) * 0.1 +
            parseFloat(calcP3) * 0.4 +
            parseFloat(calcP4) * 0.1
          ).toFixed(2);
        }
      }
      
      if (!calcMutu && calcFinal) {
        const fn = parseFloat(calcFinal);
        if (fn >= 80) calcMutu = "A";
        else if (fn >= 73) calcMutu = "AB";
        else if (fn >= 65) calcMutu = "B";
        else if (fn >= 60) calcMutu = "BC";
        else if (fn >= 55) calcMutu = "C";
        else if (fn >= 50) calcMutu = "CD";
        else if (fn >= 45) calcMutu = "D";
        else calcMutu = "E";
      }

      const intervalNilai = `
        <div style="font-size:10px;font-family:'Times New Roman';">
          <div>Interval Nilai Akhir :</div>
          <div>80 &le; A = 100</div>
          <div>73 &le; AB &lt; 80</div>
          <div>65 &le; B &lt; 73</div>
          <div>60 &le; BC &lt; 65</div>
          <div>55 &le; C &lt; 60</div>
          <div>50 &le; CD &lt; 55</div>
          <div>45 &le; D &lt; 50</div>
          <div>E &lt; 45</div>
        </div>
      `;

      const buildTimRow = (nama, jabatan) => {
        const displayName = (!nama || nama === "-") ? "" : nama;
        return `
          <tr>
            <td style="border:1px solid black;padding:3px 6px;font-size:10px;">${displayName}</td>
            <td style="border:1px solid black;padding:3px 6px;text-align:center;font-size:10px;">${jabatan}</td>
            <td style="border:1px solid black;padding:3px 6px;width:90px;height:28px;"></td>
          </tr>
        `;
      };

      const semesterTA = ba.semester || "........";
      const hariTanggal = tanggalFormatted || ".......................";
      
      const page1 = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:14px;text-decoration:underline;margin:10px 0 20px;letter-spacing:1px;">
            BERITA ACARA PELAKSANAAN UJIAN SKRIPSI
          </h2>

          <p style="text-align:justify;line-height:1.8;margin-bottom:12px;">
            Pada tanggal ${hariTanggal} pukul ${waktu} WIB sampai dengan selesai bertempat di ${tempat} telah berlangsung Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana ${semesterTA} di Jurusan/PS Teknik Informatika, Fakultas Teknik dan Sains UIKA Bogor dengan kandidat:
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;line-height:1.8;">
            <tr>
              <td style="width:190px;padding:2px 0;vertical-align:top;">Nama</td>
              <td style="width:14px;vertical-align:top;">:</td>
              <td style="padding:2px 0;font-weight:bold;">${ba.nama_lengkap || "-"}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;">Tempat, tanggal lahir</td>
              <td>:</td>
              <td style="padding:2px 0;">${ba.tempat_lahir ? `${ba.tempat_lahir}, ${formatTanggalIndo(ba.tanggal_lahir)}` : "-"}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;">NPM</td>
              <td>:</td>
              <td style="padding:2px 0;">${ba.npm || "-"}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;vertical-align:top;">Judul Tugas Akhir</td>
              <td style="vertical-align:top;">:</td>
              <td style="padding:2px 0;">${ba.judul_skripsi || "-"}</td>
            </tr>
          </table>

          <p style="margin-bottom:8px;font-size:12px;line-height:1.5;">Susunan Tim Penguji Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana:</p>

          <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:12px;">
            <thead>
              <tr style="background-color:#f0f0f0;">
                <th style="border:1px solid black;padding:3px 6px;text-align:center;">NAMA</th>
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:160px;">JABATAN</th>
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:90px;">TANDA TANGAN</th>
              </tr>
            </thead>
            <tbody>
              ${buildTimRow(ketuaPengujiNama, "Ketua Sidang")}
              ${buildTimRow(pembimbing1Nama, "Pembimbing Utama")}
              ${buildTimRow(pembimbing2Nama, "Pembimbing Pendamping")}
              ${buildTimRow(penguji1Nama, "Penguji I")}
              ${buildTimRow(penguji2Nama, "Penguji II")}
              ${buildTimRow(sekretarisSidangNama, "Sekretaris sidang sebagai Notulis")}
            </tbody>
          </table>

          <p style="text-align:justify;line-height:1.6;font-size:12px;margin-bottom:16px;">
            Kandidat tersebut memperoleh angka mutu: <strong>${calcFinal || "..."}</strong> yang dikonversi ke huruf mutu: <strong>${calcMutu || "..."}</strong>, sehingga dinyatakan: <strong>${nilaiAkhir?.status_kelulusan || ba.status_kelulusan || "lulus / lulus bersyarat / tidak lulus"}</strong>*) dengan catatan:<br/>
            ${ba.komentar ? `<div style="padding-left:16px;">${ba.komentar}</div>` : `
            <ol style="margin-top:4px; margin-bottom:16px; padding-left:20px;">
              <li>.......................................................................................................................................................</li>
              <li>.......................................................................................................................................................</li>
              <li>.......................................................................................................................................................</li>
            </ol>
            `}
          </p>

          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px;margin-bottom:10px;">
            <div style="text-align:left;min-width:220px;">
              <div>Mengetahui:</div>
              <div>Dekan Fakultas Teknik dan Sains,</div>
              <div style="height:50px;margin:4px 0;">&nbsp;</div>
              <div style="font-weight:bold;text-decoration:underline;">Dr. Feril Hariati, S.T., M.Eng</div>
              <div>NIK: 410 100 280</div>
              <div style="margin-top:4px;font-size:11px;">*) pilih salah satu</div>
            </div>
            <div style="text-align:left;min-width:220px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Ketua Jurusan/PS Teknik Informatika,</div>
              <div style="height:50px;margin:4px 0;display:flex;align-items:center;">${ttdImgTag}</div>
              <div style="font-weight:bold;text-decoration:underline;">${kaprodiNama}</div>
              <div>NIK: ${kaprodiNIK}</div>
            </div>
          </div>
        </div>
      `;

      const buildFormPenilaian = (p, peranLabel, dosenNamaDisplay, dosenNip, dosenTtd) => {
        const dosenTtdImgTag = dosenTtd
          ? `<img src="${buildTtdUrl(dosenTtd)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;" />`
          : `<div style="height:50px;"></div>`;
        let finalNilai = p.final_nilai;
        if (!finalNilai && p.penilaian_1) {
          finalNilai = (
            parseFloat(p.penilaian_1) * 0.4 +
            parseFloat(p.penilaian_2) * 0.1 +
            parseFloat(p.penilaian_3) * 0.4 +
            parseFloat(p.penilaian_4) * 0.1
          ).toFixed(2);
        }

        const fmtPersentaseNilai = (persen, nilai) =>
          `${persen}%&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;${nilai || "…………"}`;

        return `
          <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px; page-break-before:always;">
            <div style="text-align:center; margin-bottom:20px;">
              <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
            </div>
            <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:10px 0 20px;">
              LEMBAR PENILAIAN SIDANG SKRIPSI
            </h2>

            <p style="margin-bottom:10px;"><strong>NAMA / NPM :</strong> ${ba.nama_lengkap || "-"} / ${ba.npm || "-"}</p>
            <p style="text-align:justify;line-height:1.6;margin-bottom:16px;">
              Penilaian Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana di Jurusan/PS Teknik Informatika Fakultas Teknik Universitas Ibn Khaldun Bogor didasarkan pada penilaian:
            </p>

            <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
              <thead>
                <tr>
                  <th style="border:1px solid black;padding:6px;text-align:center;width:30px;">No.</th>
                  <th style="border:1px solid black;padding:6px;text-align:center;">K R I T E R I A</th>
                  <th style="border:1px solid black;padding:6px;text-align:center;width:140px;">PERSENTASE NILAI</th>
                  <th style="border:1px solid black;padding:6px;text-align:center;width:100px;">NILAI AKHIR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid black;padding:6px;text-align:center;">1.</td>
                  <td style="border:1px solid black;padding:6px;">Nilai Tugas Akhir ( Skripsi )</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${fmtPersentaseNilai(40, p.penilaian_1)}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_1 ? (parseFloat(p.penilaian_1) * 0.4).toFixed(2) : "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;text-align:center;">2.</td>
                  <td style="border:1px solid black;padding:6px;">Presentasi</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${fmtPersentaseNilai(10, p.penilaian_2)}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_2 ? (parseFloat(p.penilaian_2) * 0.1).toFixed(2) : "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;text-align:center;">3.</td>
                  <td style="border:1px solid black;padding:6px;">Penguasaan Materi</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${fmtPersentaseNilai(40, p.penilaian_3)}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_3 ? (parseFloat(p.penilaian_3) * 0.4).toFixed(2) : "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;text-align:center;">4.</td>
                  <td style="border:1px solid black;padding:6px;">Penampilan (menanggapi pertanyaan, Memberikan Jawaban, sistematika jawaban dan etika)</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${fmtPersentaseNilai(10, p.penilaian_4)}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_4 ? (parseFloat(p.penilaian_4) * 0.1).toFixed(2) : "-"}</td>
                </tr>
                <tr>
                  <td colSpan="3" style="border:1px solid black;padding:6px;text-align:right;font-weight:bold;">Jumlah</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${finalNilai || "-"}</td>
                </tr>
              </tbody>
            </table>

            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
              ${intervalNilai}
              <div style="flex:1;margin-left:20px;">
                <div style="margin-bottom:8px;font-weight:bold;font-size:11px;">KOMENTAR SINGKAT :</div>
                <div style="border:1px solid black;padding:10px;min-height:120px;font-size:11px;">${p.komentar_singkat || ""}</div>
              </div>
            </div>

            <div style="text-align:right;margin-top:16px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Dosen ${peranLabel},</div>
              <div style="margin:10px 0 4px;display:flex;justify-content:flex-end;">${dosenTtdImgTag}</div>
              <div style="font-weight:bold;text-decoration:underline;">(${dosenNamaDisplay && dosenNamaDisplay !== "-" ? dosenNamaDisplay : "........................................................."})</div>
              <div>NIK/NID: ${dosenNip || "..........................."}</div>
            </div>
          </div>
        `;
      };

      const expectedDosenList = [
        { roleKey: "pembimbing_1", label: "Pembimbing Utama", name: pembimbing1Nama, dbId: ba.sidang_pembimbing_1 },
        { roleKey: "pembimbing_2", label: "Pembimbing Pendamping", name: pembimbing2Nama, dbId: ba.sidang_pembimbing_2 },
        { roleKey: "penguji_1", label: "Penguji I", name: penguji1Nama, dbId: ba.penguji_1 },
        { roleKey: "penguji_2", label: "Penguji II", name: penguji2Nama, dbId: ba.penguji_2 },
      ].map(d => ({ ...d, nip: getDosenNip(d.dbId), ttd: getDosenTtd(d.dbId) }));

      const findPenilaianForDosen = (dosen) => {
        let p = penilaianList.find(x => String(x.dosen_id) === String(dosen.dbId));
        if (!p) {
          p = penilaianList.find(x => {
            if (!x.peran) return false;
            const r = x.peran.trim().toLowerCase();
            const rNorm = r.replace(/\s+/g, "_");
            const roleKey = dosen.roleKey;
            const label = dosen.label.trim().toLowerCase();
            return (
              rNorm === roleKey ||
              r === label ||
              (roleKey === "penguji_1" && (r === "penguji i" || r === "penguji 1" || rNorm === "penguji_i" || rNorm === "penguji_1")) ||
              (roleKey === "penguji_2" && (r === "penguji ii" || r === "penguji 2" || rNorm === "penguji_ii" || rNorm === "penguji_2")) ||
              (roleKey === "pembimbing_1" && (r === "pembimbing utama" || rNorm === "pembimbing_utama")) ||
              (roleKey === "pembimbing_2" && (r === "pembimbing pendamping" || rNorm === "pembimbing_pendamping"))
            );
          });
        }
        return p || {};
      };

      const formPages = expectedDosenList.map(dosen => {
        const p = findPenilaianForDosen(dosen);
        return buildFormPenilaian(p, dosen.label, dosen.name, dosen.nip, dosen.ttd);
      }).join("");

      // Rekapitulasi Page
      const buildRekapitulasiRow = (dosenInfo, index) => {
        let p = penilaianList.find(x => String(x.dosen_id) === String(dosenInfo.dbId));
        if (!p) {
          p = penilaianList.find(x => {
            if (!x.peran) return false;
            const r = x.peran.trim().toLowerCase();
            const rNorm = r.replace(/\s+/g, "_");
            const roleKey = dosenInfo.roleKey;
            const label = dosenInfo.label.trim().toLowerCase();
            return (
              rNorm === roleKey ||
              r === label ||
              (roleKey === "penguji_1" && (r === "penguji i" || r === "penguji 1" || rNorm === "penguji_i" || rNorm === "penguji_1")) ||
              (roleKey === "penguji_2" && (r === "penguji ii" || r === "penguji 2" || rNorm === "penguji_ii" || rNorm === "penguji_2")) ||
              (roleKey === "pembimbing_1" && (r === "pembimbing utama" || rNorm === "pembimbing_utama")) ||
              (roleKey === "pembimbing_2" && (r === "pembimbing pendamping" || rNorm === "pembimbing_pendamping"))
            );
          });
        }
        if (!p) p = {};

        const p1 = p.penilaian_1 ? (parseFloat(p.penilaian_1) * 0.4).toFixed(2) : "-";
        const p2 = p.penilaian_2 ? (parseFloat(p.penilaian_2) * 0.1).toFixed(2) : "-";
        const p3 = p.penilaian_3 ? (parseFloat(p.penilaian_3) * 0.4).toFixed(2) : "-";
        const p4 = p.penilaian_4 ? (parseFloat(p.penilaian_4) * 0.1).toFixed(2) : "-";

        let t = p.final_nilai;
        if (!t && p.penilaian_1) {
          t = (parseFloat(p.penilaian_1) * 0.4 + parseFloat(p.penilaian_2) * 0.1 + parseFloat(p.penilaian_3) * 0.4 + parseFloat(p.penilaian_4) * 0.1).toFixed(2);
        }

        return `
          <tr>
            <td style="border:1px solid black;padding:6px;font-size:11px;">${dosenInfo.label}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;">${dosenInfo.name && dosenInfo.name !== "-" ? dosenInfo.name : ""}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;">${p1}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;">${p2}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;">${p3}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;">${p4}</td>
            <td style="border:1px solid black;padding:6px;font-size:11px;text-align:center;font-weight:bold;">${t || "-"}</td>
            <td style="border:1px solid black;padding:6px;width:100px;"></td>
          </tr>
        `;
      };

      const rekapRows = expectedDosenList.map((d, i) => buildRekapitulasiRow(d, i + 1)).join("");

      const rekapPage = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px; page-break-before:always;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:10px 0 20px;">
            REKAPITULASI NILAI UJIAN SKRIPSI
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
            <tr>
              <td style="width:200px;padding:3px 0;">N a m a</td>
              <td style="width:14px;">:</td>
              <td style="padding:3px 0;">${ba.nama_lengkap || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">N P M</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.npm || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">Judul Tugas Akhir</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.judul_skripsi || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">Dosen Pembimbing Utama</td>
              <td>:</td>
              <td style="padding:3px 0;">${pembimbing1Nama || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">Dosen Pembimbing Pendamping</td>
              <td>:</td>
              <td style="padding:3px 0;">${pembimbing2Nama || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">PERINCIAN NILAI</td>
              <td>:</td>
              <td style="padding:3px 0;"></td>
            </tr>
          </table>

          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
            <thead>
              <tr style="background-color:#f0f0f0;">
                <th rowSpan="2" style="border:1px solid black;padding:6px;text-align:center;">Tim Sidang Sarjana</th>
                <th rowSpan="2" style="border:1px solid black;padding:6px;text-align:center;width:140px;">Nama</th>
                <th colSpan="4" style="border:1px solid black;padding:6px;text-align:center;">PERINCIAN NILAI SIDANG</th>
                <th rowSpan="2" style="border:1px solid black;padding:6px;text-align:center;width:60px;">Total</th>
                <th rowSpan="2" style="border:1px solid black;padding:6px;text-align:center;">Tanda Tangan</th>
              </tr>
              <tr style="background-color:#f0f0f0;">
                <th style="border:1px solid black;padding:6px;text-align:center;width:50px;">Nilai Skripsi 40 %</th>
                <th style="border:1px solid black;padding:6px;text-align:center;width:50px;">Presentasi 10 %</th>
                <th style="border:1px solid black;padding:6px;text-align:center;width:50px;">Penguasaan Materi 40%</th>
                <th style="border:1px solid black;padding:6px;text-align:center;width:50px;">Penampilan 10%</th>
              </tr>
            </thead>
            <tbody>
              ${rekapRows}
            </tbody>
          </table>

          <div style="margin-top:16px;">
            <table style="width:100%;font-size:12px;margin-bottom:16px;">
              <tr>
                <td style="width:100px;padding:3px 0;">Hasil Nilai</td>
                <td style="padding:3px 0;">: Dinyatakan : ${nilaiAkhir?.status_kelulusan || ba.status_kelulusan || "Lulus / Tidak Lulus"}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;vertical-align:top;">Catatan</td>
                <td style="padding:3px 0;">: ${ba.komentar ? ba.komentar : "Perlu Perbaikan dikumpulkan tanggal :<br/><br/>......................................................................................................................................................................................................."}</td>
              </tr>
            </table>
          </div>

          

          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:16px;">
            <div style="text-align:left;min-width:200px;">
              <div>&nbsp;</div>
              <div>Ketua Sidang,</div>
              <div style="margin:10px 0 4px;">${buildTtdUrl(getDosenTtd(ba.ketua_penguji)) ? `<img src="${buildTtdUrl(getDosenTtd(ba.ketua_penguji))}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;" />` : `<div style="height:50px;"></div>`}</div>
              <div style="font-weight:bold;text-decoration:underline;">${ketuaPengujiNama && ketuaPengujiNama !== "-" ? ketuaPengujiNama : "............................................."}</div>
              <div>NIK: ${getDosenNip(ba.ketua_penguji) || "....................."}</div>
            </div>
            <div style="text-align:left;min-width:200px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Sekretaris sidang sebagai Notulis,</div>
              <div style="margin:10px 0 4px;">${buildTtdUrl(getDosenTtd(ba.sekertaris_sidang)) ? `<img src="${buildTtdUrl(getDosenTtd(ba.sekertaris_sidang))}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;" />` : `<div style="height:50px;"></div>`}</div>
              <div style="font-weight:bold;text-decoration:underline;">${sekretarisSidangNama && sekretarisSidangNama !== "-" ? sekretarisSidangNama : "............................................."}</div>
              <div>NIK: ${getDosenNip(ba.sekertaris_sidang) || "....................."}</div>
            </div>
          </div>

          ${intervalNilai}

        </div>
      `;

      const buildLembarPerbaikan = (peranLabel, dosenNip, dosenNama, komentarSingkat, dosenTtd) => {
        const dosenTtdImgTag = buildTtdUrl(dosenTtd)
          ? `<img src="${buildTtdUrl(dosenTtd)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;" />`
          : `<div style="height:50px;"></div>`;
        return `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px; page-break-before:always;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:10px 0 4px;">
            LEMBAR PERBAIKAN
          </h2>
          <h3 style="text-align:center;font-weight:bold;font-size:12px;text-decoration:underline;margin:0 0 20px;">
            UJIAN SKRIPSI PADA SIDANG SARJANA
          </h3>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
            <tr>
              <td style="width:150px;padding:2px 0;">Nama / N P M</td>
              <td style="width:14px;">:</td>
              <td style="padding:2px 0;">${ba.nama_lengkap || "-"} / ${ba.npm || "-"}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;vertical-align:top;">Judul Tugas Akhir</td>
              <td style="vertical-align:top;">:</td>
              <td style="padding:2px 0;">${ba.judul_skripsi || "-"}</td>
            </tr>
          </table>

          <div style="margin-bottom:8px;">Perbaikan:</div>
          <div style="border:1px solid black;min-height:420px;padding:10px;">${komentarSingkat || ""}</div>

          <div style="text-align:right;margin-top:20px;">
            <div>Bogor, ${tanggalFormatted}</div>
            <div>Dosen ${peranLabel}</div>
            <div style="margin:10px 0 4px;display:flex;justify-content:flex-end;">${dosenTtdImgTag}</div>
            <div style="font-weight:bold;text-decoration:underline;">${dosenNama && dosenNama !== "-" ? dosenNama : "........................................................."}</div>
            <div>NIK. ${dosenNip || "......................................"}</div>
          </div>


        </div>
      `;
      };

      const perbaikanPages = expectedDosenList
        .filter(d => ["pembimbing_1", "pembimbing_2", "penguji_1", "penguji_2"].includes(d.roleKey))
        .map(d => buildLembarPerbaikan(d.label, d.nip, d.name, findPenilaianForDosen(d).komentar_singkat, d.ttd))
        .join("");

      const fullContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Berita Acara Sidang - ${ba.nama_lengkap}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              @page { size: A4 portrait; margin: 15mm 15mm 25mm 15mm; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <img src="${FILE_URL_KOP}/foot_kop.png" alt="Footer" style="position:fixed;bottom:0;left:0;width:100%;z-index:9999;display:block;" />
          ${page1}
          ${formPages}
          ${rekapPage}
          ${perbaikanPages}
        </body>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 800);
          }
        </script>
        </html>
      `;

      const newWindow = window.open("", "_blank");
      newWindow.document.write(fullContent);
      newWindow.document.close();

    } catch (error) {
      console.error(error);
      alert("Gagal memuat data berita acara: " + (error?.response?.data?.message || error.message || ""));
    } finally {
      setIsPrinting(false);
    }
  };

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/nilai-akhir-sidang`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.sidang_id}`,
    method: "PUT",
  };

  const [ttd, setTtd] = useState({
    pembimbing_1: "",
    pembimbing_2: "",
    penguji_1: "",
    penguji_2: "",
    ketua_penguji: "",
    sekertaris_sidang: "",
  });

  const handlePembimbing1 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      pembimbing_1: selected?.ttd,
    }));
    inputHandler({
      target: { name: "pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      pembimbing_2: selected?.ttd,
    }));
    inputHandler({
      target: { name: "pembimbing_2", value: selected?.value },
    });
  };

  const handlePenguji1 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      penguji_1: selected?.ttd,
    }));
    inputHandler({
      target: { name: "penguji_1", value: selected?.value },
    });
  };

  const handlePenguji2 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      penguji_2: selected?.ttd,
    }));
    inputHandler({
      target: { name: "penguji_2", value: selected?.value },
    });
  };

  const handleKetuaPenguji = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      ketua_penguji: selected?.ttd,
    }));
    inputHandler({
      target: { name: "ketua_penguji", value: selected?.value },
    });
  };

  const handleSekertarisSidang = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      sekertaris_sidang: selected?.ttd,
    }));
    inputHandler({
      target: { name: "sekertaris_sidang", value: selected?.value },
    });
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        nama: data.nilai_akhir?.nama,
        npm: data.nilai_akhir?.npm,
        judul: data.nilai_akhir?.judul,
        tanggal: data.nilai_akhir?.tanggal,
        waktu: data.nilai_akhir?.waktu,
        tempat: data.nilai_akhir?.tempat,
        ketua_penguji: data.nilai_akhir?.ketua_penguji,
        pembimbing_1: data.nilai_akhir?.pembimbing_1,
        pembimbing_2: data.nilai_akhir?.pembimbing_2,
        penguji_1: data.nilai_akhir?.penguji_1,
        penguji_2: data.nilai_akhir?.penguji_2,
        sekertaris_sidang: data.nilai_akhir?.sekertaris_sidang,
        status_kelulusan: data.nilai_akhir?.status_kelulusan,
        komentar: data.nilai_akhir?.komentar,
      }),
    });
  }, [router, user]);

  useEffect(() => {
    const updateTtd = (role, formValue) => {
      if (listDosen && formValue) {
        const dosen = listDosen.find((item) => item?.user_id === formValue);
        if (dosen) {
          setTtd((prev) => ({
            ...prev,
            [role]: dosen.ttd,
          }));
        }
      }
    };

    updateTtd("ketua_penguji", form.ketua_penguji);
    updateTtd("pembimbing_1", form.pembimbing_1);
    updateTtd("pembimbing_2", form.pembimbing_2);
    updateTtd("penguji_1", form.penguji_1);
    updateTtd("penguji_2", form.penguji_2);
    updateTtd("sekertaris_sidang", form.sekertaris_sidang);
  }, [
    listDosen,
    form.ketua_penguji,
    form.pembimbing_1,
    form.pembimbing_2,
    form.penguji_1,
    form.penguji_2,
    form.sekertaris_sidang,
  ]);

  const [selectedPeran, setSelectedPeran] = useState("");
  const peranUnik = [
    ...new Set(form?.penilaian_sidang?.map((item) => item.peran)),
  ];
  const selectedContent = form?.penilaian_sidang?.filter(
    (item) => item.peran === selectedPeran
  );

  const [dataKaprodi, setDataKaprodi] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/get-jabatan`;
        const response = await axios.get(API_URL, {
          params: {
            nama_jabatan: "Ka Prodi",
            prodi: "FT_TI",
          },
        });
        setDataKaprodi(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setDataKaprodi]);

  const content = () => {
    return (
      <>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div style={{ margin: "0 auto" }}>
            <img
              src={`${FILE_URL_KOP}/kop_surat.png`}
              alt="Kop Surat"
              style={{ width: "100%", marginBottom: "20px" }}
            />
          </div>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            margin: "10px 0",
            fontFamily: "Times New Roman",
          }}
        >
          BERITA ACARA PELAKSANAAN UJIAN SKRIPSI
        </h1>

        <p>
          Pada tanggal {form.tanggal && date.formatToInput(form.tanggal)}, pukul{" "}
          {form.waktu} WIB sampai dengan selesai bertempat di Ruang Sidang
          Fakultas Teknik UIKA Bogor telah berlangsung Ujian Skripsi (Tugas
          Akhir) pada Sidang Sarjana Jurusan/PS Teknik Informatika Fakultas
          Teknik dan Sains UIKA Bogor dengan Kandidat:
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          <label style={{ minWidth: "188px", margin: 0 }}>Nama</label>
          <span>:</span>
          <p style={{ flex: 1, marginRight: "10px", margin: 0 }}>{form.nama}</p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          <label style={{ minWidth: "188px", margin: 0 }}>
            Tempat, tanggal lahir
          </label>
          <span>:</span>
          <p style={{ flex: 1, margin: 0 }}>
            {form.tempat_lahir} / {date.formatToInput(form.tanggal_lahir)}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          <label style={{ minWidth: "188px", margin: 0 }}>NPM</label>
          <span>:</span>
          <p style={{ flex: 1, margin: 0 }}>{form.npm}</p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          <label style={{ minWidth: "188px", margin: 0 }}>
            Judul Tugas Akhir
          </label>
          <span>:</span>
          <p style={{ flex: 1, margin: 0 }}>{form.judul}</p>
        </div>

        <p>
          Susunan Tim Penguji Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana:
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            overflow: "hidden",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  width: "40%",
                  textAlign: "center",
                }}
              >
                NAMA
              </th>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                JABATAN
              </th>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                TANDA TANGAN
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                role: "Ketua Sidang",
                dosen: form.ketua_penguji,
                ttd: ttd?.ketua_penguji,
              },
              {
                role: "Pembimbing Utama",
                dosen: form.pembimbing_1,
                ttd: ttd?.pembimbing_1,
              },
              {
                role: "Pembimbing Pendamping",
                dosen: form.pembimbing_2,
                ttd: ttd?.pembimbing_2,
              },
              { role: "Penguji 1", dosen: form.penguji_1, ttd: ttd?.penguji_1 },
              { role: "Penguji 2", dosen: form.penguji_2, ttd: ttd?.penguji_2 },
              {
                role: "Sekertaris sidang sebagai notulis",
                dosen: form.sekertaris_sidang,
                ttd: ttd?.sekertaris_sidang,
              },
            ].map(({ role, dosen, ttd }, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid black",
                    backgroundColor: "#edf2f7",
                    textAlign: "center",
                  }}
                >
                  {listDosen.find((d) => d.user_id === dosen)?.nama_lengkap ||
                    ""}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    backgroundColor: "#edf2f7",
                    textAlign: "center",
                  }}
                >
                  {role}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    backgroundColor: "#edf2f7",
                    textAlign: "center",
                  }}
                >
                  {ttd && (
                    <img
                      src={buildTtdUrl(ttd)}
                      alt="TTD"
                      style={{
                        width: "100px",
                        height: "35px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginBottom: 0, marginTop: "8px" }}>
          Kandidat tersebut memperoleh angka mutu:{" "}
          {form?.nilai_akhir?.nilai_akhir} yang dikonversi ke huruf mutu:{" "}
          {form?.nilai_akhir?.huruf_mutu}, sehingga dinyatakan:{" "}
          {form.status_kelulusan} dengan catatan :
        </p>
        <span>{form.komentar}</span>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "Times New Roman",
              fontSize: "12px",
            }}
          >
            <p>Mengetahui</p>
            <p>Dekan Fakultas Teknik,</p>
            <div style={{ width: "100px", height: "100px" }}></div>
            <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
              Dr. H. M. Nanang Prayudyanto, M.Sc
            </p>
            <p
              style={{
                fontFamily: "Times New Roman",
                fontSize: "12px",
              }}
            >
              NIK: 410 100 585
            </p>
          </div>

          <div
            style={{
              textAlign: "right",
              fontFamily: "Times New Roman",
              fontSize: "12px",
            }}
          >
            <p>Bogor,</p>
            <p>Ketua Program Studi,</p>
            <div
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>
            <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
              {dataKaprodi.nama_lengkap}
            </p>
            <p
              style={{
                textIndent: "295px",
                fontFamily: "Times New Roman",
                fontSize: "12px",
                paddingTop: "-6px",
              }}
            >
              NIK: {dataKaprodi.nip}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div style={{ margin: "0 auto" }}>
            <img
              src={`${FILE_URL_KOP}/foot_kop.png`}
              alt="Kop Surat"
              style={{ width: "100%", marginTop: "50px" }}
            />
          </div>
        </div>
      </>
    );
  };

  const handlePrint = async () => {
    const printContent = ReactDOMServer.renderToString(content());

    const surat = `
      <div style="margin: 0 auto; max-width: 600px;">
        ${printContent}
      </div>
    `;

    const combinedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media print {
            @page :first {
              size: portrait;
            }
            @page {
              size: landscape;
            }
          }
        </style>
  
      </head>
      <body>
        ${surat}
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";

    const blob = new Blob([combinedContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeWindow = iframe.contentWindow;

      iframeWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 100);
    };
  };

  const handleButtonPrint = (e) => {
    e.preventDefault();
    handlePrint();
  };

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>BERITA ACARA PELAKSANAAN UJIAN SKRIPSI</div>
        </Card.Header>

        <Accordion title="Summary" className="mt-4">
          <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
            <Card.Body className="mx-6">
              <h1>
                Pada tanggal {form.tanggal && date.formatToInput(form.tanggal)},
                pukul {form.waktu} WIB sampai dengan selesai bertempat di Ruang
                Sidang Fakultas Teknik UIKA Bogor telah berlangsung Ujian
                Skripsi (Tugas Akhir) pada Sidang Sarjana Jurusan/PS Teknik
                Informatika Fakultas Teknik dan Sains UIKA Bogor dengan
                Kandidat:
              </h1>
              <Form.Group className="flex items-baseline gap-3 mt-4">
                <Form.Label className="min-w-[14rem]">Nama</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="nama"
                  value={form.nama}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3 mt-4">
                <Form.Label className="min-w-[14rem]">
                  Tempat, Tanggal Lahir
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="tempat_lahir"
                  value={form.tempat_lahir}
                  disabled
                />
                <Form.Input
                  type="date"
                  className="flex-1"
                  name="tanggal_lahir"
                  value={
                    form.tanggal_lahir && date.formatToInput(form.tanggal_lahir)
                  }
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3 mt-4">
                <Form.Label className="min-w-[14rem]">NPM</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="npm"
                  value={form.npm}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3 mt-4">
                <Form.Label className="min-w-[14rem]">
                  Judul Tugas Akhir
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="judul"
                  value={form.judul}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3 mt-4">
                <Form.Label className="min-w-[14rem]">
                  Jadwal Pelaksanaan
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="date"
                  className="flex-1"
                  name="tanggal"
                  value={form.tanggal && date.formatToInput(form.tanggal)}
                  placeholder="Diisi oleh admin"
                />
                <Form.Input
                  type="time"
                  className="flex-1"
                  name="waktu"
                  value={form.waktu}
                  placeholder="Diisi oleh admin"
                  onChange={inputHandler}
                />
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="tempat"
                  value={form.tempat}
                  onChange={inputHandler}
                />
              </Form.Group>

              <table
                className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
                cellPadding={10}
                style={{ marginTop: "20px" }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan={4}
                      className="text-sm border-2 border-white bg-gray-50"
                    >
                      Susunan Tim Penguji Ujian Skripsi (Tugas Akhir) pada
                      Sidang Sarjana
                    </th>
                  </tr>
                  <tr>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="flex items-center gap-2 cursor-pointer">
                        Nama
                      </div>
                    </th>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="gap-2 cursor-pointer">Jabatan</div>
                    </th>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="gap-2 cursor-pointer">TTD</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="ketua_penguji"
                        value={form.ketua_penguji}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handleKetuaPenguji}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Ketua Sidang
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd?.ketua_penguji)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="pembimbing_1"
                        value={form.pembimbing_1}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePembimbing1}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Pembimbing Utama
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd.pembimbing_1)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="pembimbing_2"
                        value={form.pembimbing_2}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePembimbing2}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Pembimbing Pendamping
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd.pembimbing_2)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="penguji_1"
                        value={form.penguji_1}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePenguji1}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Penguji 1
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd.penguji_1)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="penguji_2"
                        value={form.penguji_2}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePenguji2}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Penguji 2
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd.penguji_2)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="sekertaris_sidang"
                        value={form.sekertaris_sidang}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handleSekertarisSidang}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Sekertaris sidang sebagai notulis
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={buildTtdUrl(ttd.sekertaris_sidang)}
                        alt="TTD"
                        className="w-40 h-20 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <h1 className="mt-2">
                Kandidat tersebut memperoleh angka mutu:{" "}
                {form?.nilai_akhir?.nilai_akhir} yang dikonversi ke huruf mutu:{" "}
                {form?.nilai_akhir?.huruf_mutu}, sehingga dinyatakan:
                <div className="flex gap-4">
                  <Form.Label className="mt-2 flex items-center">
                    <Form.Radio
                      name="status_kelulusan"
                      value="LULUS"
                      onChange={inputHandler}
                      checked={form.status_kelulusan === "LULUS"}
                      className="mr-2"
                    />
                    Lulus
                  </Form.Label>
                  <Form.Label className="mt-2 flex items-center">
                    <Form.Radio
                      name="status_kelulusan"
                      value="LULUS BERSYARAT"
                      onChange={inputHandler}
                      checked={form.status_kelulusan === "LULUS BERSYARAT"}
                      className="mr-2"
                    />
                    Lulus Bersyarat
                  </Form.Label>
                  <Form.Label className="mt-2 flex items-center">
                    <Form.Radio
                      name="status_kelulusan"
                      value="TIDAK LULUS"
                      onChange={inputHandler}
                      checked={form.status_kelulusan === "TIDAK LULUS"}
                      className="mr-2"
                    />
                    Tidak Lulus
                  </Form.Label>
                </div>
                dengan catatan:
                <Form.Textarea
                  className="flex-1 mt-2"
                  rows="5"
                  name="komentar"
                  value={form.komentar}
                  onChange={inputHandler}
                />
              </h1>
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="primary"
                  className="w-1/4 h-12 mt-4"
                  onClick={handleButtonPrint}
                >
                  Print
                </Button>
                <Button
                  type="submit"
                  variant="info"
                  className="w-1/4 h-12 mt-4"
                >
                  Save
                </Button>
              </div>
            </Card.Body>
          </Form>
        </Accordion>
      </Card>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
        style={{ marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th
              colSpan={4}
              className="text-sm border-2 border-white bg-gray-50"
            >
              REKAPITULASI UJIAN SKRIPSI
              <Button
                onClick={() =>
                  window.open(`${form.link_draft_final_skripsi}`, "_blank")
                }
                variant="primary"
                icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                pill
              >
                Link Draft Final Skripsi
              </Button>
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Aspek Penilaian
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 cursor-pointer">Presentase (%)</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 cursor-pointer">Nilai</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">1</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Nilai Tugas Akhir (Skripsi)
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              40%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir?.penilaian_1}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">2</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Presentasi
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir?.penilaian_2}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">3</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Penguasaan Materi
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              40%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir?.penilaian_3}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">4</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Penampilan (menanggapi pertanyaan, Memberikan Jawaban, sistematika
              jawaban dan etika)
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir?.penilaian_4}
            </td>
          </tr>
        </tbody>
      </table>
      <Card className="mt-2">
        <div className="p-4 flex flex-col">
          <div className="flex justify-end">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Nilai Akhir :</span>{" "}
              <span>{form?.nilai_akhir?.nilai_akhir}</span>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Huruf Mutu :</span>{" "}
              <span>{form?.nilai_akhir?.huruf_mutu}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => setSelectedPeran(e.target.value)}
          value={selectedPeran}
        >
          <option value="">Select Peran</option>
          {peranUnik.map((peran) => (
            <option key={peran} value={peran}>
              {peran}
            </option>
          ))}
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex mt-8">
        {peranUnik.map((peran) => (
          <li className="w-full focus-within:z-10" key={peran}>
            <a
              href="#"
              className={`inline-block w-full p-4 ${
                peran === selectedPeran
                  ? "text-gray-900 bg-gray-300 border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none"
                  : "bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              }`}
              aria-current={peran === selectedPeran ? "page" : undefined}
              onClick={() => setSelectedPeran(peran)}
            >
              {peran}
            </a>
          </li>
        ))}
      </ul>

      <div className="content-tab">
        {selectedContent?.map((item) => (
          <div key={item.id}>
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
              cellPadding={10}
              style={{ marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="flex items-center gap-2 cursor-pointer">
                      No
                    </div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="flex items-center gap-2 cursor-pointer">
                      Aspek Penilaian
                    </div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Presentase (%)</div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Nilai</div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    1
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Nilai Tugas Akhir (Skripsi)
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    40%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilaiSidang
                      title="Nilai Tugas Akhir (Skripsi)"
                      data={item.penilaian_1}
                      name="penilaian_1"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_sidang"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    2
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Presentasi
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_2}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilaiSidang
                      title="Presentasi"
                      data={item.penilaian_2}
                      name="penilaian_2"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_sidang"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    3
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Penguasaan Materi
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    40%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_3}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilaiSidang
                      title="Penguasaan Materi"
                      data={item.penilaian_3}
                      name="penilaian_3"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_sidang"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    4
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Penampilan (menanggapi pertanyaan, Memberikan Jawaban,
                    sistematika jawaban dan etika)
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_4}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilaiSidang
                      title="Penampilan (menanggapi pertanyaan, Memberikan Jawaban, sistematika jawaban dan etika)"
                      data={item.penilaian_4}
                      name="penilaian_4"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_sidang"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Card className="mt-2">
              <div className="p-4 flex flex-col">
                <div className="flex justify-end">
                  <div className="text-sm font-bold pr-10">
                    <span className="mr-2">Nilai Akhir :</span>{" "}
                    <span>{item.final_nilai}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <div className="text-sm font-bold pr-10">
                    <span className="mr-2">Huruf Mutu :</span>{" "}
                    <span>{item.huruf_mutu}</span>
                  </div>
                </div>
              </div>
            </Card>
            <Form.Textarea
              className="flex-1 mt-2"
              rows="5"
              value={`Komentar Singkat : ${item.komentar_singkat}`}
              disabled
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          as="a"
          href={prefix + menu.url}
          variant="secondary"
          className="w-full h-12"
        >
          Kembali
        </Button>
        <Button
          type="button"
          variant="primary"
          className="w-full h-12"
          onClick={handleCetakBeritaAcara}
          disabled={isPrinting}
        >
          {isPrinting ? "Mencetak..." : "Cetak Berita Acara"}
        </Button>
      </div>
    </Layout>
  );
}
