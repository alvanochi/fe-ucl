import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import useForm from "../../../../hooks/useForm";

export default function Filter({filter, handler}) {
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
            <Form.Label>Pangkat</Form.Label>
            <Form.Select
              name="pangkat"
              onChange={inputHandler}
              value={form?.pangkat ?? ""}
              options={[
                { label: "I/a", value: "I/a" },
                { label: "I/b", value: "I/b" },
                { label: "I/c", value: "I/c" },
                { label: "II/a", value: "II/a" },
                { label: "II/b", value: "II/b" },
                { label: "II/c", value: "II/c" },
                { label: "III/a", value: "III/a" },
                { label: "III/b", value: "III/b" },
                { label: "IV/a", value: "IV/a" },
                { label: "IV/b", value: "IV/b" },
                { label: "IV/c", value: "IV/c" },
                { label: "IV/d", value: "IV/d" },
                { label: "IV/e", value: "IV/e" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Golongan</Form.Label>
            <Form.Select
              name="golongan"
              onChange={inputHandler}
							value={form?.golongan ?? ""}
              options={[
                { label: "Juru", value: "Juru" },
                { label: "Juru Tingkat I", value: "Juru Tingkat I" },
                { label: "Pengatur", value: "Pengatur" },
                { label: "Pengatur Tingkat I", value: "Pengatur Tingkat I" },
                { label: "Penata Muda", value: "Penata Muda" },
                {
                  label: "Penata Muda Tingkat I",
                  value: "Penata Muda Tingkat I",
                },
                { label: "Penata", value: "Penata" },
                { label: "Penata Tingkat I", value: "Penata Tingkat I" },
                { label: "Pembina", value: "Pembina" },
                { label: "Pembina Tingkat I", value: "Pembina Tingkat I" },
                { label: "Pembina Utama Muda", value: "Pembina Utama Muda" },
                { label: "Pembina Utama Madya", value: "Pembina Utama Madya" },
                { label: "Pembina Utama", value: "Pembina Utama" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>No. SK</Form.Label>
            <Form.Input type="text" className="flex-1"
							name="no_sk"
							onChange={inputHandler}
							value={form?.no_sk ?? ""} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal SK</Form.Label>
            <Form.Input type="date" className="flex-1" name="tgl_sk" onChange={inputHandler} value={form?.tgl_sk ?? ""} />
          </Form.Group>
          <Form.Group className="col-span-2">
            <Form.Label>Tanggal Mulai</Form.Label>
            <Form.Input type="date" className="flex-1" name="tanggal_mulai" onChange={inputHandler} value={form?.tanggal_mulai ?? ""} />
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
