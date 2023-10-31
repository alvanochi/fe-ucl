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
            <Form.Label>Jenjang Studi</Form.Label>
            <Form.Select
              className="flex-1"
              name="jenjang_studi"
              onChange={inputHandler}
              value={form.jenjang_studi ?? ""}
              options={[
                { label: "SD", value: "SD" },
                { label: "SMP", value: "SMP" },
                { label: "SMA/SMK/MA", value: "SMA/SMK/MA" },
                { label: "D3", value: "D3" },
                { label: "S1", value: "S1" },
                { label: "S2", value: "S2" },
                { label: "S3", value: "S3" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Gelar</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="gelar_akademik"
              onChange={inputHandler}
              value={form.gelar_akademik ?? ""}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Asal</Form.Label>
            <Form.Select
              className="flex-1"
              name="asal"
              onChange={inputHandler}
              value={form.asal ?? ""}
              options={[
                {
                  label: "Universitas Ibn Khaldun Bogor",
                  value: "Universitas Ibn Khaldun Bogor",
                },
                {
                  label: "Universitas Indonesia",
                  value: "Universitas Indonesia",
                },
                {
                  label: "Institut Teknologi Bandung",
                  value: "Institut Teknologi Bandung",
                },
                {
                  label: "Universitas Gadjah Mada",
                  value: "Universitas Gadjah Mada",
                },
                {
                  label: "Institut Pertanian Bogor",
                  value: "Institut Pertanian Bogor",
                },
                {
                  label: "Universitas Airlangga",
                  value: "Universitas Airlangga",
                },
                {
                  label: "Universitas Diponegoro",
                  value: "Universitas Diponegoro",
                },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Program Studi</Form.Label>
            <Form.Select
              className="flex-1"
              name="program_studi"
              onChange={inputHandler}
              value={form.program_studi ?? ""}
              options={[
                { label: "Teknik Informatika", value: "Teknik Informatika" },
                { label: "Teknik Mesin", value: "Teknik Mesin" },
                { label: "Teknik Elektro", value: "Teknik Elektro" },
                { label: "Teknik Sipil", value: "Teknik Sipil" },
              ]}
            />
          </Form.Group>
          <Form.Group className="col-span-2">
            <Form.Label>Tahun Lulus</Form.Label>
            <Form.Select
              className="flex-1"
              name="tahun_lulus"
              onChange={inputHandler}
              value={form.tahun_lulus ?? ""}
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
