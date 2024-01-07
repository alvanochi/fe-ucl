import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";

export default function Filter() {
  const { show, toggle } = useModal();

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
        <Form className="grid grid-cols-2 gap-4">
          <Form.Group>
            <Form.Label>Nama</Form.Label>
            <Form.Input type="text" />
          </Form.Group>
          <Form.Group>
            <Form.Label>NPM</Form.Label>
            <Form.Input type="number" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Point</Form.Label>
            <Form.Input type="number" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status MHS</Form.Label>
            <Form.Input type="text" />
          </Form.Group>
          <Form.Group className="col-span-2 flex gap-2">
            <Button type="button" variant="secondary" onClick={toggle}>
              Batal
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
