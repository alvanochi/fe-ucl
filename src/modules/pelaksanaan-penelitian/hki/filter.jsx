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
            <Form.Label>Judul</Form.Label>
            <Form.Input
              type="text"
              className="flex-1"
              name="judul_hki"
              onChange={inputHandler}
              value={form?.judul_hki ?? ""}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jenis HKI</Form.Label>
            <Form.Select
              className="flex-1"
              name="jenis_hki"
              value={form?.jenis_hki ?? ""}
              onChange={inputHandler}
              options={[
                { value: "Paten nasional", label: "Paten nasional" },
                {
                  value: "Paten internasional",
                  label: "Paten internasional",
                },
                { value: "Hak cipta nasional", label: "Hak cipta nasional" },
                {
                  value: "Hak cipta internasional",
                  label: "Hak cipta internasional",
                },
                {
                  value: "Rancangan dan karya seni monumental",
                  label: "Rancangan dan karya seni monumental",
                },
                {
                  value: "Rancangan dan karya seni rupa",
                  label: "Rancangan dan karya seni rupa",
                },
                {
                  value: "Rancangan dan karya seni kriya",
                  label: "Rancangan dan karya seni kriya",
                },
                {
                  value: "Rancangan dan karya seni pertunjukan",
                  label: "Rancangan dan karya seni pertunjukan",
                },
                { value: "Karya desain", label: "Karya desain" },
                { value: "Karya sastra", label: "Karya sastra" },
                {
                  value: "Hasil penelitian/pemikiran yang tidak dipublikasikan",
                  label: "Hasil penelitian/pemikiran yang tidak dipublikasikan",
                },
                {
                  value: "Hasil kerjasama industri yang tidak dipublikasikan",
                  label: "Hasil kerjasama industri yang tidak dipublikasikan",
                },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Terbit</Form.Label>
            <Form.Input
              type="date"
              className="flex-1"
              name="tgl_terbit_hki"
              onChange={inputHandler}
              value={form?.tgl_terbit_hki ?? ""}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              onChange={inputHandler}
              value={form?.status ?? null}
              options={[
                { label: "Diterima", value: 1 },
                { label: "Ditolak", value: 2 },
                { label: "Proses", value: 0 },
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
