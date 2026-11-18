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
						<Form.Label>Pangkat</Form.Label>
						<Form.Select
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
							options={[
								{ label: "Juru", value: "Juru" },
								{ label: "Juru Tingkat I", value: "Juru Tingkat I" },
								{ label: "Pengatur", value: "Pengatur" },
								{ label: "Pengatur Tingkat I", value: "Pengatur Tingkat I" },
								{ label: "Penata Muda", value: "Penata Muda" },
								{ label: "Penata Muda Tingkat I", value: "Penata Muda Tingkat I" },
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
						<Form.Input type="text" />
					</Form.Group>
					<Form.Group>
						<Form.Label>Tanggal SK</Form.Label>
						<Form.Input type="date" />
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
