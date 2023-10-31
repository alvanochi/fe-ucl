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
            <Form.Label>Nama Pekerjaan</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="jabatan"
              value={form?.jabatan ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>LN/DN</Form.Label>
            <Form.Select
              name="area_kerja"
              value={form?.area_kerja ?? ""}
              onChange={inputHandler}
              options={[
                { label: "Luar Negri", value: "Luar Negri" },
                { label: "Dalam Negri", value: "Dalam Negri" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dari Tanggal</Form.Label>
            <Form.Input
              type="date"
              className="flex-1"
              name="mulai_kerja"
              value={form?.mulai_kerja ?? ""}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Sampai Tanggal</Form.Label>
            <Form.Input
              type="date"
              className="flex-1"
              name="sampai_kerja"
              value={form?.sampai_kerja ?? ""}
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
