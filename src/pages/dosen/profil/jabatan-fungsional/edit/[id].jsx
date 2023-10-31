import { useRouter } from "next/router";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../../../utils/date";

export default function JabatanFungsionalEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/profile/detailDataJabatan`;
	const FILE_URL = `${process.env.API_ENDPOINT}/file-jabatan`;

	const INITIAL_FORM = {
		jabatan_id: "",
		jabatan_fungsi: "",
		nomor_sk: "",
		tgl_mulai: "",
		kel_penelitian: "",
		kel_pengab_msyrkt: "",
		kel_keg_penunjang: "",
		file: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "jabatan_fungsi", label: "Jabatan Fungsi" },
			{ field: "nomor_sk", label: "No. SK" },
			{ field: "tgl_mulai", label: "Terhitung Mulai Tanggal" },
			{ field: "kel_penelitian", label: "Kelebihan Penelitian" },
			{ field: "kel_pengab_msyrkt", label: "Kelebihan Pengabdian Masyarakat" },
			{ field: "kel_keg_penunjang", label: "Kelebihan Kegiatan Penunjang" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	const EDIT_URL = `${process.env.API_ENDPOINT}/profile/editDataJabatan`;
	const EDIT_OPTION = { url: `${EDIT_URL}/${form.jabatan_id}`, method: "PATCH" };

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
			transformData: (data) => ({ ...data, tgl_mulai: date.formatToInput(data.tgl_mulai) }),
		});
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)} type="formdata">
				<Card className="mt-4">
					<Card.Header className="text-center">Jabatan Fungsional</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jabatan Fungsional <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="jabatan_fungsi"
								onChange={inputHandler}
								value={form.jabatan_fungsi}
								required
								options={[
									{ value: "Asisten Ahli", label: "Asisten Ahli" },
									{ value: "Lektor", label: "Lektor" },
									{ value: "Lektor Kepala", label: "Lektor Kepala" },
									{ value: "Profesor", label: "Profesor" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								No. SK <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nomor_sk"
								onChange={inputHandler}
								value={form.nomor_sk}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Terhitung Mulai Tanggal <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tgl_mulai"
								onChange={inputHandler}
								value={form.tgl_mulai}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kelebihan Penelitian <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								min="0"
								step="0.01"
								className="flex-1"
								name="kel_penelitian"
								onChange={inputHandler}
								value={form.kel_penelitian}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kelebihan Pengabdian Masyarakat <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								min="0"
								step="0.01"
								className="flex-1"
								name="kel_pengab_msyrkt"
								onChange={inputHandler}
								value={form.kel_pengab_msyrkt}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kelebihan Kegiatan Penunjang <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								min="0"
								step="0.01"
								className="flex-1"
								name="kel_keg_penunjang"
								onChange={inputHandler}
								value={form.kel_keg_penunjang}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Unggah File <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="block flex-1 space-y-2">
								<Form.Input type="file" className="flex-1" name="file_jabatan" onChange={inputHandler} />
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
