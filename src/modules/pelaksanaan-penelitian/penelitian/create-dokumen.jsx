import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useCRUD from "../../../hooks/useCRUD";

export default function CreateDokumen({ id }) {
  const API_URL = `${process.env.API_ENDPOINT}/penelitian/addDokumenPenelitian`;
  const INITIAL_FORM = {
    ...id,
    nama_dok: "",
    keterangan: "",
    tautan_dok: "",
  };

  const { show, toggle, close } = useModal();
  const { formdata, isSubmit, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => {
      close();
      reset();
    },
  });

  const { form, inputHandler, reset } = formdata;

  return (
    <>
      <Button.Icon
        variant="primary"
        icon={<Icon icon="typcn:plus" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Unggah Dokumen" show={show} handler={toggle}>
        <p className="text-center text-sm mb-8">
          (Maksimal total ukuran file dalam sekali proses upload : 5 MB) Dokumen
          yang dilampirkan adalah dokumen wajib dan dokumen yang sesuai dengan
          data yang diusulkan.Dokumen Wajib :- Ijazah- SK Penyetaraan Ijasah (PT
          luar negeri)- Transkrip Nilai
        </p>
        <Form onSubmit={submitHandler} className="space-y-4" type="formdata">
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
              name="keterangan"
              onChange={inputHandler}
              value={form.keterangan}
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
            <Button onClick={toggle} variant="primary" className="w-full h-12">
              {isSubmit ? "Menyimpan data" : "Kirim"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
