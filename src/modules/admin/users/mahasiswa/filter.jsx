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
			<Button variant="primary" icon={<Icon icon="clarity:filter-line" width={20} height={20} />} onClick={toggle} pill>
				Filter
			</Button>
			<Modal title="Filter Berdasarkan" show={show} handler={toggle}>
				<Form onSubmit={submitHandler} className="grid grid-cols-2 gap-4">
					<Form.Group>
						<Form.Label>Nama Lengkap</Form.Label>
						<Form.Input
							type="text"
							className="flex-1"
							name="nama_lengkap"
							value={form?.nama_lengkap ?? ""}
							onChange={inputHandler}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>NPM</Form.Label>
						<Form.Input
							type="text"
							className="flex-1"
							name="npm"
							value={form?.npm ?? ""}
							onChange={inputHandler}
						/>
					</Form.Group>
          <Form.Group className="col-span-2">
						<Form.Label>Status Mahasiswa</Form.Label>
						<Form.Select
							className="flex-1"
							name="kode_mhs"
							value={form?.kode_mhs ?? ""}
							onChange={inputHandler}
							options={[
								{ label: "ACTIVE", value: "ACTIVE" },
								{
									label: "INACTIVE",
									value: "INACTIVE",
								},
								{
									label: "GRADUATED",
									value: "GRADUATED",
								},
                {
									label: "REGISTRATION",
									value: "REGISTRATION",
								},
                {
									label: "QUIT",
									value: "QUIT",
								},
                {
									label: "DROPPED-OUT",
									value: "DROPPED-OUT",
								},
                {
									label: "PMM",
									value: "PMM",
								},
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
