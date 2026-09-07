import { Icon } from '@iconify-icon/react'
import Button from '../../../../../components/Button'
import Card from '../../../../../components/Card'
import Form from '../../../../../components/Form'
import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import useMenu from '../../../../../hooks/useMenu'
import useUser from '../../../../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useDosen from '../../../../../repo/dosen'
import useCRUD from '../../../../../hooks/useCRUD'
import { Loading } from '../../../../../components/Loading'
import date from '../../../../../utils/date'
import EditNilai from '../../../../../components/EditPenilaian/edit-nilai'
import EditKomentar from '../../../../../components/EditPenilaian/edit-komentar'
import Link from 'next/link'
import EditNilaiSidang from '../../../../../components/EditPenilaian/edit-nilai-sidang'
import axios from 'axios'
import { escapeHtmlDeep } from '../../../../../utils/escapeHtml'

export default function PelaksanaanSidang() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/detail-penilaian-sidang-dosen`

  const INITIAL_FORM = {
    pengajuan_sk_id: '',
    sidang_id: '',
    nama_lengkap: '',
    semester: '',
    email: '',
    no_hp: '',
    npm: '',
    judul_skripsi: '',
    link_dok_mhs_aktif: '',
    link_dok_pembayaran: '',
    sidang_pembimbing_1: '',
    sidang_pembimbing_2: '',
    sidang_pembimbing_3: null,
    sidang_status_pem_1: '',
    sidang_status_pem_2: '',
    sidang_status_pem_3: '',
    penguji_1: '',
    penguji_2: '',
    // jadwal_pelaksanaan: "",
    statusDosen: '',
    penilaian_1: '',
    penilaian_2: '',
    penilaian_3: '',
    penilaian_4: '',
    komentar_singkat: '',
    dosen_id: '',
    penilaian_sidang: null,
    statusDosen: '',
    link_draft_final_skripsi: '',
    jadwal_pelaksanaan: '',
  }

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  const CREATE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/penilaian-sidang`
  const CREATE_OPTION = { url: `${CREATE_URL}`, method: 'POST' }

  // -- Cetak Berita Acara (subset khusus dosen: Berita Acara + Rekapitulasi
  // Nilai saja - TIDAK termasuk Lembar Penilaian & Lembar Perbaikan per-dosen
  // yang berisi nilai/komentar dosen penguji lain, itu cuma untuk admin.
  const [isPrinting, setIsPrinting] = useState(false)
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/ttd`
  const FILE_URL_KOP = `${process.env.NEXT_PUBLIC_API_URL}/img`

  const buildTtdUrl = value => {
    if (!value) return null
    const v = String(value).trim()
    if (!v) return null
    if (/^https?:\/\//i.test(v)) return v
    const cleaned = v.replace(/^\/+/, '').replace(/^(public\/)?ttd\//i, '')
    return `${FILE_URL}/${cleaned}`
  }

  const formatTanggalIndo = dateStr => {
    if (!dateStr) return '-'
    const tgl = new Date(dateStr)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return tgl.toLocaleDateString('id-ID', options)
  }

  const handleCetakBeritaAcara = async () => {
    setIsPrinting(true)
    try {
      const BA_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/berita-acara-sidang/${router.query.id}`
      const response = await axios.get(BA_URL)
      // Dirakit jadi HTML mentah lewat document.write() (bukan JSX, jadi tidak
      // auto-escape React) - escape semua nilai string dulu di sini.
      const ba = escapeHtmlDeep(response.data?.data)

      if (!ba) {
        throw new Error(
          response.data?.message || 'Data berita acara tidak ditemukan atau format respon tidak sesuai.'
        )
      }

      const nilaiAkhir = ba.nilai_akhir
      const tanggalFormatted = formatTanggalIndo(ba.jadwal_pelaksanaan)
      const waktu = ba.waktu || '....'
      const tempat = ba.tempat || 'Ruang Sidang Fakultas Teknik UIKA Bogor'
      const penilaianList = ba.penilaian_list || []

      const getDosenNama = id => {
        if (!id || id === '0' || id === 0) return '-'
        if (listDosen) {
          const found = listDosen.find(d => String(d.user_id) === String(id))
          if (found) return found.nama_lengkap
        }
        return '-'
      }

      const getDosenNip = id => {
        if (!id || id === '0' || id === 0) return ''
        if (listDosen) {
          const found = listDosen.find(d => String(d.user_id) === String(id))
          if (found) return found.nip || ''
        }
        return ''
      }

      const getDosenTtd = id => {
        if (!id || id === '0' || id === 0) return null
        if (listDosen) {
          const found = listDosen.find(d => String(d.user_id) === String(id))
          if (found) return found.ttd || null
        }
        return null
      }

      const pembimbing1Nama = ba.nama_pembimbing_1 || getDosenNama(ba.sidang_pembimbing_1)
      const pembimbing2Nama = ba.nama_pembimbing_2 || getDosenNama(ba.sidang_pembimbing_2)
      const penguji1Nama = ba.nama_penguji_1 || getDosenNama(ba.penguji_1)
      const penguji2Nama = ba.nama_penguji_2 || getDosenNama(ba.penguji_2)
      const ketuaPengujiNama = ba.nama_ketua_penguji || getDosenNama(ba.ketua_penguji) || pembimbing1Nama
      const sekretarisSidangNama =
        ba.nama_sekertaris_sidang || getDosenNama(ba.sekertaris_sidang) || penguji1Nama

      const kaprodiNama = ba.kaprodi?.nama_lengkap || 'Hersanto Fajri, S.Ds., M.MD'
      const kaprodiNIK = ba.kaprodi?.nip || ''
      const kaprodiTTD = ba.kaprodi?.ttd || null

      const ttdImgTag = kaprodiTTD
        ? `<img src="${buildTtdUrl(kaprodiTTD)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;" />`
        : `<div style="height:50px;"></div>`

      let calcP1 = nilaiAkhir?.penilaian_1
      let calcP2 = nilaiAkhir?.penilaian_2
      let calcP3 = nilaiAkhir?.penilaian_3
      let calcP4 = nilaiAkhir?.penilaian_4
      let calcFinal = nilaiAkhir?.nilai_akhir
      let calcMutu = nilaiAkhir?.huruf_mutu

      if (penilaianList && penilaianList.length > 0) {
        if (!calcP1)
          calcP1 = (
            penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_1 || 0), 0) / penilaianList.length
          ).toFixed(2)
        if (!calcP2)
          calcP2 = (
            penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_2 || 0), 0) / penilaianList.length
          ).toFixed(2)
        if (!calcP3)
          calcP3 = (
            penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_3 || 0), 0) / penilaianList.length
          ).toFixed(2)
        if (!calcP4)
          calcP4 = (
            penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_4 || 0), 0) / penilaianList.length
          ).toFixed(2)
        if (!calcFinal) {
          calcFinal = (
            parseFloat(calcP1) * 0.4 +
            parseFloat(calcP2) * 0.1 +
            parseFloat(calcP3) * 0.4 +
            parseFloat(calcP4) * 0.1
          ).toFixed(2)
        }
      }

      if (!calcMutu && calcFinal) {
        const fn = parseFloat(calcFinal)
        if (fn >= 80) calcMutu = 'A'
        else if (fn >= 73) calcMutu = 'AB'
        else if (fn >= 65) calcMutu = 'B'
        else if (fn >= 60) calcMutu = 'BC'
        else if (fn >= 55) calcMutu = 'C'
        else if (fn >= 50) calcMutu = 'CD'
        else if (fn >= 45) calcMutu = 'D'
        else calcMutu = 'E'
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
      `

      const buildTimRow = (nama, jabatan, ttd) => {
        const displayName = !nama || nama === '-' ? '' : nama
        const ttdUrl = buildTtdUrl(ttd)
        const ttdCell = ttdUrl
          ? `<img src="${ttdUrl}" alt="TTD" style="height:28px;max-width:85px;object-fit:contain;" />`
          : ''
        return `
          <tr>
            <td style="border:1px solid black;padding:3px 6px;font-size:10px;">${displayName}</td>
            <td style="border:1px solid black;padding:3px 6px;text-align:center;font-size:10px;">${jabatan}</td>
            <td style="border:1px solid black;padding:3px 6px;width:90px;height:28px;text-align:center;">${ttdCell}</td>
          </tr>
        `
      }

      const semesterTA = ba.semester || '........'
      const hariTanggal = tanggalFormatted || '.......................'

      const page1 = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:22px 30px;">
          <div style="text-align:center; margin-bottom:12px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:14px;text-decoration:underline;margin:6px 0 12px;letter-spacing:1px;">
            BERITA ACARA PELAKSANAAN UJIAN SKRIPSI
          </h2>

          <p style="text-align:justify;line-height:1.6;margin-bottom:8px;">
            Pada tanggal ${hariTanggal} pukul ${waktu} WIB sampai dengan selesai bertempat di ${tempat} telah berlangsung Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana ${semesterTA} di Jurusan/PS Teknik Informatika, Fakultas Teknik dan Sains UIKA Bogor dengan kandidat:
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px;line-height:1.5;">
            <tr>
              <td style="width:190px;padding:1px 0;vertical-align:top;">Nama</td>
              <td style="width:14px;vertical-align:top;">:</td>
              <td style="padding:1px 0;font-weight:bold;">${ba.nama_lengkap || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">Tempat, tanggal lahir</td>
              <td>:</td>
              <td style="padding:1px 0;">${ba.tempat_lahir ? `${ba.tempat_lahir}, ${formatTanggalIndo(ba.tanggal_lahir)}` : '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">NPM</td>
              <td>:</td>
              <td style="padding:1px 0;">${ba.npm || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;vertical-align:top;">Judul Tugas Akhir</td>
              <td style="vertical-align:top;">:</td>
              <td style="padding:1px 0;">${ba.judul_skripsi || '-'}</td>
            </tr>
          </table>

          <p style="margin-bottom:6px;font-size:12px;line-height:1.4;">Susunan Tim Penguji Ujian Skripsi (Tugas Akhir) pada Sidang Sarjana:</p>

          <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:8px;">
            <thead>
              <tr style="background-color:#f0f0f0;">
                <th style="border:1px solid black;padding:2px 6px;text-align:center;">NAMA</th>
                <th style="border:1px solid black;padding:2px 6px;text-align:center;width:160px;">JABATAN</th>
                <th style="border:1px solid black;padding:2px 6px;text-align:center;width:90px;">TANDA TANGAN</th>
              </tr>
            </thead>
            <tbody>
              ${buildTimRow(ketuaPengujiNama, 'Ketua Sidang', getDosenTtd(ba.ketua_penguji))}
              ${buildTimRow(pembimbing1Nama, 'Pembimbing Utama', getDosenTtd(ba.sidang_pembimbing_1))}
              ${buildTimRow(pembimbing2Nama, 'Pembimbing Pendamping', getDosenTtd(ba.sidang_pembimbing_2))}
              ${buildTimRow(penguji1Nama, 'Penguji I', getDosenTtd(ba.penguji_1))}
              ${buildTimRow(penguji2Nama, 'Penguji II', getDosenTtd(ba.penguji_2))}
              ${buildTimRow(sekretarisSidangNama, 'Sekretaris sidang sebagai Notulis', getDosenTtd(ba.sekertaris_sidang))}
            </tbody>
          </table>

          <p style="text-align:justify;line-height:1.4;font-size:12px;margin-bottom:8px;">
            Kandidat tersebut memperoleh angka mutu: <strong>${calcFinal || '...'}</strong> yang dikonversi ke huruf mutu: <strong>${calcMutu || '...'}</strong>, sehingga dinyatakan: <strong>${nilaiAkhir?.status_kelulusan || ba.status_kelulusan || 'lulus / lulus bersyarat / tidak lulus'}</strong>*) dengan catatan:<br/>
            ${
              ba.komentar
                ? `<div style="padding-left:16px;">${ba.komentar}</div>`
                : `
            <ol style="margin-top:2px; margin-bottom:8px; padding-left:20px;">
              <li>.......................................................................................................................................................</li>
              <li>.......................................................................................................................................................</li>
              <li>.......................................................................................................................................................</li>
            </ol>
            `
            }
          </p>

          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;margin-bottom:4px;page-break-inside:avoid;">
            <div style="text-align:left;min-width:220px;">
              <div>Mengetahui:</div>
              <div>Dekan Fakultas Teknik dan Sains,</div>
              <div style="height:36px;margin:2px 0;">&nbsp;</div>
              <div style="font-weight:bold;text-decoration:underline;">Dr. Feril Hariati, S.T., M.Eng</div>
              <div>NIK: 410 100 280</div>
              <div style="margin-top:4px;font-size:11px;">*) pilih salah satu</div>
            </div>
            <div style="text-align:left;min-width:220px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Ketua Jurusan/PS Teknik Informatika,</div>
              <div style="height:36px;margin:2px 0;display:flex;align-items:center;">${ttdImgTag}</div>
              <div style="font-weight:bold;text-decoration:underline;">${kaprodiNama}</div>
              <div>NIK: ${kaprodiNIK}</div>
            </div>
          </div>
        </div>
      `

      const expectedDosenList = [
        { roleKey: 'pembimbing_1', label: 'Pembimbing Utama', name: pembimbing1Nama, dbId: ba.sidang_pembimbing_1 },
        {
          roleKey: 'pembimbing_2',
          label: 'Pembimbing Pendamping',
          name: pembimbing2Nama,
          dbId: ba.sidang_pembimbing_2,
        },
        { roleKey: 'penguji_1', label: 'Penguji I', name: penguji1Nama, dbId: ba.penguji_1 },
        { roleKey: 'penguji_2', label: 'Penguji II', name: penguji2Nama, dbId: ba.penguji_2 },
      ].map(d => ({ ...d, nip: getDosenNip(d.dbId), ttd: getDosenTtd(d.dbId) }))

      const findPenilaianForDosen = dosen => {
        let p = penilaianList.find(x => String(x.dosen_id) === String(dosen.dbId))
        if (!p) {
          p = penilaianList.find(x => {
            if (!x.peran) return false
            const r = x.peran.trim().toLowerCase()
            const rNorm = r.replace(/\s+/g, '_')
            const roleKey = dosen.roleKey
            const label = dosen.label.trim().toLowerCase()
            return (
              rNorm === roleKey ||
              r === label ||
              (roleKey === 'penguji_1' && (r === 'penguji i' || r === 'penguji 1' || rNorm === 'penguji_i' || rNorm === 'penguji_1')) ||
              (roleKey === 'penguji_2' && (r === 'penguji ii' || r === 'penguji 2' || rNorm === 'penguji_ii' || rNorm === 'penguji_2')) ||
              (roleKey === 'pembimbing_1' && (r === 'pembimbing utama' || rNorm === 'pembimbing_utama')) ||
              (roleKey === 'pembimbing_2' && (r === 'pembimbing pendamping' || rNorm === 'pembimbing_pendamping'))
            )
          })
        }
        return p || {}
      }

      const buildRekapitulasiRow = dosenInfo => {
        let p = findPenilaianForDosen(dosenInfo)

        const p1 = p.penilaian_1 ? (parseFloat(p.penilaian_1) * 0.4).toFixed(2) : '-'
        const p2 = p.penilaian_2 ? (parseFloat(p.penilaian_2) * 0.1).toFixed(2) : '-'
        const p3 = p.penilaian_3 ? (parseFloat(p.penilaian_3) * 0.4).toFixed(2) : '-'
        const p4 = p.penilaian_4 ? (parseFloat(p.penilaian_4) * 0.1).toFixed(2) : '-'

        let t = p.final_nilai
        if (!t && p.penilaian_1) {
          t = (
            parseFloat(p.penilaian_1) * 0.4 +
            parseFloat(p.penilaian_2) * 0.1 +
            parseFloat(p.penilaian_3) * 0.4 +
            parseFloat(p.penilaian_4) * 0.1
          ).toFixed(2)
        }

        return `
          <tr>
            <td style="border:1px solid black;padding:4px;font-size:11px;">${dosenInfo.label}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;">${dosenInfo.name && dosenInfo.name !== '-' ? dosenInfo.name : ''}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;">${p1}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;">${p2}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;">${p3}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;">${p4}</td>
            <td style="border:1px solid black;padding:4px;font-size:11px;text-align:center;font-weight:bold;">${t || '-'}</td>
            <td style="border:1px solid black;padding:4px;width:100px;text-align:center;">${buildTtdUrl(dosenInfo.ttd) ? `<img src="${buildTtdUrl(dosenInfo.ttd)}" alt="TTD" style="height:30px;max-width:90px;object-fit:contain;" />` : ''}</td>
          </tr>
        `
      }

      const rekapRows = expectedDosenList.map(d => buildRekapitulasiRow(d)).join('')

      const rekapPage = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:20px 30px; page-break-before:always;">
          <div style="text-align:center; margin-bottom:10px;">
            <img src="${FILE_URL_KOP}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
          </div>
          <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:6px 0 10px;">
            REKAPITULASI NILAI UJIAN SKRIPSI
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px;">
            <tr>
              <td style="width:200px;padding:1px 0;">N a m a</td>
              <td style="width:14px;">:</td>
              <td style="padding:1px 0;">${ba.nama_lengkap || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">N P M</td>
              <td>:</td>
              <td style="padding:1px 0;">${ba.npm || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">Judul Tugas Akhir</td>
              <td>:</td>
              <td style="padding:1px 0;">${ba.judul_skripsi || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">Dosen Pembimbing Utama</td>
              <td>:</td>
              <td style="padding:1px 0;">${pembimbing1Nama || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">Dosen Pembimbing Pendamping</td>
              <td>:</td>
              <td style="padding:1px 0;">${pembimbing2Nama || '-'}</td>
            </tr>
            <tr>
              <td style="padding:1px 0;">PERINCIAN NILAI</td>
              <td>:</td>
              <td style="padding:1px 0;"></td>
            </tr>
          </table>

          <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">
            <thead>
              <tr style="background-color:#f0f0f0;">
                <th rowSpan="2" style="border:1px solid black;padding:3px 6px;text-align:center;">Tim Sidang Sarjana</th>
                <th rowSpan="2" style="border:1px solid black;padding:3px 6px;text-align:center;width:140px;">Nama</th>
                <th colSpan="4" style="border:1px solid black;padding:3px 6px;text-align:center;">PERINCIAN NILAI SIDANG</th>
                <th rowSpan="2" style="border:1px solid black;padding:3px 6px;text-align:center;width:60px;">Total</th>
                <th rowSpan="2" style="border:1px solid black;padding:3px 6px;text-align:center;">Tanda Tangan</th>
              </tr>
              <tr style="background-color:#f0f0f0;">
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:50px;">Nilai Skripsi 40 %</th>
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:50px;">Presentasi 10 %</th>
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:50px;">Penguasaan Materi 40%</th>
                <th style="border:1px solid black;padding:3px 6px;text-align:center;width:50px;">Penampilan 10%</th>
              </tr>
            </thead>
            <tbody>
              ${rekapRows}
            </tbody>
          </table>

          <div style="margin-top:8px;">
            <table style="width:100%;font-size:12px;margin-bottom:8px;">
              <tr>
                <td style="width:100px;padding:1px 0;">Hasil Nilai</td>
                <td style="padding:1px 0;">: Dinyatakan : ${nilaiAkhir?.status_kelulusan || ba.status_kelulusan || 'Lulus / Tidak Lulus'}</td>
              </tr>
              <tr>
                <td style="padding:1px 0;vertical-align:top;">Catatan</td>
                <td style="padding:1px 0;">: ${ba.komentar ? ba.komentar : 'Perlu Perbaikan dikumpulkan tanggal :<br/><br/>.......................................................................................................................................................................................................'}</td>
              </tr>
            </table>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:8px;">
            <div style="text-align:left;min-width:200px;">
              <div>&nbsp;</div>
              <div>Ketua Sidang,</div>
              <div style="margin:4px 0 2px;">${buildTtdUrl(getDosenTtd(ba.ketua_penguji)) ? `<img src="${buildTtdUrl(getDosenTtd(ba.ketua_penguji))}" alt="TTD" style="height:36px;max-width:100px;object-fit:contain;" />` : `<div style="height:36px;"></div>`}</div>
              <div style="font-weight:bold;text-decoration:underline;">${ketuaPengujiNama && ketuaPengujiNama !== '-' ? ketuaPengujiNama : '.............................................'}</div>
              <div>NIK: ${getDosenNip(ba.ketua_penguji) || '.....................'}</div>
            </div>
            <div style="text-align:left;min-width:200px;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>Sekretaris sidang sebagai Notulis,</div>
              <div style="margin:4px 0 2px;">${buildTtdUrl(getDosenTtd(ba.sekertaris_sidang)) ? `<img src="${buildTtdUrl(getDosenTtd(ba.sekertaris_sidang))}" alt="TTD" style="height:36px;max-width:100px;object-fit:contain;" />` : `<div style="height:36px;"></div>`}</div>
              <div style="font-weight:bold;text-decoration:underline;">${sekretarisSidangNama && sekretarisSidangNama !== '-' ? sekretarisSidangNama : '.............................................'}</div>
              <div>NIK: ${getDosenNip(ba.sekertaris_sidang) || '.....................'}</div>
            </div>
          </div>

          <div style="margin-top:8px;">${intervalNilai}</div>
        </div>
      `

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
          ${rekapPage}
        </body>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 800);
          }
        </script>
        </html>
      `

      const newWindow = window.open('', '_blank')
      newWindow.document.write(fullContent)
      newWindow.document.close()
    } catch (error) {
      console.error(error)
      alert('Gagal memuat data berita acara: ' + (error?.response?.data?.message || error.message || ''))
    } finally {
      setIsPrinting(false)
    }
  }

  useEffect(() => {
    if (router.isReady === false || !user) return
    show(router.query.id, {
      transformData: data => ({
        ...data,
        // jadwal_pelaksanaan: data.jadwal_pelaksanaan
        //   ? date.formatToInput(data.jadwal_pelaksanaan)
        //   : "",
      }),
    })
  }, [router, user])

  if ([user, menu, isDosenLoading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>Penilaian Sidang</div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Nama</Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_lengkap"
              value={form.nama_lengkap}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">NPM</Form.Label>
            <span>:</span>
            <Form.Input type="text" className="flex-1" name="npm" value={form.npm} disabled />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Judul Skripsi</Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="judul_skripsi"
              value={form.judul_skripsi}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">
              {form.statusDosen === 'penguji_1'
                ? 'Penguji 1'
                : form.statusDosen === 'penguji_2'
                  ? 'Penguji 2'
                  : form.statusDosen === 'pembimbing_1'
                    ? 'Pembimbing 1'
                    : form.statusDosen === 'pembimbing_2'
                      ? 'Pembimbing 2'
                      : form.statusDosen === 'pembimbing_3'
                        ? 'Pembimbing 3'
                        : ''}
            </Form.Label>
            <span>:</span>
            <Form.Select
              name="dosen_id"
              value={
                form.statusDosen === 'penguji_1'
                  ? form.penguji_1
                  : form.statusDosen === 'penguji_2'
                    ? form.penguji_2
                    : form.statusDosen === 'pembimbing_1'
                      ? form.sidang_pembimbing_1
                      : form.statusDosen === 'pembimbing_2'
                        ? form.sidang_pembimbing_2
                        : form.statusDosen === 'pembimbing_3'
                          ? form.sidang_pembimbing_3
                          : ''
              }
              options={
                listDosen &&
                listDosen.map(dosen => ({
                  label: dosen.nama_lengkap,
                  value: dosen.user_id,
                }))
              }
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Jadwal Pelaksanaan</Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="jadwal_pelaksanaan"
              value={form?.jadwal_pelaksanaan && date.formatToInput(form.jadwal_pelaksanaan)}
              placeholder="Diisi oleh admin"
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Link Dokumen</Form.Label>
            <span>:</span>
            <Button
              onClick={() => window.open(`${form.link_draft_final_skripsi}`, '_blank')}
              variant="primary"
              icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
              pill
            >
              Link Draft Final Skripsi
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      {form.statusDosen !== '' && (
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleCetakBeritaAcara}
            disabled={isPrinting}
          >
            {isPrinting ? 'Mencetak...' : 'Cetak Berita Acara'}
          </Button>
        </div>
      )}

      {form.penilaian_sidang == null &&
        form.statusDosen !== '' &&
        form.statusDosen !== 'kepala_lab' && (
          <Form onSubmit={event => submitHandler(event, CREATE_OPTION)}>
            <div className="flex justify-center">
              <Card className="mt-4 w-full">
                <Card.Header className="text-center">
                  <div>Penilaian (0-100) </div>
                </Card.Header>

                <Card.Body className="space-y-4">
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Nilai Tugas Akhir (Skripsi)
                      <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_1"
                      value={form.penilaian_1}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Presentasi</Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_2"
                      value={form.penilaian_2}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Penguasaan Materi</Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_3"
                      value={form.penilaian_3}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      <p>Penampilan (Menanggapi Pertanyaan,</p>
                      <p>Memberikan Jawaban, sistematika</p>
                      <p>
                        jawaban dan etika)
                        <span className="text-danger-600">*</span>
                      </p>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_4"
                      value={form.penilaian_4}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Komentar Singkat</Form.Label>
                    <span>:</span>
                    <Form.Textarea
                      className="flex-1"
                      rows="5"
                      name="komentar_singkat"
                      value={form.komentar_singkat}
                      onChange={inputHandler}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
            <div className="flex gap-4 mt-4">
              <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
                Kembali
              </Button>
              {form.penilaian_sidang == null && (
                <Button type="submit" variant="primary" className="w-full h-12">
                  Konfirmasi
                </Button>
              )}
            </div>
          </Form>
        )}

      {form.penilaian_sidang && (
        <>
          <table
            className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
            cellPadding={10}
            style={{ marginTop: '20px' }}
          >
            <thead>
              <tr>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">No</div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">Aspek Penilaian</div>
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
                <td className="text-sm border-2 border-white bg-gray-50">1</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Nilai Tugas Akhir (Skripsi)
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">40%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Subtansi dan Orientasi Topik Penilitian"
                    data={form.penilaian_sidang?.penilaian_1}
                    name="penilaian_1"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">2</td>
                <td className="text-sm border-2 border-white bg-gray-50">Presentasi</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_2}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian"
                    data={form.penilaian_sidang?.penilaian_2}
                    name="penilaian_2"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">3</td>
                <td className="text-sm border-2 border-white bg-gray-50">Penguasaan Materi</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">40%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_3}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                    data={form.penilaian_sidang?.penilaian_3}
                    name="penilaian_3"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">4</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Penampilan (menanggapi pertanyaan, Memberikan Jawaban, sistematika jawaban dan
                  etika)
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_4}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Penyajian Makalah dan Tampilan Slide"
                    data={form.penilaian_sidang?.penilaian_4}
                    name="penilaian_4"
                    id={form.penilaian_sidang?.id}
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
                  <span className="mr-2">Nilai Akhir :</span>{' '}
                  <span>{form.penilaian_sidang?.final_nilai}</span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="text-sm font-bold pr-10">
                  <span className="mr-2">Huruf Mutu :</span>{' '}
                  <span>{form.penilaian_sidang?.huruf_mutu}</span>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex">
            <div className="relative flex-1">
              <Form.Textarea
                className="mt-2"
                rows="5"
                value={`Komentar Singkat : ${form.penilaian_sidang?.komentar_singkat}`}
                disabled
              />
            </div>
            <div className="ml-4 mt-6">
              <EditKomentar
                title="Komentar Singkat"
                data={form.penilaian_sidang?.komentar_singkat}
                name="komentar_singkat"
                id={form.penilaian_sidang?.id}
                onSuccess={() => show(router.query.id)}
                db="ta_penilaian_sidang"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
              Kembali
            </Button>
          </div>
        </>
      )}

      {form.statusDosen == '' && (
        <>
          <h1 className="pt-4 text-center">Halaman tidak tersedia</h1>
          <div className="flex gap-4 mt-4">
            <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
              Kembali
            </Button>
          </div>
        </>
      )}
    </Layout>
  )
}
