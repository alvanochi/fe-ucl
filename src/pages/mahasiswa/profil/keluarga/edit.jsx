import { useEffect } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import { useRouter } from "next/router";
import date from "../../../../utils/date";

export default function KeluargaEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;

	const INITIAL_FORM = {
		dp_id: "",
		nama_pasangan: "",
		nip_pasangan: "",
		pekerjaan_pasangan: "",
		tanggal_pns_pasangan: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "nama_pasangan", label: "Nama Suami/Istri" },
			{ field: "nip_pasangan", label: "NIP Suami/Istri" },
			{ field: "pekerjaan_pasangan", label: "Pekerjaan Suami/Istri" },
			{ field: "tanggal_pns_pasangan", label: "Terhitung Mulai Tanggal PNS Suami/Istri " },
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
				tanggal_pns_pasangan: data.tanggal_pns_pasangan ? date.formatToInput(data.tanggal_pns_pasangan) : "",
			}),
		});
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
				<Card className="mt-4">
					<Card.Header className="text-center">Keluarga</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="w-[18rem]">
								Nama Suami/Istri <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_pasangan"
								onChange={inputHandler}
								value={form.nama_pasangan}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="w-[18rem]">
								NIP Suami/Istri <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nip_pasangan"
								onChange={inputHandler}
								value={form.nip_pasangan}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="w-[18rem]">
								Pekerjaan Suami/Istri <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="pekerjaan_pasangan"
								onChange={inputHandler}
								value={form.pekerjaan_pasangan}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="w-[18rem]">
								Terhitung Mulai Tanggal PNS Suami/Istri <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tanggal_pns_pasangan"
								onChange={inputHandler}
								value={form.tanggal_pns_pasangan}
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
