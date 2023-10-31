import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";

export default function UploadDokumen({ form, inputHandler }) {
  const { show, toggle } = useModal();

  return (
    <>
      <Button
        type="button"
        variant="primary"
        icon={<Icon icon="material-symbols:upload" width={20} height={20} />}
        onClick={toggle}
      >
        Unggah Dokumen Baru
      </Button>
      <Modal title="Unggah Dokumen" show={show} handler={toggle}>
        <p className="text-center text-sm mb-8">
          (Maksimal total ukuran file dalam sekali proses upload : 5 MB) Dokumen
          yang dilampirkan adalah dokumen wajib dan dokumen yang sesuai dengan
          data yang diusulkan.Dokumen Wajib :- Ijazah- SK Penyetaraan Ijasah (PT
          luar negeri)- Transkrip Nilai
        </p>
        <Form className="space-y-4">
          <Form.Group>
            <Form.Label>
              File <span className="text-danger-600">*</span>
            </Form.Label>
            <small>
              ( Jenis file yang diijinkan : pdf, jpg, jpeg, png, doc, docx, xls,
              xlsx, txt )
            </small>
            <Form.Input type="file" name="file" onChange={inputHandler} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Nama Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="nama_dok"
              onChange={inputHandler}
              value={form.nama_dok}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Keterangan <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="keterangan_dok"
              onChange={inputHandler}
              value={form.keterangan_dok}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Tautan Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="tautan_dok"
              onChange={inputHandler}
              value={form.tautan_dok}
            />
          </Form.Group>
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              onClick={toggle}
              variant="primary"
              className="w-full h-12"
            >
              Konfirmasi
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
