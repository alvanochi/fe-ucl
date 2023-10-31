import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";

export default function KeluargaModule({ baseURL }) {
	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<Button
					as="a"
					href={`${baseURL}/keluarga/edit`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Card className="mt-4">
				<Card.Header className="text-center">Keluarga</Card.Header>
				<Card.Body className="space-y-4">
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nama ayah/wali</Form.Label>
						<span>:</span>
						<p>Sukijar</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">pekerjaan ayah/wali</Form.Label>
						<span>:</span>
						<p>Karyawan Swasta</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Status</Form.Label>
						<span>:</span>
						<p>Hidup</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">No Telp ayah/wali</Form.Label>
						<span>:</span>
						<p>8775689495</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nama ibu/wali</Form.Label>
						<span>:</span>
						<p>megawati</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Pekerjaan ibu/wali</Form.Label>
						<span>:</span>
						<p>IRT (ibu rumah tangga)</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Status</Form.Label>
						<span>:</span>
						<p>Hidup</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">No Telp. ibu/wali</Form.Label>
						<span>:</span>
						<p>89765479775</p>
					</Form.Group>
					
				</Card.Body>
			</Card>
		</>
	);
}
