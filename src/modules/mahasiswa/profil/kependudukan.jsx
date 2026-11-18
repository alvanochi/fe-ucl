import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";

export default function KependudukanModule({ baseURL }) {
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
				<Card.Header className="text-center">Kewarganegaraan</Card.Header>
				<Card.Body className="space-y-4">
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Nomor Induk Kependudukan</Form.Label>
						<span>:</span>
						<p>3271061105890014</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Agama</Form.Label>
						<span>:</span>
						<p>Islam</p>
					</Form.Group>
					<Form.Group className="flex items-baseline gap-3">
						<Form.Label className="min-w-[18rem]">Kewarganegaraan</Form.Label>
						<span>:</span>
						<p>Indonesia</p>
					</Form.Group>
				</Card.Body>
			</Card>
		</>
	);
}
