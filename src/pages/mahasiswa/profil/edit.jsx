import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useCRUD from "../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../utils/date";

export default function ProfilEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;

	const INITIAL_FORM = {
		dp_id: "",
		nik: "",
		jenkel: "",
		nama_lengkap: "",
		tempat_lahir: "",
		tanggal_lahir: "",
		ibu_kandung: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "nik", label: "NIK" },
			{ field: "jenkel", label: "Jenis Kelamin" },
			{ field: "nama_lengkap", label: "Nama Lengkap" },
			{ field: "tempat_lahir", label: "Tempat Lahir" },
			{ field: "tanggal_lahir", label: "Tanggal Lahir" },
			{ field: "ibu_kandung", label: "Nama Ibu Kandung" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	const EDIT_URL = `${process.env.API_ENDPOINT}/profile/editData`;
	const EDIT_OPTION = { url: `${EDIT_URL}`, method: "PATCH" };

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show("", {
			transformData: (data) => ({
				...data,
				tanggal_lahir: date.formatToInput(data.tanggal_lahir),
			}),
		});
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
				<Card className="mt-4">
					<Card.Header className="text-center">Profil</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								NIDN <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="nik" onChange={inputHandler} value={form.nik} required />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_lengkap"
								onChange={inputHandler}
								value={form.nama_lengkap}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Kelamin <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="flex gap-4">
								<Form.Label>
									<Form.Radio name="jenkel" value="L" onChange={inputHandler} checked={form.jenkel == "L"} />
									Laki-Laki
								</Form.Label>
								<Form.Label>
									<Form.Radio name="jenkel" value="P" onChange={inputHandler} checked={form.jenkel == "P"} />
									Perempuan
								</Form.Label>
							</div>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tempat Lahir <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="tempat_lahir"
								onChange={inputHandler}
								value={form.tempat_lahir}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Lahir <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tanggal_lahir"
								onChange={inputHandler}
								value={form.tanggal_lahir}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Ibu Kandung <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="ibu_kandung"
								onChange={inputHandler}
								value={form.ibu_kandung}
								required
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
