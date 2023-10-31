import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";

export default function IpCreate() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/ipMhs/add`;
	const INITIAL_FORM = {
		semester: "",
		tahun: "",
		ip: "",
	};

	const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<Form onSubmit={submitHandler}>
				<Card className="mt-4">
					<Card.Header className="text-center">Tambah IP</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Semester <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="semester"
								value={form.semester}
								onChange={inputHandler}
								options={[
									{ label: "Semester 1", value: "Semster 1" },
									{ label: "Semester 2", value: "Semster 2" },
									{ label: "Semester 3", value: "Semster 3" },
									{ label: "Semester 4", value: "Semster 4" },
									{ label: "Semester 5", value: "Semster 5" },
									{ label: "Semester 6", value: "Semster 6" },
									{ label: "Semester 7", value: "Semster 7" },
									{ label: "Semester 8", value: "Semster 8" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Indeks Prestasi Persemerter (IPS) <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="ip" value={form.ip} onChange={inputHandler} />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tahun <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="tahun" value={form.tahun} onChange={inputHandler} />
						</Form.Group>
					</Card.Body>
				</Card>
				<div className="flex gap-4 mt-4">
					<Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
						Batal
					</Button>
					<Button type="submit" variant="primary" className="w-full h-12">
						Konfirmasi
					</Button>
				</div>
			</Form>
		</Layout>
	);
}
