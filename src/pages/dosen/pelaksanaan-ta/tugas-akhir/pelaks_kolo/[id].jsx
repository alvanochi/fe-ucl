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
import axios from 'axios'
import { MySwal, toastAlert } from '../../../../../lib/sweetalert'
import date from '../../../../../utils/date'
import EditNilai from '../../../../../components/EditPenilaian/edit-nilai'
import EditKomentar from '../../../../../components/EditPenilaian/edit-komentar'
import Link from 'next/link'
import { escapeHtmlDeep } from '../../../../../utils/escapeHtml'

export default function PelaksanaanKolo() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/detail-penilaian-kolo-dosen`
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/makalah-kolokium`

  const INITIAL_FORM = {
    pengajuan_sk_id: '',
    kolo_id: '',
    nama_lengkap: '',
    semester: '',
    email: '',
    no_hp: '',
    npm: '',
    judul_skripsi: '',
    link_dok_mhs_aktif: '',
    link_dok_pembayaran: '',
    kolo_pembimbing_1: '',
    kolo_pembimbing_2: '',
    kolo_pembimbing_3: null,
    kolo_status_pem_1: '',
    kolo_status_pem_2: '',
    kolo_status_pem_3: '',
    evaluator_1: '',
    evaluator_2: '',
    jadwal_pelaksanaan: '',
    file_makalah: '',
    status_kp: '',
    status_sks_ipk: '',
    statusDosen: '',
    penilaian_1: '',
    penilaian_2: '',
    penilaian_3: '',
    penilaian_4: '',
    penilaian_5: '',
    komentar_singkat: '',
    dosen_id: '',
    penilaian_kolo: null,
    statusDosen: '',
    link_dok_makalah: '',
  }

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: 'link_dok_mhs_aktif', label: 'Link Dokumen Mahasiswa Aktif' },
      { field: 'link_dok_pembayaran', label: 'Link Dokumen Pembayaran' },
      { field: 'file_makalah', label: 'file_makalah' },
    ],
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  const CREATE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/penilaian-kolo`
  const CREATE_OPTION = { url: `${CREATE_URL}`, method: 'POST' }

  // -- Cetak Berita Acara & Form Penilaian Kolokium (sama seperti versi admin -
  // dosen boleh lihat form penilaian semua evaluator/pembimbing kolokium ini).
  const [isPrinting, setIsPrinting] = useState(false)
  const TTD_URL = `${process.env.NEXT_PUBLIC_API_URL}/ttd`
  const KOP_URL = `${process.env.NEXT_PUBLIC_API_URL}/img`

  const buildTtdUrl = value => {
    if (!value) return null
    const v = String(value).trim()
    if (!v) return null
    if (/^https?:\/\//i.test(v)) return v
    const cleaned = v.replace(/^\/+/, '').replace(/^(public\/)?ttd\//i, '')
    return `${TTD_URL}/${cleaned}`
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
      const BA_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/berita-acara-kolo/${router.query.id}`
      const response = await axios.get(BA_URL)
      // Dirakit jadi HTML mentah lewat document.write() (bukan JSX, jadi tidak
      // auto-escape React) - escape semua nilai string dulu di sini.
      const ba = escapeHtmlDeep(response.data.data)

      const nilaiAkhir = ba.nilai_akhir
      const tanggalFormatted = formatTanggalIndo(ba.jadwal_pelaksanaan)
      const waktu = ba.waktu || '-'
      const tempat = ba.tempat || '-'

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

      const pembimbing1Nama = ba.nama_pembimbing_1 || getDosenNama(ba.kolo_pembimbing_1)
      const pembimbing2Nama = ba.nama_pembimbing_2 || getDosenNama(ba.kolo_pembimbing_2)
      const pembimbing3Nama = ba.nama_pembimbing_3 || getDosenNama(ba.kolo_pembimbing_3)
      const evaluator1Nama = ba.nama_evaluator_1 || getDosenNama(ba.evaluator_1)
      const evaluator2Nama = ba.nama_evaluator_2 || getDosenNama(ba.evaluator_2)

      const kaprodiNama = ba.kaprodi?.nama_lengkap || 'Hersanto Fajri, S.Ds., M.MD'
      const kaprodiNIK = ba.kaprodi?.nip || ''
      const kaprodiTTD = ba.kaprodi?.ttd || null

      const ttdImgTag = kaprodiTTD
        ? `<img src="${buildTtdUrl(kaprodiTTD)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;margin:0 auto;" />`
        : `<div style="height:50px;"></div>`

      let calcP1 = nilaiAkhir?.penilaian_1
      let calcP2 = nilaiAkhir?.penilaian_2
      let calcP3 = nilaiAkhir?.penilaian_3
      let calcP4 = nilaiAkhir?.penilaian_4
      let calcP5 = nilaiAkhir?.penilaian_5
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
        if (!calcP5)
          calcP5 = (
            penilaianList.reduce((acc, p) => acc + parseFloat(p.penilaian_5 || 0), 0) / penilaianList.length
          ).toFixed(2)
        if (!calcFinal) {
          calcFinal = (
            parseFloat(calcP1) * 0.2 +
            parseFloat(calcP2) * 0.4 +
            parseFloat(calcP3) * 0.1 +
            parseFloat(calcP4) * 0.1 +
            parseFloat(calcP5) * 0.2
          ).toFixed(2)
        }
      }

      if (!calcMutu && calcFinal) {
        if (calcFinal >= 80) calcMutu = 'A'
        else if (calcFinal >= 73) calcMutu = 'AB'
        else if (calcFinal >= 65) calcMutu = 'B'
        else if (calcFinal >= 60) calcMutu = 'BC'
        else if (calcFinal >= 55) calcMutu = 'C'
        else if (calcFinal >= 50) calcMutu = 'CD'
        else if (calcFinal >= 45) calcMutu = 'D'
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

      const page1 = `
        <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${KOP_URL}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
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
              <td style="padding:3px 0;">${ba.nama_lengkap || '-'}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">NIM</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.npm || '-'}</td>
            </tr>
            <tr>
              <td style="padding:3px 0;">JUDUL</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.judul_skripsi || '-'}</td>
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
                ${pembimbing1Nama ? `1. ${pembimbing1Nama}` : ''}
                ${pembimbing2Nama ? `<br/>2. ${pembimbing2Nama}` : ''}
                ${pembimbing3Nama ? `<br/>3. ${pembimbing3Nama}` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;">EVALUATOR</td>
              <td>:</td>
              <td style="padding:3px 0;">
                ${evaluator1Nama ? `1. ${evaluator1Nama}` : ''}
                ${evaluator2Nama ? `<br/>2. ${evaluator2Nama}` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;">KOMENTAR SINGKAT</td>
              <td>:</td>
              <td style="padding:3px 0;">${ba.komentar || '-'}</td>
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
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP1 || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">2. Konsistensi antara masalah, tujuan penelitian dan metodologi penelitian</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP2 || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">3. Organisasi, kelengkapan dan teknis penulisan makalah</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP3 || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">4. Penyajian Makalah dan tampilan slide</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP4 || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;">5. Argumentasi</td>
                <td style="border:1px solid black;padding:6px;text-align:center;">${calcP5 || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;font-weight:bold;">Nilai Akhir</td>
                <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${calcFinal || '-'}</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:6px;font-weight:bold;">Nilai Mutu</td>
                <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${calcMutu || '-'}</td>
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
      `

      const buildFormPenilaian = (p, peranLabel, dosenNamaDisplay, dosenNip, dosenTtd) => {
        const dosenTtdImgTag = dosenTtd
          ? `<img src="${buildTtdUrl(dosenTtd)}" alt="TTD" style="height:50px;max-width:120px;object-fit:contain;display:block;" />`
          : `<div style="height:50px;"></div>`
        let finalNilai = p.final_nilai
        let hurufMutu = p.huruf_mutu
        if (!finalNilai && p.penilaian_1) {
          finalNilai = (
            parseFloat(p.penilaian_1) * 0.2 +
            parseFloat(p.penilaian_2) * 0.4 +
            parseFloat(p.penilaian_3) * 0.1 +
            parseFloat(p.penilaian_4) * 0.1 +
            parseFloat(p.penilaian_5) * 0.2
          ).toFixed(2)

          if (finalNilai >= 80) hurufMutu = 'A'
          else if (finalNilai >= 73) hurufMutu = 'AB'
          else if (finalNilai >= 65) hurufMutu = 'B'
          else if (finalNilai >= 60) hurufMutu = 'BC'
          else if (finalNilai >= 55) hurufMutu = 'C'
          else if (finalNilai >= 50) hurufMutu = 'CD'
          else if (finalNilai >= 45) hurufMutu = 'D'
          else hurufMutu = 'E'
        }

        return `
          <div style="font-family:'Times New Roman'; font-size:12px; max-width:700px; margin:0 auto; padding:30px; page-break-before:always;">
            <div style="text-align:center; margin-bottom:20px;">
              <img src="${KOP_URL}/kop_surat.png" alt="Kop Surat" style="width:100%;max-width:680px;" />
            </div>
            <h2 style="text-align:center;font-weight:bold;font-size:13px;text-decoration:underline;margin:10px 0 20px;">
              FORM PENILAIAN SEMINAR PROPOSAL / KOLOKIUM
            </h2>

            <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
              <tr>
                <td style="width:200px;padding:3px 0;font-weight:bold;">NAMA</td>
                <td style="width:10px;">:</td>
                <td style="padding:3px 0;">${ba.nama_lengkap || '-'}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">NPM</td>
                <td>:</td>
                <td style="padding:3px 0;">${ba.npm || '-'}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">${peranLabel}</td>
                <td>:</td>
                <td style="padding:3px 0;">${dosenNamaDisplay}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-weight:bold;">JUDUL</td>
                <td>:</td>
                <td style="padding:3px 0;">${ba.judul_skripsi || '-'}</td>
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
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_1 || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">2. Konsistensi antara masalah, tujuan penelitian dan metodologi penelitian</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">40</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_2 || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">3. Organisasi, kelengkapan dan teknis penulisan makalah</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">10</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_3 || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">4. Penyajian Makalah dan tampilan slide</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">10</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_4 || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;">5. Argumentasi</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">20</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${p.penilaian_5 || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;font-weight:bold;">NILAI AKHIR</td>
                  <td style="border:1px solid black;padding:6px;"></td>
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${finalNilai || '-'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid black;padding:6px;font-weight:bold;">HURUF MUTU</td>
                  <td style="border:1px solid black;padding:6px;"></td>
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${hurufMutu || '-'}</td>
                </tr>
              </tbody>
            </table>

            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
              ${intervalNilai}
              <div style="flex:1;margin-left:20px;">
                <div style="margin-bottom:8px;font-weight:bold;font-size:11px;">KOMENTAR SINGKAT :</div>
                <div style="border:1px solid black;padding:10px;min-height:120px;font-size:11px;">${p.komentar_singkat || ''}</div>
              </div>
            </div>

            <div style="text-align:right;">
              <div>Bogor, ${tanggalFormatted}</div>
              <div>${peranLabel},</div>
              <div style="margin:10px 0 4px;display:flex;justify-content:flex-end;">${dosenTtdImgTag}</div>
              <div style="font-weight:bold;text-decoration:underline;">(${dosenNamaDisplay && dosenNamaDisplay !== '-' ? dosenNamaDisplay : '.........................................................'})</div>
              <div>NIK : ${dosenNip || '-'}</div>
            </div>
          </div>
        `
      }

      const expectedDosenList = [
        { roleKey: 'pembimbing_1', label: 'Pembimbing I', name: pembimbing1Nama, dbId: ba.kolo_pembimbing_1 },
        { roleKey: 'pembimbing_2', label: 'Pembimbing II', name: pembimbing2Nama, dbId: ba.kolo_pembimbing_2 },
        { roleKey: 'evaluator_1', label: 'Evaluator I', name: evaluator1Nama, dbId: ba.evaluator_1 },
        { roleKey: 'evaluator_2', label: 'Evaluator II', name: evaluator2Nama, dbId: ba.evaluator_2 },
      ].map(d => ({ ...d, nip: getDosenNip(d.dbId), ttd: getDosenTtd(d.dbId) }))

      const formPages = expectedDosenList
        .map(dosen => {
          let p = penilaianList.find(x => String(x.dosen_id) === String(dosen.dbId))
          if (!p) {
            p = penilaianList.find(x => {
              const role = x.peran ? x.peran.trim().toLowerCase().replace(/\s+/g, '_') : ''
              return role === dosen.roleKey
            })
          }
          if (!p) p = {}

          return buildFormPenilaian(p, dosen.label, dosen.name, dosen.nip, dosen.ttd)
        })
        .join('')

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
          <img src="${KOP_URL}/foot_kop.png" alt="Footer" style="position:fixed;bottom:0;left:0;width:100%;z-index:9999;display:block;" />
          ${page1}
          ${formPages}
        </body>
        </html>
      `

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Pop-up diblokir oleh browser. Izinkan pop-up untuk mencetak.')
        return
      }
      printWindow.document.write(fullContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    } catch (error) {
      console.error('Error fetching berita acara:', error)
      alert('Gagal memuat data Berita Acara. Pastikan data penilaian sudah lengkap.')
    } finally {
      setIsPrinting(false)
    }
  }

  useEffect(() => {
    if (router.isReady === false || !user) return
    show(router.query.id, {
      transformData: data => ({
        ...data,
        jadwal_pelaksanaan: data.jadwal_pelaksanaan
          ? date.formatToInput(data.jadwal_pelaksanaan)
          : '',
      }),
    })
  }, [router, user])

  if ([user, menu, isDosenLoading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>Penilaian Seminar Proposal Dan Kolokium</div>
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
            <Form.Label className="min-w-[20rem]">Jadwal Pelaksanaan</Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="jadwal_pelaksanaan"
              value={form.jadwal_pelaksanaan}
              placeholder="Diisi oleh admin"
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">
              {form.statusDosen === 'evaluator_1'
                ? 'Evaluator 1'
                : form.statusDosen === 'evaluator_2'
                  ? 'Evaluator 2'
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
                form.statusDosen === 'evaluator_1'
                  ? form.evaluator_1
                  : form.statusDosen === 'evaluator_2'
                    ? form.evaluator_2
                    : form.statusDosen === 'pembimbing_1'
                      ? form.kolo_pembimbing_1
                      : form.statusDosen === 'pembimbing_2'
                        ? form.kolo_pembimbing_2
                        : form.statusDosen === 'pembimbing_3'
                          ? form.kolo_pembimbing_3
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
            <Form.Label className="min-w-[20rem]">Link Dokumen</Form.Label>
            <span>:</span>
            <Button
              onClick={() => window.open(`${form.link_dok_makalah}`, '_blank')}
              variant="primary"
              icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
              pill
            >
              Link Dokumen Makalah
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      {form.statusDosen !== '' && form.statusDosen !== 'kepala_lab' && (
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

      {form.penilaian_kolo == null &&
        form.statusDosen !== '' &&
        form.statusDosen !== 'kepala_lab' && (
          <>
            <Form onSubmit={event => submitHandler(event, CREATE_OPTION)}>
              <div className="flex justify-center">
                <Card className="mt-4 w-full">
                  <Card.Header className="text-center">
                    <div>Penilaian (0 - 100)</div>
                  </Card.Header>

                  <Card.Body className="space-y-4">
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">
                        Substansi dan Orientasi Topik Penelitian{' '}
                        <span className="text-danger-600">*</span>
                      </Form.Label>
                      <span>:</span>
                      <Form.Input
                        type="number"
                        name="penilaian_1"
                        value={form.penilaian_1}
                        onChange={inputHandler}
                        min={1}
                        max={100}
                      />
                    </Form.Group>
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">
                        <p>Konsistensi Antara Masalah, Tujuan</p>
                        <p>
                          Penelitian dan Metodologi Penelitian{' '}
                          <span className="text-danger-600">*</span>
                        </p>
                      </Form.Label>
                      <span>:</span>
                      <Form.Input
                        type="number"
                        name="penilaian_2"
                        value={form.penilaian_2}
                        onChange={inputHandler}
                        min={1}
                        max={100}
                      />
                    </Form.Group>
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">
                        <p>Organisasi, Kelengkapan dan Teknis </p>
                        <p>
                          Penulisan Makalah <span className="text-danger-600">*</span>
                        </p>
                      </Form.Label>
                      <span>:</span>
                      <Form.Input
                        type="number"
                        name="penilaian_3"
                        value={form.penilaian_3}
                        onChange={inputHandler}
                        min={1}
                        max={100}
                      />
                    </Form.Group>
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">
                        Penyajian Makalah dan Tampilan Slide{' '}
                        <span className="text-danger-600">*</span>
                      </Form.Label>
                      <span>:</span>
                      <Form.Input
                        type="number"
                        name="penilaian_4"
                        value={form.penilaian_4}
                        onChange={inputHandler}
                        min={1}
                        max={100}
                      />
                    </Form.Group>
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">
                        Argumentasi <span className="text-danger-600">*</span>
                      </Form.Label>
                      <span>:</span>
                      <Form.Input
                        type="number"
                        name="penilaian_5"
                        value={form.penilaian_5}
                        onChange={inputHandler}
                        min={1}
                        max={100}
                      />
                    </Form.Group>
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Label className="min-w-[20rem]">Komentar Singkat</Form.Label>
                      <span>:</span>
                      <Form.Textarea
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
                <Button type="submit" variant="primary" className="w-full h-12">
                  Konfirmasi
                </Button>
              </div>
            </Form>
          </>
        )}

      {form.penilaian_kolo && (
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
                  Subtansi dan Orientasi Topik Penilitian
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">20%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Subtansi dan Orientasi Topik Penilitian"
                    data={form.penilaian_kolo?.penilaian_1}
                    name="penilaian_1"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolokium"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">2</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi Penelitian
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">40%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_2}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian"
                    data={form.penilaian_kolo?.penilaian_2}
                    name="penilaian_2"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolokium"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">3</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Organisasi, kelengkapan dan Teknik Penulisan Makalah
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_3}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                    data={form.penilaian_kolo?.penilaian_3}
                    name="penilaian_3"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolokium"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">4</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Penyajian Makalah dan Tampilan Slide
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_4}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Penyajian Makalah dan Tampilan Slide"
                    data={form.penilaian_kolo?.penilaian_4}
                    name="penilaian_4"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolokium"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">5</td>
                <td className="text-sm border-2 border-white bg-gray-50">Argumentasi</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">20%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_5}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Argumentasi"
                    data={form.penilaian_kolo?.penilaian_5}
                    name="penilaian_5"
                    id={form.penilaian_kolo?.id}
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
                  <span className="mr-2">Nilai Akhir :</span>{' '}
                  <span>{form.penilaian_kolo?.final_nilai}</span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="text-sm font-bold pr-10">
                  <span className="mr-2">Huruf Mutu :</span>{' '}
                  <span>{form.penilaian_kolo?.huruf_mutu}</span>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex">
            <div className="relative flex-1">
              <Form.Textarea
                className="mt-2"
                rows="5"
                value={`Komentar Singkat : ${form.penilaian_kolo?.komentar_singkat}`}
                disabled
              />
            </div>
            <div className="ml-4 mt-6">
              <EditKomentar
                title="Komentar Singkat"
                data={form.penilaian_kolo?.komentar_singkat}
                name="komentar_singkat"
                id={form.penilaian_kolo?.id}
                onSuccess={() => show(router.query.id)}
                db="ta_penilaian_kolokium"
              />
            </div>
          </div>

          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
            Kembali
          </Button>
        </>
      )}

      {(form.statusDosen == '' || form.statusDosen == 'kepala_lab') && (
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
