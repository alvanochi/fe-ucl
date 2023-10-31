import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../hooks/useCRUD";
import useKategoriPrestasi from "../../../../repo/kategori-prestasi";
import { useEffect } from "react";

export default function PenghargaanDetail() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/penunjang/detailPenghargaan`;
	const FILE_URL = `${process.env.API_ENDPOINT}/file-penghargaan`;

	const INITIAL_FORM = {
		penghargaan_id: "",
		kategori_id: "",
		tingkat_peng: "",
		jenis_peng: "",
		nama_peng: "",
		tahun_peng: "",
		instansi_pemberi: "",
		file: "",
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "kategori_id", label: "Kategori Penghargaan" },
			{ field: "tingkat_peng", label: "tingkat Penghargaan" },
			{ field: "jenis_peng", label: "Jenis Penghargaan" },
			{ field: "nama_peng", label: "Nama Penghargaan" },
			{ field: "tahun_peng", label: "Tahun Penghargaan" },
			{ field: "instansi_peberi", label: "Instansi Pemberi" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form } = formdata;

	const { data: kategoriPrestasi, isLoading: isLoadingKategoriPrestasi } = useKategoriPrestasi([user]);


	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id);
	}, [router, user]);

	if ([user, menu, isLoadingKategoriPrestasi].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<div className="flex justify-center mt-4">
				<Button
					as="a"
					href={`${prefix + menu.url}/penghargaan/edit/${form.penghargaan_id}`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)} type="formdata">
				<Card className="mt-4">
					<Card.Header className="text-center">Penghargaan</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kategori Sertifikasi <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="kategori_id"
								value={form.kategori_id}
								
								options={
									kategoriPrestasi &&
									kategoriPrestasi.map((item) => ({
										label: `${item.nama_kategori} - Juara ${item.juara}`,
										value: item.id,
									}))
								}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tingkat Penghargaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="tingkat_peng"
								value={form.tingkat_peng}
								
								options={[
									{ label: "Lokal", value: "Lokal" },
									{ label: "Daerah", value: "Daerah" },
									{ label: "Nasional", value: "Nasional" },
									{ label: "Internasional", value: "Internasional" },
									{ label: "Lainnya", value: "Lainnya" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Penghargaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="jenis_peng"
								value={form.jenis_peng}
								
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Penghargaan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_peng"
								value={form.nama_peng}
								
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tahun <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								type="date"
								className="flex-1"
								name="tahun_peng"
								value={form.tahun_peng}
								
								options={Array.from(
									{ length: new Date().getFullYear() - 1970 },
									(_, i) => new Date().getFullYear() - i
								).map((item) => ({
									label: item,
									value: item,
								}))}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Instansi Pemberi <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								className="flex-1"
								name="instansi_pemberi"
								value={form.instansi_pemberi}
								
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Unggah File <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="block flex-1 space-y-2">
								<embed src={`${FILE_URL}/${form.file}`} className="w-full h-[256px]" />
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
