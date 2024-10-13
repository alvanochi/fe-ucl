import { useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Icon } from "@iconify-icon/react";

export default function ShowQr({ data }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowQr = async () => {
    try {
      if (data && data.id) {
        setLoading(true);

        const response = await axios.get(
          `${process.env.API_ENDPOINT}/validasi/validasi-dokumen/${data.id}`
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
        icon={<Icon icon="ic:baseline-qrcode" width={20} height={20} />}
        onClick={handleShowQr}
      />

      <Modal
        title={`Link Validasi`}
        show={qrCode !== null}
        handler={() => setQrCode(null)}
      >
        {loading ? (
          <p>Loading QR code...</p>
        ) : qrCode ? (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: qrCode }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            />
          </>
        ) : (
          <p>No QR code available.</p>
        )}

        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setQrCode(null)}
            variant="primary"
            className="w-full h-12"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
