import { useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { Icon } from "@iconify-icon/react";

export default function ShowQr({ data }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowQr = async () => {
    try {
      if (data && data.token) {
        setLoading(true);

        const response = await axios.get(
          `http://103.158.196.71/fts-absen/public/api/absensi/show-qr?token=${data.token}`
        );

        const svgContent = response.data;
        setQrCode(svgContent);
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button.Icon
        variant="info"
        icon={<Icon icon="bx:qr-scan" width={20} height={20} />}
        onClick={handleShowQr}
      />
      <Modal title={`${data && data.matkul ? data.matkul : ""}`} show={qrCode !== null} handler={() => setQrCode(null)}>
        {loading ? (
          <p>Loading QR code...</p>
        ) : qrCode ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: qrCode }}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          </div>
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
  );
}
