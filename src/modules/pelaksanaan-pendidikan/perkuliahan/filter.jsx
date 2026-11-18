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
          <Form.Group>
            <Form.Label>Tahun</Form.Label>
            <Form.Select
              name="tahun"
              onChange={inputHandler}
              value={form?.tahun ?? null}
              options={[
                { label: "2025/2026", value: "2025/2026" },
                { label: "2024/2025", value: "2024/2025" },
                { label: "2023/2024", value: "2023/2024" },
                { label: "2022/2023", value: "2022/2023" },
                { label: "2021/2022", value: "2021/2022" },
                { label: "2020/2021", value: "2020/2021" },
                { label: "2019/2020", value: "2019/2020" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Semester</Form.Label>
            <Form.Select
              className="flex-1"
              name="semester"
              value={form?.semester ?? ""}
              onChange={inputHandler}
              options={[
                { label: "GASAL", value: "GASAL" },
                { label: "GENAP", value: "GENAP" },
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
