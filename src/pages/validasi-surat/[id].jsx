import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Icon } from '@iconify-icon/react'
import { Footer } from '../../components/LandingPage/Footer'
import HeaderOnPage from '../../components/LandingPage/HeaderOnPage'
import { Breadcrumb } from '../../components/LandingPage/Breadcrumb'

const InfoRow = ({ label, value }) => (
  <div className="flex items-baseline gap-3 mt-4 first:mt-0">
    <label className="min-w-[10rem] text-primary-700 font-semibold text-sm">{label}</label>
    <span className="text-primary-700">:</span>
    <p className="text-sm text-primary-700">{value || '-'}</p>
  </div>
)

const ValidasiSuratDetail = () => {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!router.query.id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/surat/qr/${router.query.id}`
        )
        setData(response.data?.data || null)
      } catch (err) {
        console.error('Gagal memuat data surat:', err)
        setError('Data surat tidak ditemukan atau tidak dapat diakses.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router.query.id])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200'
      case 'Replied': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Read': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
      <Head>
        <title>Validasi Surat | UCL</title>
        <meta name="description" content="Halaman verifikasi keaslian surat" />
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <HeaderOnPage />

        <main>
          <section id="validasi-surat" className="bg-color-primary-light min-h-screen">
            <div className="container py-20">
              <Breadcrumb title="Validasi Surat" />

              <div className="flex justify-center mt-8">
                <div className="w-full lg:w-2/3 xl:w-1/2">

                  {loading && (
                    <div className="flex justify-center items-center py-20">
                      <Icon icon="mdi:loading" className="animate-spin text-primary-600" width={40} />
                    </div>
                  )}

                  {!loading && error && (
                    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center">
                      <Icon icon="mdi:file-alert-outline" className="text-red-400 mb-3" width={48} />
                      <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                  )}

                  {!loading && data && (
                    <div className="rounded-2xl border-2 border-solid border-color-gray bg-white shadow-sm overflow-hidden">

                      {/* Header Banner */}
                      <div className="bg-primary-600 px-7 py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Icon icon="mdi:shield-check" className="text-white" width={22} />
                        </div>
                        <div>
                          <p className="text-white font-black text-sm uppercase tracking-widest">
                            Dokumen Terverifikasi
                          </p>
                          <p className="text-white/70 text-[10px] font-mono mt-0.5">
                            Universitas Ibn Khaldun Bogor
                          </p>
                        </div>
                        {/* Status Badge */}
                        <span className={`ml-auto text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${getStatusColor(data.status)}`}>
                          {data.status}
                        </span>
                      </div>

                      {/* Konten */}
                      <div className="px-7 py-8 space-y-0">
                        <InfoRow label="Jenis Surat" value={data.jenis_surat} />
                        <InfoRow label="Perihal" value={data.form_data?.perihal} />
                        <InfoRow
                          label="Nama Mahasiswa"
                          value={
                            data.form_data?.nama_lengkap ||
                            data.Pengirim?.personal_data?.nama_lengkap
                          }
                        />
                        <InfoRow
                          label="NPM"
                          value={data.form_data?.npm || data.Pengirim?.npm}
                        />
                        <InfoRow
                          label="Penerima / Tujuan"
                          value={
                            data.Penerima?.personal_data?.nama_lengkap ||
                            data.Penerima?.email
                          }
                        />
                        <InfoRow label="Tanggal Pengajuan" value={formatDate(data.created_at)} />
                        <InfoRow label="Nomor Surat" value={data.nomor_surat} />
                      </div>

                      {/* Footer Surat ID */}
                      <div className="border-t border-gray-100 px-7 py-4 bg-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          ID Surat: {data.id}
                        </p>
                        {data.form_data?.pdf_url && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}${data.form_data.pdf_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest transition-colors"
                          >
                            <Icon icon="mdi:file-pdf-box" width={16} />
                            Lihat PDF
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </>
  )
}

export default ValidasiSuratDetail
