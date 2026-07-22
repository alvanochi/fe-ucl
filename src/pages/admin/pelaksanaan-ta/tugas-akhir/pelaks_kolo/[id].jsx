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
import date from "../../../../../utils/date";
import { getDateNow } from "../../../../../repo/bulan-tahun";
import EditNilai from "../../../../../components/EditPenilaian/edit-nilai";
import Accordion from "../../../../../components/Accordion";
import ReactDOMServer from "react-dom/server";
import axios from "axios";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/ttd`;
  const FILE_URL_KOP = `${process.env.NEXT_PUBLIC_API_URL}/img`;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/detail-penilaian-kolo`;

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    kolo_id: "",
    nama_lengkap: "",
    semester: "",
    email: "",
    no_hp: "",
    npm: "",
    judul_skripsi: "",
    link_dok_mhs_aktif: "",
    link_dok_pembayaran: "",
    kolo_pembimbing_1: "",
    kolo_pembimbing_2: "",
    kolo_pembimbing_3: null,
    kolo_status_pem_1: "",
    kolo_status_pem_2: "",
    kolo_status_pem_3: "",
    evaluator_1: "",
    evaluator_2: "",
    jadwal_pelaksanaan: "",
    file_makalah: "",
    status_kp: "",
    status_sks_ipk: "",
    statusDosen: "",
    penilaian_1: "",
    penilaian_2: "",
    penilaian_3: "",
    penilaian_4: "",
    penilaian_5: "",
    komentar_singkat: "",
    dosen_id: "",
    penilaian_kolo: null,
    nilai_akhir: {},
    judul: "",
    link_dok_makalah: "",
    nama: "",
    npm: "",
    tempat: "",
    judul: "",
    tanggal: "",
    waktu: "",
    tempat: "",
    pembimbing_1: "",
    pembimbing_2: "",
    evaluator_1: "",
    evaluator_2: "",
    komentar: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "link_dok_mhs_aktif", label: "Link Dokumen Mahasiswa Aktif" },
      { field: "link_dok_pembayaran", label: "Link Dokumen Pembayaran" },
      { field: "file_makalah", label: "file_makalah" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const handlePembimbing1 = (selected) => {
    inputHandler({
      target: { name: "pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    inputHandler({
      target: { name: "pembimbing_2", value: selected?.value },
    });
  };

  const handleEvaluator1 = (selected) => {
    inputHandler({
      target: { name: "evaluator_1", value: selected?.value },
    });
  };

  const handleEvaluator2 = (selected) => {
    inputHandler({
      target: { name: "evaluator_2", value: selected?.value },
    });
  };

  const EDIT_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/nilai-akhir-kolo`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.kolo_id}`,
    method: "PUT",
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        jadwal_pelaksanaan: data.jadwal_pelaksanaan
          ? date.formatToInput(data.jadwal_pelaksanaan)
          : "",
        pembimbing_1: data.nilai_akhir.pembimbing_1,
        pembimbing_2: data.nilai_akhir.pembimbing_2,
        evaluator_1: data.nilai_akhir.evaluator_1,
        evaluator_2: data.nilai_akhir.evaluator_2,
        komentar: data.nilai_akhir.komentar,
        nama: data.nilai_akhir.nama,
        judu: data.nilai_akhir.judul,
        npm: data.nilai_akhir.npm,
        tempat: data.nilai_akhir.tempat,
        waktu: data.nilai_akhir.waktu,
        tanggal: data.nilai_akhir.tanggal,
      }),
    });
  }, [router, user]);

  const [selectedPeran, setSelectedPeran] = useState("");
  const peranUnik = [
    ...new Set(form?.penilaian_kolo?.map((item) => item.peran)),
  ];
  const selectedContent = form?.penilaian_kolo?.filter(
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
          BERITA ACARA DAN PENILAIAN SEMINAR PROPOSAL / KOLOKIUM SKRIPSI
          MAHASISWA
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Nama</label>
          <span>:</span>
          <input
            type="text"
            style={{ flex: 1 }}
            name="nama"
            value={form.nama}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>NPM</label>
          <span>:</span>
          <input type="text" style={{ flex: 1 }} name="npm" value={form.npm} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Judul</label>
          <span>:</span>
          <input
            type="text"
            style={{ flex: 1 }}
            name="judul"
            value={form.judul}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Tanggal/Jam/Tempat</label>
          <span>:</span>
          <input
            type="date"
            name="tanggal"
            defaultValue={form.tanggal && date.formatToInput(form.tanggal)}
            placeholder="Diisi oleh admin"
          />
          <input
            type="time"
            name="waktu"
            defaultValue={form.waktu}
            placeholder="Diisi oleh admin"
          />
          <input type="text" name="tempat" defaultValue={form.tempat} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Pembimbing yang diusulkan</label>
          <span>:</span>
          <input
            type="text"
            style={{ flex: 1 }}
            name="tempat"
            defaultValue={
              listDosen.find((dosen) => dosen.user_id === form.pembimbing_1)
                ?.nama_lengkap || ""
            }
          />
          <input
            type="text"
            style={{ flex: 1 }}
            name="tempat"
            defaultValue={
              listDosen.find((dosen) => dosen.user_id === form.pembimbing_2)
                ?.nama_lengkap || ""
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Evaluator</label>
          <span>:</span>
          <input
            type="text"
            style={{ flex: 1 }}
            name="tempat"
            defaultValue={
              listDosen.find((dosen) => dosen.user_id === form.evaluator_1)
                ?.nama_lengkap || ""
            }
          />
          <input
            type="text"
            style={{ flex: 1 }}
            name="tempat"
            defaultValue={
              listDosen.find((dosen) => dosen.user_id === form.evaluator_2)
                ?.nama_lengkap || ""
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <label style={{ minWidth: "188px" }}>Komentar Singkat</label>
          <span>:</span>
          <textarea style={{ flex: 1, marginTop: "0.25rem" }} name="komentar">
            {form.komentar}
          </textarea>
        </div>

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
                  textAlign: "center",
                }}
                colspan="4"
              >
                REKAPITULASI SEMINAR PROPOSAL
              </th>
            </tr>
            <tr>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  width: "3rem",
                  textAlign: "center",
                }}
              >
                No
              </th>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  textAlign: "center",
                }}
              >
                Aspek Penilaian
              </th>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  textAlign: "center",
                }}
              >
                Presentase (%)
              </th>
              <th
                style={{
                  border: "1px solid black",
                  backgroundColor: "#f3f4f6",
                  textAlign: "center",
                }}
              >
                Nilai
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                1
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                }}
              >
                Subtansi dan Orientasi Topik Penilitian
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                20%
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                {form?.nilai_akhir.penilaian_1}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                2
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                }}
              >
                Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                Penelitian
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                40%
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                {form?.nilai_akhir.penilaian_2}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                3
              </td>

              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                }}
              >
                Organisasi, kelengkapan dan Teknik Penulisan Makalah
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                10%
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                {form?.nilai_akhir.penilaian_3}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                4
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                }}
              >
                Penyajian Makalah dan Tampilan Slide
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                10%
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                {form?.nilai_akhir.penilaian_4}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                5
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                }}
              >
                Argumentasi
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                20%
              </td>
              <td
                style={{
                  border: "1px solid black",
                  backgroundColor: "#edf2f7",
                  textAlign: "center",
                }}
              >
                {form?.nilai_akhir.penilaian_5}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  paddingRight: "1.625rem",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>Nilai Akhir :</span>
                <span>{form?.nilai_akhir.nilai_akhir}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "0.625rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  paddingRight: "1.625rem",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>Huruf Mutu :</span>
                <span>{form?.nilai_akhir.huruf_mutu}</span>
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            textIndent: "295px",
            fontFamily: "Times New Roman",
            fontSize: "12px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ marginRight: "120px" }}>Bogor,</span>
        </p>
        <p
          style={{
            textIndent: "295px",
            fontFamily: "Times New Roman",
            fontSize: "12px",
            marginTop: "0px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          Ketua Program Studi,
        </p>
        <div
          style={{
            width: "100px",
            height: "100px",
            float: "right",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src={`${FILE_URL}/${dataKaprodi.ttd}`}
            alt="TTD"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div style={{ clear: "both" }}></div>
        <p
          style={{
            textIndent: "295px",
            fontFamily: "Times New Roman",
            fontSize: "12px",
            fontWeight: "bold",
            textDecoration: "underline",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          ({dataKaprodi.nama_lengkap})
        </p>

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

  const [isPrinting, setIsPrinting] = useState(false);

  const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return "-";
    const namaBulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = new Date(dateStr);
    return `${namaHari[d.getDay()]}, ${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleCetakBeritaAcara = async () => {
    setIsPrinting(true);
    try {
      const BA_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/berita-acara-kolo/${router.query.id}`;
      const response = await axios.get(BA_URL);
      const ba = response.data.data;

      const nilaiAkhir = ba.nilai_akhir;
      const tanggalFormatted = formatTanggalIndo(ba.jadwal_pelaksanaan);
      const waktu = ba.waktu || "-";
      const tempat = ba.tempat || "-";

      // Build list of penilaian per-dosen for the second form
      const penilaianList = ba.penilaian_list || [];

      // Helper for dosen name resolver
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

      const pembimbing1Nama = ba.nama_pembimbing_1 || getDosenNama(ba.kolo_pembimbing_1);
      const pembimbing2Nama = ba.nama_pembimbing_2 || getDosenNama(ba.kolo_pembimbing_2);
      const pembimbing3Nama = ba.nama_pembimbing_3 || getDosenNama(ba.kolo_pembimbing_3);
      const evaluator1Nama = ba.nama_evaluator_1 || getDosenNama(ba.evaluator_1);
      const evaluator2Nama = ba.nama_evaluator_2 || getDosenNama(ba.evaluator_2);

      const kaprodiNama = ba.kaprodi?.nama_lengkap || "Hersanto Fajri, S.Ds., M.MD";
      const kaprodiNIK = ba.kaprodi?.nip || "";
      const kaprodiTTD = ba.kaprodi?.ttd || null;

      const ttdImgTag = kaprodiTTD
        ? `<img src="${FILE_URL}/${kaprodiTTD}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;margin:0 auto;" />`
        : `<div style="height:50px;"></div>`;

      // Fallback calculations for dummy data missing values
      let calcP1 = nilaiAkhir?.penilaian_1;
      let calcP2 = nilaiAkhir?.penilaian_2;
      let calcP3 = nilaiAkhir?.penilaian_3;
      let calcP4 = nilaiAkhir?.penilaian_4;
      let calcP5 = nilaiAkhir?.penilaian_5;
      let calcFinal = nilaiAkhir?.nilai_akhir;
      let calcMutu = nilaiAkhir?.huruf_mutu;

      if (penilaianList && penilaianList.length > 0) {
        if (!calcP1) calcP1 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_1 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP2) calcP2 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_2 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP3) calcP3 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_3 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP4) calcP4 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_4 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcP5) calcP5 = (penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_5 || 0), 0) / penilaianList.length).toFixed(2);
        if (!calcFinal) {
          calcFinal = (
            parseFloat(calcP1) * 0.2 +
            parseFloat(calcP2) * 0.4 +
            parseFloat(calcP3) * 0.1 +
            parseFloat(calcP4) * 0.1 +
            parseFloat(calcP5) * 0.2
          ).toFixed(2);
        }
      }
      
      if (!calcMutu && calcFinal) {
        if (calcFinal >= 80) calcMutu = "A";
        else if (calcFinal >= 73) calcMutu = "AB";
        else if (calcFinal >= 65) calcMutu = "B";
        else if (calcFinal >= 60) calcMutu = "BC";
        else if (calcFinal >= 55) calcMutu = "C";
        else if (calcFinal >= 50) calcMutu = "CD";
        else if (calcFinal >= 45) calcMutu = "D";
        else calcMutu = "E";
      }

      // Build interval nilai section
      const intervalNilai = `
        <div style="font-size:10px;font-family:'Times New Roman';">
          <div>Interval Nilai Akhir :</div>
          <div>80 ≤ A = 100</div>
          <div>73 ≤ AB &lt; 80</div>
          <div>65 ≤ B &lt; 73</div>
          <div>60 ≤ BC &lt; 65</div>
          <div>55 ≤ C &lt; 60</div>
          <div>50 ≤ CD &lt; 55</div>
          <div>45 ≤ D &lt; 50</div>
          <div>E &lt; 45</div>
        </div>
      `;

      // Page 1: Berita Acara (summary page signed by Kaprodi)
      const page1 = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:14px;text-decoration:underline;margin:10px 0 4px;">
            BERITA ACARA DAN PENILAIAN
          </h2>
          <h3 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:0 0 20px;">
            SEMINAR PROPOSAL / KOLOKIUM SKRIPSI MAHASISWA
          </h3>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
            <tr>
              <td style="width:200px;padding:3px 0;">NAMA</td>
              <td style="width:10px;">:</td>
              <td style="padding:3px 0;">${ba.nama_lengkap || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">NIM</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.npm || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">JUDUL</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.judul_skripsi || "-"}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">HARI, TANGGAL / JAM</td>
              <td>:</td>
              <td style="padding:3px 0;">${tanggalFormatted} / ${waktu}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">TEMPAT</td>
              <td>:</td>
              <td style="padding:3px 0;">${tempat}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">PEMBIMBING YANG DIUSULKAN</td>
              <td>:</td>
              <td style="padding:3px 0;">
                ${pembimbing1Nama ? `1. ${pembimbing1Nama}` : ""}
                ${pembimbing2Nama ? `<br/>2. ${pembimbing2Nama}` : ""}
                ${pembimbing3Nama ? `<br/>3. ${pembimbing3Nama}` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;">EVALUATOR</td>
              <td>:</td>
              <td style="padding:3px 0;">
                ${evaluator1Nama ? `1. ${evaluator1Nama}` : ""}
                ${evaluator2Nama ? `<br/>2. ${evaluator2Nama}` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;">KOMENTAR SINGKAT</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.komentar || "-"}</td>
            </tr>
          </table>

          <div style="margin-bottom:10px;font-weight:bold;font-size:12px;">PENILAIAN KOLOKIUM :</div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
            <thead>
              <tr>
                <th style="border:1px solid black;padding:6px;text-align:center;">ASPEK PENILAIAN</th>
                <th style="border:1px solid black;padding:6px;text-align:center;">NILAI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border:1px solid black;padding:6px;">1. Substansi dan orisinalitas topik penelitian</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP1 || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">2. Konsistensi antara masalah, tujuan penelitian dan metodologi penelitian</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP2 || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">3. Organisasi, kelengkapan dan teknis penulisan makalah</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP3 || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">4. Penyajian Makalah dan tampilan slide</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP4 || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">5. Argumentasi</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP5 || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;font-weight:bold;">Nilai Akhir</td>
                <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${calcFinal || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;font-weight:bold;">Nilai Mutu</td>
                <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${calcMutu || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            ${intervalNilai}
            <div style="text-align:center;min-width:200px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Ketua Program Studi,</div>
              <div style="margin:10px auto;">${ttdImgTag}</div>
              <div style="font-weight:bold;text-decoration:underline;">(${kaprodiNama})</div>
              <div>NIK. ${kaprodiNIK}</div>
            </div>
          </div>


        </div>
      `;

      // Page 2+: Form Penilaian per Dosen (one page per penilaian)
      const buildFormPenilaian = (p, peranLabel, dosenNamaDisplay, dosenNip) => {
        let finalNilai = p.final_nilai;
        let hurufMutu = p.huruf_mutu;
        if (!finalNilai && p.penilaian_1) {
          finalNilai = (
            parseFloat(p.penilaian_1) * 0.2 +
            parseFloat(p.penilaian_2) * 0.4 +
            parseFloat(p.penilaian_3) * 0.1 +
            parseFloat(p.penilaian_4) * 0.1 +
            parseFloat(p.penilaian_5) * 0.2
          ).toFixed(2);
          
          if (finalNilai >= 80) hurufMutu = "A";
          else if (finalNilai >= 73) hurufMutu = "AB";
          else if (finalNilai >= 65) hurufMutu = "B";
          else if (finalNilai >= 60) hurufMutu = "BC";
          else if (finalNilai >= 55) hurufMutu = "C";
          else if (finalNilai >= 50) hurufMutu = "CD";
          else if (finalNilai >= 45) hurufMutu = "D";
          else hurufMutu = "E";
        }

        return `
          <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px; page-break-before:always;">
            <div style="text-align:center; margin-bottom:20px;">
              <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
            </div>
            <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:10px 0 20px;">
              FORM PENILAIAN SEMINAR PROPOSAL / KOLOKIUM
            </h2>

            <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
              <tr>
                <td style="width:200px;padding:3px 0;font-weight:bold;">NAMA</td>
                <td style="width:10px;">:</td>
                <td style="padding:3px 0;">${ba.nama_lengkap || "-"}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">NPM</td>
                <td>:</td>
                <td style="padding:3px 0;">${ba.npm || "-"}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">${peranLabel}</td>
                <td>:</td>
                <td style="padding:3px 0;">${dosenNamaDisplay}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">JUDUL</td>
                <td>:</td>
                <td style="padding:3px 0;">${ba.judul_skripsi || "-"}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">TANGGAL DAN WAKTU</td>
                <td>:</td>
                <td style="padding:3px 0;">${tanggalFormatted} / ${waktu}</td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
              <thead>
                <tr>
                  <th style="border:1px solid black;padding:6px;text-align:center;">ASPEK PENILAIAN</th>
                  <th style="border:1px solid black;padding:6px;text-align:center;">PERSENTASE (%)</th>
                  <th style="border:1px solid black;padding:6px;text-align:center;">NILAI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid black;padding:6px;">1. Substansi dan orisinalitas topik penelitian</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">20</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_1 || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">2. Konsistensi antara masalah, tujuan penelitian dan metodologi penelitian</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">40</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_2 || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">3. Organisasi, kelengkapan dan teknis penulisan makalah</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">10</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_3 || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">4. Penyajian Makalah dan tampilan slide</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">10</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_4 || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">5. Argumentasi</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">20</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_5 || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;font-weight:bold;">NILAI AKHIR</td>
                  <td style="border:1px solid black;padding:6px;"></td>
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${finalNilai || "-"}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;font-weight:bold;">HURUF MUTU</td>
                  <td style="border:1px solid black;padding:6px;"></td>
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${hurufMutu || "-"}</td>
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

            <div style="text-align:right;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>${peranLabel},</div>
              <div style="margin:50px 0 4px;">&nbsp;</div>
              <div style="font-weight:bold;text-decoration:underline;">(${dosenNamaDisplay && dosenNamaDisplay !== "-" ? dosenNamaDisplay : "........................................................."})</div>
              <div>NIK : ${dosenNip || "-"}</div>
            </div>


          </div>
        `;
      };

      const expectedDosenList = [
        { roleKey: "pembimbing_1", label: "Pembimbing I", name: pembimbing1Nama, dbId: ba.kolo_pembimbing_1 },
        { roleKey: "pembimbing_2", label: "Pembimbing II", name: pembimbing2Nama, dbId: ba.kolo_pembimbing_2 },
        { roleKey: "evaluator_1", label: "Evaluator I", name: evaluator1Nama, dbId: ba.evaluator_1 },
        { roleKey: "evaluator_2", label: "Evaluator II", name: evaluator2Nama, dbId: ba.evaluator_2 },
      ].map(d => ({ ...d, nip: getDosenNip(d.dbId) }));

      const formPages = expectedDosenList.map(dosen => {
        let p = penilaianList.find(x => String(x.dosen_id) === String(dosen.dbId));
        if (!p) {
           p = penilaianList.find(x => {
             const role = x.peran ? x.peran.trim().toLowerCase().replace(/\s+/g, "_") : "";
             return role === dosen.roleKey;
           });
        }
        if (!p) p = {};

        return buildFormPenilaian(p, dosen.label, dosen.name, dosen.nip);
      }).join("");
      const fullContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
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
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Pop-up diblokir oleh browser. Izinkan pop-up untuk mencetak.");
        return;
      }
      printWindow.document.write(fullContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } catch (error) {
      console.error("Error fetching berita acara:", error);
      alert("Gagal memuat data Berita Acara. Pastikan data penilaian sudah lengkap.");
    } finally {
      setIsPrinting(false);
    }
  };

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>
            BERITA ACARA DAN PENILAIAN SEMINAR PROPOSAL / KOLOKIUM SKRIPSI
            MAHASISWA
          </div>
        </Card.Header>
      </Card>
      <div className="flex-1 block">
        <div className="space-y-2 mt-4">
          <Accordion title="Summary">
            <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
              <Card.Body className="mx-6">
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
                  <Form.Label className="min-w-[14rem]">Judul</Form.Label>
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
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">
                    Pembimbing yang diusulkan
                  </Form.Label>
                  <span>:</span>
                  <Form.Combobox
                    name="pembimbing_1"
                    value={form.pembimbing_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handlePembimbing1}
                  />
                  <Form.Combobox
                    name="pembimbing_2"
                    value={form.pembimbing_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handlePembimbing2}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">Evaluator</Form.Label>
                  <span>:</span>
                  <Form.Combobox
                    name="evaluator_1"
                    value={form.evaluator_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handleEvaluator1}
                  />
                  <Form.Combobox
                    name="evaluator_2"
                    value={form.evaluator_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handleEvaluator2}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">
                    Komentar Singkat
                  </Form.Label>
                  <span>:</span>
                  <Form.Textarea
                    className="flex-1 mt-2"
                    rows="5"
                    name="komentar"
                    value={form.komentar}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-1/4 h-12 mt-4"
                    onClick={handleCetakBeritaAcara}
                    disabled={isPrinting}
                  >
                    {isPrinting ? "Memuat..." : "Print"}
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
        </div>
      </div>
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
              REKAPITULASI SEMINAR PROPOSAL
              <Button
                onClick={() =>
                  window.open(`${form.link_dok_makalah}`, "_blank")
                }
                variant="primary"
                icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                pill
              >
                Link Dokumen Makalah
              </Button>
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200 w-12">
              <div className="flex gap-2">No</div>
            </th>

            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 ">Aspek Penilaian</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 ">Presentase (%)</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 ">Nilai</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">1</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Subtansi dan Orientasi Topik Penilitian
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              20%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_1}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">2</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
              Penelitian
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              40%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_2}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">3</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Organisasi, kelengkapan dan Teknik Penulisan Makalah
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_3}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">4</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Penyajian Makalah dan Tampilan Slide
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_4}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">5</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Argumentasi
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              20%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_5}
            </td>
          </tr>
        </tbody>
      </table>
      <Card className="mt-2">
        <div className="p-4 flex flex-col">
          <div className="flex justify-end">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Nilai Akhir :</span>{" "}
              <span>{form?.nilai_akhir.nilai_akhir}</span>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Huruf Mutu :</span>{" "}
              <span>{form?.nilai_akhir.huruf_mutu}</span>
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
                    Subtansi dan Orientasi Topik Penilitian
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    20%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Subtansi dan Orientasi Topik Penilitian"
                      data={item.penilaian_1}
                      name="penilaian_1"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    2
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    40%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_2}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                      Penelitian"
                      data={item.penilaian_2}
                      name="penilaian_2"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    3
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Organisasi, kelengkapan dan Teknik Penulisan Makalah
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_3}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                      data={item.penilaian_3}
                      name="penilaian_3"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    4
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Penyajian Makalah dan Tampilan Slide
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_4}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Penyajian Makalah dan Tampilan Slide"
                      data={item.penilaian_4}
                      name="penilaian_4"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    5
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Argumentasi
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    20%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_5}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Argumentasi"
                      data={item.penilaian_5}
                      name="penilaian_5"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
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
          icon={<Icon icon="ic:baseline-print" width={20} height={20} />}
        >
          {isPrinting ? "Memuat..." : "Cetak Berita Acara"}
        </Button>
      </div>
    </Layout>
  );
}
