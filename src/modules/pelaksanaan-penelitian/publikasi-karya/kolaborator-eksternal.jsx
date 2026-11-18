import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";

export default function KolabolatorEksternal() {
	const { show, toggle } = useModal();

	return (
		<>
			<Button type="button" variant="secondary" onClick={toggle}>
				Tambah Kolaborator Eksternal
			</Button>
			<Modal title="Tambah Kolaborator Eksternal" show={show} handler={toggle} size="lg">
				<Form className="space-y-4">
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Nama <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="text" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Negara <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Select
							className="flex-1"
							options={[
								{ label: "Indonesia", value: "Indonesia" },
								{ label: "Singapura", value: "Singapura" },
								{ label: "Malaysia", value: "Malaysia" },
								{ label: "Filipina", value: "Filipina" },
								{ label: "Vietnam", value: "Vietnam" },
								{ label: "Brunei Darusalam", value: "Brunei Darusalam" },
							]}
						/>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Jenis Kelamin <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<div className="flex gap-4">
							<Form.Label>
								<Form.Radio name="jenis_kelamin" />
								Laki-Laki
							</Form.Label>
							<Form.Label>
								<Form.Radio name="jenis_kelamin" />
								Perempuan
							</Form.Label>
						</div>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							NIK <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="number" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Tanggal Lahir <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="date" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Alamat <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Textarea className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							RT <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="number" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							RW <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="number" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Desa/Kelurahan <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="text" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Kota/Kabupaten <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="text" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Provinsi <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="text" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Kode POS <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="number" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							No. HP <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="number" className="flex-1" />
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">
							Email <span className="text-danger-600">*</span>
						</Form.Label>
						<span>:</span>
						<Form.Input type="email" className="flex-1" />
					</Form.Group>
					<div className="flex gap-4 mt-4">
						<Button onClick={toggle} variant="secondary" className="w-full h-12">
							Batal
						</Button>
						<Button type="submit" variant="primary" className="w-full h-12">
							Konfirmasi
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
}
