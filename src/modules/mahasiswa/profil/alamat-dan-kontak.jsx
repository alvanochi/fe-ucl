import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";

export default function AlamatDanKontakModule({ baseURL }) {
	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<Button
					as="a"
					href={`${baseURL}/alamat-dan-kontak/edit`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Card className="mt-4">
				<Card.Header className="text-center">Alamat Dan Kontak</Card.Header>
				<Card.Body className="space-y-4">
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Email</Form.Label>
						<span>:</span>
						<p>alif@gmail.com</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Alamat</Form.Label>
						<span>:</span>
						<p>Jalan raya ciapus</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Dusun</Form.Label>
						<span>:</span>
						<p>-</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Desa/Kelurahan</Form.Label>
						<span>:</span>
						<p>Tamansari</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Kota/Kabupaten</Form.Label>
						<span>:</span>
						<p>Kabupaten Bogor</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Kode POS</Form.Label>
						<span>:</span>
						<p>16154</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nomor Telp. Rumah</Form.Label>
						<span>:</span>
						<p></p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nomor HP</Form.Label>
						<span>:</span>
						<p>089634875609</p>
					</Form.Group>
				</Card.Body>
			</Card>
		</>
	);
}
