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
					<Form.Group className="col-span-2">
						<Form.Label>Judul Bimbingan</Form.Label>
						<Form.Input type="text" name="judul_bimbingan" onChange={inputHandler} value={form?.judul_bimbingan ?? ""} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Semester</Form.Label>
						<Form.Input type="text" name="semester" onChange={inputHandler} value={form?.semester ?? ""} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Jenis Bimbingan</Form.Label>
						<Form.Select
							className="flex-1"
							name="jenis_bimbingan"
							value={form.jenis_bimbingan ?? ""}
							onChange={inputHandler}
							options={[
								{ label: "KP/PKL", value: "KP/PKL" },
								{ label: "KKN", value: "KKN" },
								{ label: "Skripsi", value: "Skripsi" },
							]}
						/>
					</Form.Group>
					<Form.Group className="col-span-2">
						<Form.Label>Program Studi</Form.Label>
						<Form.Select
							className="flex-1"
							name="program_studi"
							value={form.program_studi ?? ""}
							onChange={inputHandler}
							options={[
								{ label: "Teknik Informatika", value: "Teknik Informatika" },
								{ label: "Teknik Mesin", value: "Teknik Mesin" },
								{ label: "Teknik Elektro", value: "Teknik Elektro" },
								{ label: "Teknik Sipil", value: "Teknik Sipil" },
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
