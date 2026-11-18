import { Icon } from "@iconify-icon/react";
import useForm from "../../../../hooks/useForm";
import useModal from "../../../../hooks/useModal";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";

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
            <Form.Label>Judul</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="judul_kegiatan"
              onChange={inputHandler}
              value={form?.judul_kegiatan ?? ""}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tahun Pelaksanaan</Form.Label>
            <Form.Select
              className="flex-1"
              name="tahun_pelaksanaan"
              onChange={inputHandler}
              value={form?.tahun_pelaksanaan ?? ""}
              options={Array.from(
                { length: new Date().getFullYear() - 1970 },
                (_, i) => new Date().getFullYear() - i
              ).map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Group>
          <Form.Group className="col-span-2">
            <Form.Label>Lama Kegiatan (Tahun)</Form.Label>
            <Form.Input
              type="number"
              className="flex-1"
              name="lama_kegiatan"
              onChange={inputHandler}
              value={form?.lama_kegiatan ?? ""}
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
