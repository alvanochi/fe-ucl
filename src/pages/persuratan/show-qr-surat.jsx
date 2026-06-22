import { useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { Icon } from '@iconify-icon/react'

export default function ShowQrSurat({ data }) {
  const [suratData, setSuratData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleShowQr = async () => {
    if (!data?.id) return
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/surat/qr/${data.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Response: { isSuccess, data: { id, jenis_surat, form_data: { pdf_url, ... }, ... } }
      setSuratData(response.data?.data || null)
    } catch (error) {
      console.error('Error fetching QR surat:', error)
    } finally {
      setLoading(false)
    }
  }

  // URL yang akan di-encode ke QR — arahkan ke halaman validasi surat publik
  const getQrValue = () => {
    if (!suratData) return null
    // Arahkan ke halaman /validasi-surat/:id (bukan PDF langsung)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/validasi-surat/${suratData.id}`
  }

  // Generate QR via free API (tanpa install package)
  const getQrImageUrl = () => {
    const value = getQrValue()
    if (!value) return null
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`
  }

  return (
    <>
      <Button.Icon
        variant="primary"
        icon={
          loading
            ? <Icon icon="mdi:loading" className="animate-spin" width={20} height={20} />
            : <Icon icon="mdi:qrcode" width={20} height={20} />
        }
        onClick={handleShowQr}
        disabled={loading}
        title="Tampilkan QR Code Surat"
      />

      <Modal
        title="QR Code Surat"
        show={suratData !== null}
        handler={() => setSuratData(null)}
      >
        {suratData ? (
          <div className="flex flex-col items-center gap-4">
            {/* Info Surat */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-left space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono">
                Informasi Surat
              </p>
              <p className="font-bold text-sm text-gray-800 capitalize">
                {suratData.jenis_surat}
              </p>
              <p className="text-xs text-gray-500">
                {suratData.form_data?.nama_lengkap || suratData.Pengirim?.personal_data?.nama_lengkap || '-'}
              </p>
              <p className="text-[10px] text-gray-400 font-mono">{suratData.id}</p>
            </div>

            {/* QR Code */}
            {getQrImageUrl() ? (
              <div className="p-3 border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getQrImageUrl()}
                  alt="QR Code Surat"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
                <Icon icon="mdi:qrcode-remove" width={48} />
                <p className="text-sm">QR Code tidak tersedia.</p>
              </div>
            )}

            <p className="text-[10px] text-gray-400 text-center font-mono uppercase tracking-widest">
              Scan QR untuk mengakses dokumen
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
            <Icon icon="mdi:loading" className="animate-spin" width={32} />
            <p className="text-sm">Memuat data...</p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button onClick={() => setSuratData(null)} variant="primary" className="w-full h-12">
            Tutup
          </Button>
        </div>
      </Modal>
    </>
  )
}
