import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import date from "../../../../../utils/date";
import { useEffect } from "react";

export default function AnggotaProfesiEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/penunjang/detailProfesi`;
	const FILE_URL = `${process.env.API_ENDPOINT}/file-profesi`;

	const INITIAL_FORM = {
		prof_id: "",
		nama_organisasi: "",
		peran: "",
		mulai_keanggotaan: "",
		selesai_keanggotaan: "",
		instansi_prof: "",
		file: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "nama_organisasi", label: "Nama Organisasi" },
			{ field: "peran", label: "Peran" },
			{ field: "mulai_keanggotaan", label: "Mulai Keanggotaan" },
			{ field: "selesai_keanggotaan", label: "Selesai Keanggotaan" },
			{ field: "instansi_prof", label: "Instansi Profesi" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	const EDIT_URL = `${process.env.API_ENDPOINT}/penunjang/editProfesi`;
	const EDIT_OPTION = { url: `${EDIT_URL}/${form.prof_id}`, method: "PATCH" };

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
			transformData: (data) => ({
				...data,
				mulai_keanggotaan: date.formatToInput(data.mulai_keanggotaan),
				selesai_keanggotaan: date.formatToInput(data.selesai_keanggotaan),
			}),
		});
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)} type="formdata">
				<Card className="mt-4">
					<Card.Header className="text-center">Anggota Profesi</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Organisasi <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_organisasi"
								onChange={inputHandler}
								value={form.nama_organisasi}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Peran <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="peran" onChange={inputHandler} value={form.peran} />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Mulai Keanggotaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="mulai_keanggotaan"
								onChange={inputHandler}
								value={form.mulai_keanggotaan}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Selesai Keanggotaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="selesai_keanggotaan"
								onChange={inputHandler}
								value={form.selesai_keanggotaan}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Instansi Profesi <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="instansi_prof"
								onChange={inputHandler}
								value={form.instansi_prof}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Dokumen <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="block flex-1 space-y-2">
								<Form.Input type="file" className="flex-1" name="file_profesi" onChange={inputHandler} />
								<embed src={`${FILE_URL}/${form.file}`} className="w-full h-[256px]" />
							</div>
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
