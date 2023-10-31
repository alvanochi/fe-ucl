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
			<Button variant="primary" icon={<Icon icon="clarity:filter-line" width={20} height={20} />} onClick={toggle} pill>
				Filter
			</Button>
			<Modal title="Filter Berdasarkan" show={show} handler={toggle}>
				<Form onSubmit={submitHandler} className="grid grid-cols-2 gap-4">
					<Form.Group>
						<Form.Label>Judul</Form.Label>
						<Form.Input
							type="text"
							className="flex-1"
							name="judul_makalah"
							onChange={inputHandler}
							value={form?.judul_makalah ?? ""}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Penyelenggara</Form.Label>
						<Form.Input
							type="text"
							className="flex-1"
							name="penyelenggara"
							onChange={inputHandler}
							value={form?.penyelenggara ?? ""}
						/>
					</Form.Group>
					<Form.Group className="col-span-2">
						<Form.Label>Tanggal Pelaksanaan</Form.Label>
						<Form.Input
							type="date"
							className="flex-1"
							name="tgl_pelaksanaan"
							onChange={inputHandler}
							value={form?.tgl_pelaksanaan ?? ""}
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
