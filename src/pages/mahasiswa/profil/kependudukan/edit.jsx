import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import { useEffect } from "react";

export default function KependudukanEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;

	const INITIAL_FORM = {
		dp_id: "",
		nik: "",
		agama: "",
		warga_negara: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "nik", label: "NIK" },
			{ field: "agama", label: "Agama" },
			{ field: "warga_negara", label: "Kewarganegaraan" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	const EDIT_URL = `${process.env.API_ENDPOINT}/profile/editData`;
	const EDIT_OPTION = { url: `${EDIT_URL}`, method: "PATCH" };

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show("");
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
				<Card className="mt-4">
					<Card.Header className="text-center">Kependudukan</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								NIK <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="nik" onChange={inputHandler} value={form.nik} required />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Agama <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="agama"
								onChange={inputHandler}
								value={form.agama}
								required
								options={[
									{ label: "Islam", value: "Islam" },
									{ label: "Hindu", value: "Hindu" },
									{ label: "Budha", value: "Budha" },
									{ label: "Katolik", value: "Katolik" },
									{ label: "Protestan", value: "Protestan" },
									{ label: "Konghuchu", value: "Konghuchu" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kewarganegaraan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="warga_negara"
								onChange={inputHandler}
								value={form.warga_negara}
								required
								options={[
									{ label: "Indonesia", value: "Indonesia" },
									{ label: "Malaysia", value: "Malaysia" },
									{ label: "Thailand", value: "Thailand" },
									{ label: "Singapura", value: "Singapura" },
								]}
							/>
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
