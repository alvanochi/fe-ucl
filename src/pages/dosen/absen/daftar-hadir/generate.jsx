import { useRouter } from 'next/router'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import useDatatable from '../../../../hooks/useDatatable'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import { Loading } from '../../../../components/Loading'
import useMahasiswa from '../../../../repo/mahasiswa'

export default function GenerateQrCode() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/profile/getDataPribadi`
  const { data, loading } = useDatatable(DATA_URL)

  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user])

  const [mataKuliahOptions, setMataKuliahOptions] = useState([])
  const [kelasOptions, setKelasOptions] = useState([])
  const [dosenOptions, setDosenOptions] = useState([])

  const [selectedMataKuliah, setSelectedMataKuliah] = useState(null)
  const [selectedKelas, setSelectedKelas] = useState(null)
  const [selectedDosenPengganti, setSelectedDosenPengganti] = useState('')
  const [selectedMhs, setSelectedMhs] = useState('')
  const [pertemuanData, setPertemuanData] = useState('')
  const [statusKelas, setStatusKelas] = useState('')
  const [dosenTamu, setDosenTamu] = useState('')
  const [rps, setRps] = useState({ rps_dasar: '', rps_pelaksanaan: '' })

  const [showQr, setShowQr] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [qrToken, setQrToken] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  const SIAK_URL = process.env.NEXT_PUBLIC_SIAK_API_URL
  const ABSEN_URL = process.env.NEXT_PUBLIC_API_URL_ABSEN

  useEffect(() => {
    const fetchMataKuliah = async () => {
      try {
        if (SIAK_URL && data?.nip) {
          const response = await axios.get(`${SIAK_URL}/api/public/mata-kuliah`, {
            params: { nip: data.nip.trim() },
          })
          const mk = response.data.data || []
          setMataKuliahOptions(
            mk.map(c => ({
              label: `${c.nama} (${c.kode})`,
              value: c.kode,
            })),
          )
        }
      } catch (error) {
        console.error('Error fetching mata kuliah:', error)
      }
    }
    fetchMataKuliah()
  }, [SIAK_URL, data?.nip])

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        if (SIAK_URL) {
          const response = await axios.get(`${SIAK_URL}/api/public/kelas-kuliah`)
          const kls = response.data.data || []
          const uniqueClasses = []
          const classMap = new Map()
          for (const item of kls) {
            if (!classMap.has(item.nama)) {
              classMap.set(item.nama, true)
              uniqueClasses.push({
                label: item.nama,
                value: item.nama,
              })
            }
          }
          setKelasOptions(uniqueClasses)
        }
      } catch (error) {
        console.error('Error fetching kelas:', error)
      }
    }
    fetchKelas()
  }, [SIAK_URL])

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        if (SIAK_URL) {
          const response = await axios.get(`${SIAK_URL}/api/public/dosen`)
          const dosens = response.data.data || []
          setDosenOptions(
            dosens.map(d => ({
              label: d.nama,
              value: d.nidn,
            })),
          )
        }
      } catch (error) {
        console.error('Error fetching dosen:', error)
      }
    }
    fetchDosen()
  }, [SIAK_URL])

  const handleRpsChange = e => {
    const { name, value } = e.target
    setRps(prev => ({ ...prev, [name]: value }))
  }

  async function submitHandler(event) {
    event.preventDefault()

    if (!selectedMataKuliah) {
      toastAlert('error', 'Mohon pilih mata kuliah')
      return
    }
    if (!selectedKelas) {
      toastAlert('error', 'Mohon pilih kelas')
      return
    }
    if (!statusKelas) {
      toastAlert('error', 'Mohon pilih status kelas')
      return
    }

    try {
      const requestData = {
        nik_dosen: data.nip ? data.nip.trim() : '',
        id_matkul: selectedMataKuliah,
        id_lecture: data?.id || '',
        kelas: selectedKelas,
        pertemuan: pertemuanData,
        status_kelas: statusKelas,
        rps_dasar: rps.rps_dasar,
        rps_pelaksanaan: rps.rps_pelaksanaan,
        nidn_dosen_pengganti: selectedDosenPengganti,
        dosen_tamu: dosenTamu,
        npm_komti: selectedMhs,
      }

      const request = await axios({
        url: `${ABSEN_URL}/pembelajaran/store`,
        method: 'POST',
        data: requestData,
      })

      const response = request.data
      const token = response?.data?.token

      if (token) {
        setQrToken(token)
        setQrLoading(true)
        setShowQr(true)

        try {
          const qrResponse = await axios.get(`${ABSEN_URL}/absensi/show-qr?token=${token}`)
          setQrCode(qrResponse.data)
        } catch (qrError) {
          console.error('Error fetching QR:', qrError)
          toastAlert('error', 'QR Code gagal dimuat, token: ' + token)
        } finally {
          setQrLoading(false)
        }

        toastAlert('success', 'QR Code berhasil dibuat!')
      } else {
        toastAlert('success', 'Data pembelajaran berhasil disimpan')
        router.push(prefix + menu.url)
      }
    } catch (error) {
      if (error.name === 'AxiosError' && error.response) {
        const { message } = error.response.data
        toastAlert('error', message || 'Terjadi kesalahan')
        return
      }
      toastAlert('error', error.message)
    }
  }

  if ([user, menu, loading, isMahasiswaLoading].some(item => item == null)) return <Loading />

  if (showQr) {
    return (
      <Layout>
        <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
        <Card className="mt-4">
          <Card.Header className="text-center">QR Code Presensi</Card.Header>
          <Card.Body>
            {qrLoading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-lg">Memuat QR Code...</p>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center gap-4">
                <div
                  dangerouslySetInnerHTML={{ __html: qrCode }}
                  style={{ maxWidth: '100%', maxHeight: '60vh' }}
                />
                <h1 className="text-center font-bold text-4xl">{qrToken}</h1>
                <p className="text-center text-gray-500 text-sm">
                  Gunakan token di atas atau scan QR Code untuk melakukan presensi
                </p>
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <p className="text-lg text-red-500">QR Code tidak tersedia. Token: {qrToken}</p>
              </div>
            )}
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
            Kembali ke Daftar Hadir
          </Button>
          <Button
            variant="primary"
            className="w-full h-12"
            onClick={() => {
              setShowQr(false)
              setQrCode(null)
              setQrToken(null)
              setSelectedMataKuliah(null)
              setSelectedKelas(null)
              setPertemuanData('')
              setStatusKelas('')
              setRps({ rps_dasar: '', rps_pelaksanaan: '' })
              setSelectedDosenPengganti('')
              setDosenTamu('')
              setSelectedMhs('')
            }}
          >
            Buat QR Code Lagi
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Generate QRCODE</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                NIK <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nik_dosen"
                value={data.nip ? data.nip.trim() : ''}
                readOnly
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Matakuliah <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="id_matkul"
                className="flex-1"
                onChange={selected => setSelectedMataKuliah(selected?.value || null)}
                value={selectedMataKuliah}
                options={mataKuliahOptions}
                menuTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Kelas <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="kelas"
                className="flex-1"
                onChange={selected => setSelectedKelas(selected?.value || null)}
                value={selectedKelas}
                options={kelasOptions}
                menuTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Pertemuan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="pertemuan"
                value={pertemuanData}
                onChange={e => setPertemuanData(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={() => setStatusKelas('0')}
                    value={0}
                    checked={statusKelas === '0'}
                  />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={() => setStatusKelas('1')}
                    value={1}
                    checked={statusKelas === '1'}
                  />
                  Online
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Dasar</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_dasar"
                value={rps.rps_dasar}
                onChange={handleRpsChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Pelaksanaan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_pelaksanaan"
                value={rps.rps_pelaksanaan}
                onChange={handleRpsChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">Dosen Pengganti</Form.Label>
              <span>:</span>
              <Form.Combobox
                name="nidn_dosen_pengganti"
                className="flex-1"
                onChange={selected => setSelectedDosenPengganti(selected?.value || '')}
                value={selectedDosenPengganti}
                options={dosenOptions}
                menuTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">Dosen Tamu</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="dosen_tamu"
                value={dosenTamu}
                onChange={e => setDosenTamu(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Komti Kelas <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="npm_komti"
                onChange={selected => setSelectedMhs(selected?.value || '')}
                value={selectedMhs}
                options={listMahasiswa?.map(mhs => ({
                  label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                  value: mhs.npm,
                }))}
                menuTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full h-12">
            Generate
          </Button>
        </div>
      </Form>
    </Layout>
  )
}
