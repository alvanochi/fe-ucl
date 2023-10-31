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
						<Form.Label>Semester</Form.Label>
						<Form.Select
							name="semester"
							onChange={inputHandler}
							value={form?.semester ?? ""}
							options={[
								{ label: "Semester 1", value: "Semseter 1" },
								{ label: "Semester 2", value: "Semester 2" },
								{ label: "Semester 3", value: "Semester 3" },
								{ label: "Semester 4", value: "Semester 4" },
								{ label: "Semester 5", value: "Semester 5" },
								{ label: "Semester 6", value: "Semester 6" },
								{ label: "Semester 7", value: "Semester 7" },
								{ label: "Semester 8", value: "Semester 8" },
							]}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>IPS</Form.Label>
						<Form.Input type="text" className="flex-1" name="ip" onChange={inputHandler} value={form?.ip ?? ""} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Tahun</Form.Label>
						<Form.Select
							name="tahun"
							onChange={inputHandler}
							value={form?.tahun ?? ""}
							options={Array.from({ length: new Date().getFullYear() - 1970 }, (_, i) => new Date().getFullYear() - i).map(
								(item) => ({
									label: item,
									value: item,
								})
							)}
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
