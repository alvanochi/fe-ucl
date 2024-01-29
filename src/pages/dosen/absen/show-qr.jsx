import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useCRUD from "../../../hooks/useCRUD";

export default function ShowQr({ data }) {
  const { show, toggle, close } = useModal();

  return (
    <>
      <Button.Icon
        variant="info"
        icon={<Icon icon="bx:qr-scan" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Nama Matkul" show={show} handler={toggle}>
          <img src="/img/qrcode.png" alt="qrcode" />

        <div className="flex gap-4 mt-4">
          <Button onClick={close} variant="primary" className="w-full h-12">
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
