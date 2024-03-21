import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import useMahasiswa from "../../../repo/mahasiswa";

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

  const { data: listMahasiswa } = useMahasiswa();

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
          <Form.Group className="col-span-2 flex gap-2">
            <Form.Label className="min-w-[10rem]">
              Nama <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="npm"
              onChange={(selected) =>
                inputHandler({
                  target: {
                    name: "npm",
                    value: selected?.value,
                  },
                })
              }
              value={form?.npm ?? ""}
              options={listMahasiswa?.map((mhs) => ({
                label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                value: mhs.npm,
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
