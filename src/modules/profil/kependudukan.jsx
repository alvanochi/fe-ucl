import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";

export default function KependudukanModule({ baseURL }) {
	const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
	const { data, loading } = useDatatable(DATA_URL);

	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<Button
					as="a"
					href={`${baseURL}/kependudukan/edit`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Card className="mt-4">
				<Card.Header className="text-center">Kependudukan</Card.Header>
				<Card.Body className="space-y-4">
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nomor Induk Kependudukan</Form.Label>
						<span>:</span>
						<p>{!loading && data.nik}</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Agama</Form.Label>
						<span>:</span>
						<p>{!loading && data.agama}</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Kewarganegaraan</Form.Label>
						<span>:</span>
						<p>{!loading && data.warga_negara}</p>
					</Form.Group>
				</Card.Body>
			</Card>
		</>
	);
}
