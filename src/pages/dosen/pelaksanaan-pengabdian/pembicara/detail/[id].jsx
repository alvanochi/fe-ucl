import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import BackButton from "../../../../../components/BackButton";
import dummyFile from "../../../../../config/file";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../../../utils/date";
import Accordion from "../../../../../components/Accordion";

export default function AnggotaProfesiEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/pengabdian/pembicara/detailPembicara`;
	const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-pembicara`;

	const INITIAL_FORM = {
		pembicara_id: "",
		kategori_pembicara: "",
		judul_makalah: "",
		nama_pertemuan: "",
		penyelenggara: "",
		tingkat_pertemuan: "",
		tgl_pelaksanaan: "",
		bahasa: "",
		no_sk_penugasan: "",
		tgl_sk_penugasan: "",
		nama_dok: "",
		keterangan: "",
		tautan_dok: "",
		docs: [],
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "kategori_pembicara", label: "Kategori Pembicara" },
			{ field: "judul_makalah", label: "Judul Makalah" },
			{ field: "nama_pertemuan", label: "Nama Pertemuan" },
			{ field: "penyelenggara", label: "Penyelenggara" },
			{ field: "tingkat_pertemuan", label: "Tingkat Pertemuan" },
			{ field: "tgl_pelaksanaan", label: "Tanggal Pelaksanaan" },
			{ field: "bahasa", label: "Bahasa" },
			{ field: "no_sk_penugasan", label: "No. SK Penugasan" },
			{ field: "tgl_sk_penugasan", label: "Tanggal SK Penugasan" },
			{ field: "nama_dok", label: "Nama Dokumen" },
			{ field: "keterangan", label: "Keterangan Dokumen" },
			{ field: "tautan_dok", label: "Tautan Dokumen" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	const EDIT_URL = `${process.env.API_ENDPOINT}/pengabdian/pembicara/editPembicara`;
	const EDIT_OPTION = { url: `${EDIT_URL}/${form.pembicara_id}`, method: "PATCH" };

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
			transformData: (data) => ({
				...data.dataPembicara[0],
				tgl_sk_penugasan: date.formatToInput(data.dataPembicara[0].tgl_sk_penugasan),
				tgl_pelaksanaan: date.formatToInput(data.dataPembicara[0].tgl_pelaksanaan),
				docs: data.dataDokumen,
			}),
		});
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} leading={<BackButton />} />
			<div className="flex justify-center mt-4">
				<Button
					as="a"
					href={`${prefix + menu.url}/pembicara/edit/${form.pembicara_id}`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Pembicara</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kategori Pembicara <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="kategori_pembicara"
								onChange={inputHandler}
								value={form.kategori_pembicara}
								options={[
									{ label: "Pembicara pada pertemuan ilmiah", value: "Pembicara pada pertemuan ilmiah" },
									{ label: "Pembicara kunci", value: "Pembicara kunci" },
									{
										label: "Pembicara/narasumber pada pelatihan/penyuluhan/ceramah",
										value: "Pembicara/narasumber pada pelatihan/penyuluhan/ceramah",
									},
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Judul Makalah <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="judul_makalah"
								onChange={inputHandler}
								value={form.judul_makalah}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Pertemuan Ilmiah <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_pertemuan"
								onChange={inputHandler}
								value={form.nama_pertemuan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tingkat Pertemuan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="tingkat_pertemuan"
								onChange={inputHandler}
								value={form.tingkat_pertemuan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Penyelenggara <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="penyelenggara"
								onChange={inputHandler}
								value={form.penyelenggara}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Pelaksanaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tgl_pelaksanaan"
								onChange={inputHandler}
								value={form.tgl_pelaksanaan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Bahasa <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="bahasa" onChange={inputHandler} value={form.bahasa} disabled />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								No SK Pengugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="no_sk_penugasan"
								onChange={inputHandler}
								value={form.no_sk_penugasan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Pengugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tgl_sk_penugasan"
								onChange={inputHandler}
								value={form.tgl_sk_penugasan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Dokumen <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="space-y-2 flex-1">
								{form.docs.map((doc, index) => (
									<Accordion key={`doc-${index}`} title={`Dokumen ${index + 1}`}>
										<Form.Group className="mb-4">
											<Form.Label>Nama Dokumen</Form.Label>
											<Form.Input type="text" className="flex-1" defaultValue={doc.nama_dok} disabled />
										</Form.Group>
										<Form.Group className="mb-4">
											<Form.Label>Keterangan</Form.Label>
											<Form.Input type="text" className="flex-1" defaultValue={doc.keterangan} disabled />
										</Form.Group>
										<Form.Group className="mb-4">
											<Form.Label>Tautan Dokumen</Form.Label>
											<Form.Input type="text" className="flex-1" defaultValue={doc.tautan_dok} disabled />
										</Form.Group>
										<Form.Group className="mb-4">
											<embed src={`${FILE_URL}/${doc.file}`} className="w-full h-[256px]" />
										</Form.Group>
									</Accordion>
								))}
							</div>
						</Form.Group>
					</Card.Body>
				</Card>
				<div className="flex gap-4 mt-4">
					<Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
						Kembali
					</Button>
				</div>
			</Form>
		</Layout>
	);
}
