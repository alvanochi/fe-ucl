import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import useForm from "../../../../hooks/useForm";

export default function Filter({ filter, handler }) {
  const { form, inputHandler, setForm } = useForm(filter);
  const { show, toggle, close } = useModal({
    onClose: () => {
      handler({});
      setForm({});
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    handler(form);
    toggle();
  };

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="clarity:filter-line" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Filter
      </Button>
      <Modal title="Filter Berdasarkan" show={show} handler={toggle}>
        <Form onSubmit={submitHandler} className="grid grid-cols-2 gap-4">
          <Form.Group>
            <Form.Label>No. SK</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="nomor_sk"
              value={form?.nomor_sk ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nama Sertifikasi</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_serti"
              value={form?.nama_serti ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jenis Sertifikasi</Form.Label>
            <Form.Select
              className="flex-1"
              name="jenis_serti"
              value={form?.jenis_serti ?? ""}
              onChange={inputHandler}
              options={[
                { label: "Test Bahasa Asing", value: "Test Bahasa Asing" },
                { label: "Kompentensi Profesi", value: "Kompentensi Profesi" },
                { label: "Lainnya", value: "Lainnya" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Bidang Studi</Form.Label>
            <Form.Select
              className="flex-1"
              name="bidang_studi"
              value={form?.bidang_studi ?? ""}
              onChange={inputHandler}
              options={[
                { label: "Teknik Informatika", value: "Teknik Informatika" },
                { label: "Teknik Mesin", value: "Teknik Mesin" },
                { label: "Teknik Elektro", value: "Teknik Elektro" },
                { label: "Teknik Sipil", value: "Teknik Sipil" },
              ]}
            />
          </Form.Group>
          <Form.Group className="col-span-2">
            <Form.Label>Tanggal Sertifikasi</Form.Label>
            <Form.Input
              type="date"
              className="flex-1"
              name="tgl_serti"
              value={form?.tgl_serti ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group className="col-span-2 flex gap-2">
            <Button type="button" variant="secondary" onClick={close}>
              Kosongkan
            </Button>
            <Button variant="primary" className="grow">
              Terapkan
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </>
  );
}
