import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Icon } from '@iconify-icon/react'
import { Footer } from '../../components/LandingPage/Footer'
import HeaderOnPage from '../../components/LandingPage/HeaderOnPage'
import { Breadcrumb } from '../../components/LandingPage/Breadcrumb'

const ValidasiSuratPage = () => {
  const router = useRouter()
  const [inputId, setInputId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputId.trim()
    if (!trimmed) {
      setError('Masukkan ID atau nomor surat terlebih dahulu.')
      return
    }
    setError('')
    router.push(`/validasi-surat/${trimmed}`)
  }

  return (
    <>
      <Head>
        <title>Validasi Surat | UCL</title>
        <meta
          name="description"
          content="Verifikasi keaslian surat pengajuan mahasiswa Universitas Ibn Khaldun Bogor."
        />
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <HeaderOnPage />

        <main>
          <section id="validasi-surat" className="bg-color-primary-light min-h-screen">
            <div className="container py-20">
              <Breadcrumb title="Validasi Surat" />

              <div className="flex justify-center mt-10">
                <div className="w-full lg:w-1/2 xl:w-2/5">

                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                    {/* Header Card */}
                    <div className="bg-color-primary-dark px-8 py-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:shield-search" className="text-white" width={26} />
                      </div>
                      <div>
                        <p className="text-white font-black text-base uppercase tracking-widest">
                          Verifikasi Surat
                        </p>
                        <p className="text-white/60 text-xs font-mono mt-0.5">
                          Universitas Ibn Khaldun Bogor
                        </p>
                      </div>
                    </div>

                    {/* Body Card */}
                    <div className="px-8 py-8">
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Masukkan <span className="font-semibold text-gray-700">ID Surat</span> yang tertera
                        pada dokumen atau scan QR Code yang tersedia pada surat untuk memverifikasi keasliannya.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="surat-id-input"
                            className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2"
                          >
                            ID Surat
                          </label>
                          <div className="relative">
                            <Icon
                              icon="mdi:identifier"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              width={20}
                            />
                            <input
                              id="surat-id-input"
                              type="text"
                              value={inputId}
                              onChange={(e) => {
                                setInputId(e.target.value)
                                if (error) setError('')
                              }}
                              placeholder="Contoh: ad85a7d2-cdb9-4198-8e8d-..."
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-300 font-mono"
                            />
                          </div>
                          {error && (
                            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                              <Icon icon="mdi:alert-circle-outline" width={14} />
                              {error}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-color-primary-dark hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                        >
                          <Icon icon="mdi:magnify" width={18} />
                          Verifikasi Surat
                        </button>
                      </form>

                      {/* Divider */}
                      <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-300 uppercase tracking-widest">atau</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      {/* Hint scan QR */}
                      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                        <Icon icon="mdi:qrcode-scan" className="text-blue-400 flex-shrink-0 mt-0.5" width={20} />
                        <p className="text-xs text-blue-600 leading-relaxed">
                          Scan <span className="font-semibold">QR Code</span> yang dibagikan oleh mahasiswa
                          untuk langsung membuka halaman verifikasi secara otomatis tanpa perlu input ID manual.
                        </p>
                      </div>
                    </div>

                    {/* Footer Card */}
                    <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 flex items-center gap-2">
                      <Icon icon="mdi:lock-outline" className="text-gray-300" width={14} />
                      <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                        Sistem Verifikasi Dokumen
                      </p>
                    </div>
                  </div>

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

export default ValidasiSuratPage
