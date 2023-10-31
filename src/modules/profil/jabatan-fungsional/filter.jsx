import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";

export default function Filter() {
	const { show, toggle } = useModal();

	return (
		<>
			<Button variant="primary" icon={<Icon icon="clarity:filter-line" width={20} height={20} />} onClick={toggle} pill>
				Filter
			</Button>
			<Modal title="Filter Berdasarkan" show={show} handler={toggle}>
				<Form className="grid grid-cols-2 gap-4">
					<Form.Group>
						<Form.Label>Jabatan Fungsional</Form.Label>
						<Form.Select
							options={[
								{ value: "Asisten Ahli", label: "Asisten Ahli" },
								{ value: "Asisten Ahli", label: "Asisten Ahli" },
								{ value: "Lektor", label: "Lektor" },
								{ value: "Lektor", label: "Lektor" },
								{ value: "Lektor Kepala", label: "Lektor Kepala" },
								{ value: "Lektor Kepala", label: "Lektor Kepala" },
								{ value: "Lektor Kepala", label: "Lektor Kepala" },
								{ value: "Profesor", label: "Profesor" },
								{ value: "Profesor", label: "Profesor" },
							]}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Ankga Kredit</Form.Label>
						<Form.Select
							options={[
								{ value: "100.00", label: "100.00" },
								{ value: "150.00", label: "150.00" },
								{ value: "200.00", label: "200.00" },
								{ value: "300.00", label: "300.00" },
								{ value: "400.00", label: "400.00" },
								{ value: "550.00", label: "550.00" },
								{ value: "700.00", label: "700.00" },
								{ value: "850.00", label: "850.00" },
								{ value: "1050.00", label: "1050.00" },
							]}
						/>
					</Form.Group>
					<Form.Group className="col-span-2">
						<Form.Label>No. SK</Form.Label>
						<Form.Input type="text" />
					</Form.Group>
					<Form.Group>
						<Form.Label>Terhitung Dari</Form.Label>
						<Form.Input type="date" />
					</Form.Group>
					<Form.Group>
						<Form.Label>Terhitung Sampai</Form.Label>
						<Form.Input type="date" />
					</Form.Group>
					<Form.Group className="col-span-2 flex gap-2">
						<Button type="button" variant="secondary" onClick={toggle}>
							Batal
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
