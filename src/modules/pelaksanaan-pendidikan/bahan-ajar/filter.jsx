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
						<Form.Label>Judul Bahan Ajar</Form.Label>
						<Form.Input type="text" name="judul_bahan_ajar" onChange={inputHandler} value={form?.judul_bahan_ajar ?? ""} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Jenis</Form.Label>
						<Form.Select
							className="flex-1"
							name="jenis_bahan_ajar"
							value={form.jenis_bahan_ajar ?? ""}
							onChange={inputHandler}
							options={[
								{ label: "Alat Bantu", value: "Alat Bantu" },
								{ label: "Audio Visual", value: "Audio Visual" },
								{ label: "Buku Ajar", value: "Buku Ajar" },
								{ label: "Diktat", value: "Diktat" },
								{ label: "Model", value: "Model" },
								{ label: "Modul", value: "Modul" },
								{ label: "Naskah Tutorial", value: "Naskah Tutorial" },
								{ label: "Petunjuk Praktikum", value: "Petunjuk Praktikum" },
							]}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Penerbit</Form.Label>
						<Form.Input type="text" name="penerbit" onChange={inputHandler} value={form?.penerbit ?? ""} />
					</Form.Group>
					<Form.Group className="col-span-2">
						<Form.Label>Tanggal Terbit</Form.Label>
						<Form.Input type="date" name="tgl_terbit" onChange={inputHandler} value={form?.tgl_terbit ?? ""} />
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
