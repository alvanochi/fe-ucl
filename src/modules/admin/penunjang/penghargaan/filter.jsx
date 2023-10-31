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
            <Form.Label>Nama Penghargaan</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_peng"
              value={form?.nama_peng ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jenis Penghargaan</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="jenis_peng"
              value={form?.jenis_peng ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Instansi</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="instansi_pemberi"
              value={form?.instansi_pemberi ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tahun</Form.Label>
            <Form.Select
              className="flex-1"
              name="tahun_peng"
              value={form?.tahun_peng ?? ""}
              onChange={inputHandler}
              options={Array.from(
                { length: new Date().getFullYear() - 1970 },
                (_, i) => new Date().getFullYear() - i
              ).map((item) => ({
                label: item,
                value: item,
              }))}
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
