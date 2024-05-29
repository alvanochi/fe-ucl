import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";

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
          <Form.Group className="col-span-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              className="flex-1 mt-4"
              name="status"
              value={form?.status ?? ""}
              onChange={inputHandler}
              options={[
                { label: "pengajuan-sk", value: "pengajuan-sk" },
                { label: "menuju-kolokium", value: "menuju-kolokium" },
                { label: "menuju-sidang", value: "menuju-sidang" },
                {
                  label: "menyelesaikan-revisi",
                  value: "menyelesaikan-revisi",
                },
                { label: "selesai", value: "selesai" },
              ]}
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
