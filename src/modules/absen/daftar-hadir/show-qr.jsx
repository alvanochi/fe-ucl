import { useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import { Icon } from '@iconify-icon/react'

export default function ShowQr({ data }) {
  const [qrCode, setQrCode] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleShowQr = async () => {
    try {
      if (data && data.token) {
        setLoading(true)

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_ABSEN}/absensi/show-qr?token=${data.token}`,
        )

        const svgContent = response.data
        setQrCode(svgContent)
      }
    } catch (error) {
      console.error('Error fetching QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button.Icon
        variant="secondary"
        icon={<Icon icon="bx:qr-scan" width={18} height={18} />}
        onClick={handleShowQr}
      />
      <Modal
        title={`${data && data.matkul ? data.matkul : ''} ${
          data && data.pertemuan ? data.pertemuan : ''
        } | ${data && data.kelas ? data.kelas : ''}`}
        show={qrCode !== null}
        handler={() => setQrCode(null)}
      >
        {loading ? (
          <p>Loading QR code...</p>
        ) : qrCode ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: qrCode }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                }}
              />
            </div>
            <h1 className="text-center font-bold text-4xl pt-4">{data.token}</h1>
          </>
        ) : (
          <p>No QR code available.</p>
        )}

        <div className="flex gap-4 mt-8">
          <Button onClick={() => setQrCode(null)} variant="primary" className="w-full h-12">
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
