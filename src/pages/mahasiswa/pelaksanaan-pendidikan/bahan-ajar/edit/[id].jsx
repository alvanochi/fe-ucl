import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import UploadDokumen from "../../../../../modules/pelaksanaan-pendidikan/bahan-ajar/upload-dokumen";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import useDosen from "../../../../../repo/dosen";
import useMahasiswa from "../../../../../repo/mahasiswa";
import date from "../../../../../utils/date";
import { useEffect } from "react";
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from "../../../../../config/role";
import _ from "underscore";
import Accordion from "../../../../../components/Accordion";

export default function BahanAjarEdit() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/pendidikan/bahan-ajar/detail`;
	const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-bahanAjar`;

	const INITIAL_ANGGOTA = {
		user_id: "",
		urutan: "",
		afiliasi: "",
		peran: "",
		role: "",
	};

	const INITIAL_FORM = {
		bahan_ajar_id: "",
		jenis_bahan_ajar: "",
		judul_bahan_ajar: "",
		tgl_terbit: "",
		penerbit: "",
		no_sk_penugasan: "",
		tgl_sk_penugasan: "",
		nama_dok: "",
		keterangan: "",
		tautan_dok: "",
		penulis_dosen: [],
		penulis_mahasiswa: [],
		docs: [],
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		transformData: (data) =>
			_.omit(
				{
					...data,
					penulis: JSON.stringify([
						...data.penulis_dosen.map((item) => _.omit(item, ["role"])),
						...data.penulis_mahasiswa.map((item) => _.omit(item, ["role"])),
					]),
				},
				["penulis_dosen", "penulis_mahasiswa"]
			),
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler, setForm } = formdata;

	const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
	const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user]);

	const EDIT_URL = `${process.env.API_ENDPOINT}/pendidikan/bahan-ajar/edit`;
	const EDIT_OPTION = { url: `${EDIT_URL}/${form.bahan_ajar_id}`, method: "PATCH" };

	const findInUser = (lists, id) => lists.find((item) => item.user_id == id) ?? null;
	const removeFromUser = (key, index, role) =>
		setForm((state) => ({
			...state,
			[key]: state[key].filter((item, idx) => item.role == role && idx != index),
		}));

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
			transformData: (data) => ({
				...INITIAL_FORM,
				...data.data[0],
				tgl_terbit: date.formatToInput(data.data[0].tgl_terbit),
				tgl_sk_penugasan: date.formatToInput(data.data[0].tgl_sk_penugasan),
				penulis_dosen: data.penulis.filter((item) => item.role == ROLE_ID_DOSEN),
				penulis_mahasiswa: data.penulis.filter((item) => item.role == ROLE_ID_MAHASISWA),
				docs: data.dataDokumen,
			}),
		});
	}, [router, user]);

	if ([user, menu, isDosenLoading, isMahasiswaLoading].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)} type="formdata">
				<Card className="mt-4">
					<Card.Header className="text-center">Bahan Ajar</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Bahan Ajar <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="jenis_bahan_ajar"
								value={form.jenis_bahan_ajar}
								onChange={inputHandler}
								options={[
									{ label: "Alat Bantu", value: "Alat Bantu" },
									{ label: "Audio Visual", value: "Audio Visual" },
									{ label: "Buku Ajar", value: "Buku Ajar" },
									{ label: "Diktat", value: "Diktat" },
									{ label: "Model", value: "Model" },
									{ label: "Modul", value: "Modul" },
									{ label: "Naskah Tutorial", value: "Naskah Tutorial" },
									{ label: "Petunjuk Praktikum", value: "Petunjuk Praktikum" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Judul Bahan Ajar <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="judul_bahan_ajar"
								value={form.judul_bahan_ajar}
								onChange={inputHandler}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Terbit <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" name="tgl_terbit" value={form.tgl_terbit} onChange={inputHandler} />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Penerbit <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" name="penerbit" value={form.penerbit} onChange={inputHandler} />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								SK Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="no_sk_penugasan"
								value={form.no_sk_penugasan}
								onChange={inputHandler}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal SK Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="date"
								className="flex-1"
								name="tgl_sk_penugasan"
								value={form.tgl_sk_penugasan}
								onChange={inputHandler}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Dokumen <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="flex-1 block">
								<UploadDokumen form={form} inputHandler={inputHandler} />
								<div className="space-y-2 mt-2">
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
							</div>
						</Form.Group>
					</Card.Body>
				</Card>
				<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4" cellPadding={10}>
					<thead>
						<tr>
							<th colSpan={5} className="text-sm border-2 border-white bg-gray-50">
								Penulis Dosen
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama</th>
							<th className="text-sm border-2 border-white bg-gray-200">Urutan</th>
							<th className="text-sm border-2 border-white bg-gray-200">Affiliasi</th>
							<th className="text-sm border-2 border-white bg-gray-200">Peran</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.penulis_dosen.map((item, index) => (
							<tr key={`anggota-dosen-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="penulis_dosen.user_id"
										onChange={inputHandler}
										value={form.penulis_dosen[index].user_id}
										options={
											listDosen &&
											listDosen.map((dosen) => ({
												label: dosen.nama_lengkap,
												value: dosen.user_id,
											}))
										}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Input
										type="number"
										min="0"
										index={index}
										name="penulis_dosen.urutan"
										onChange={inputHandler}
										value={form.penulis_dosen[index].urutan}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Input
										type="text"
										index={index}
										name="penulis_dosen.afiliasi"
										onChange={inputHandler}
										value={form.penulis_dosen[index].afiliasi}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="penulis_dosen.peran"
										onChange={inputHandler}
										value={form.penulis_dosen[index].peran}
										options={[
											{ label: "Penulis", value: "Penulis" },
											{ label: "Editor", value: "Editor" },
											{ label: "Penerjemah", value: "Penerjemah" },
											{ label: "Penemu/Inventor", value: "Penemu/Inventor" },
										]}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1">
										{(index > 0 || user?.role != ROLE_ID_DOSEN) && (
											<Button.Icon
												type="button"
												variant="danger"
												icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
												onClick={() => removeFromUser("penulis_dosen", index, "Dosen")}
											/>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={5} className="text-sm border-2 border-white bg-gray-50">
								<Button
									type="button"
									variant="primary"
									className="mx-auto"
									onClick={() =>
										setForm((state) => ({
											...state,
											penulis_dosen: [...state.penulis_dosen, { ...INITIAL_ANGGOTA, role: "Dosen" }],
										}))
									}
								>
									Tambah Anggota
								</Button>
							</td>
						</tr>
					</tfoot>
				</table>
				<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4" cellPadding={10}>
					<thead>
						<tr>
							<th colSpan={5} className="text-sm border-2 border-white bg-gray-50">
								Penulis Mahasiswa
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama</th>
							<th className="text-sm border-2 border-white bg-gray-200">Urutan</th>
							<th className="text-sm border-2 border-white bg-gray-200">Affiliasi</th>
							<th className="text-sm border-2 border-white bg-gray-200">Peran</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.penulis_mahasiswa.map((item, index) => (
							<tr key={`anggota-dosen-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="penulis_mahasiswa.user_id"
										onChange={inputHandler}
										value={form.penulis_mahasiswa[index].user_id}
										options={
											listMahasiswa &&
											listMahasiswa.map((dosen) => ({
												label: dosen.nama_lengkap,
												value: dosen.user_id,
											}))
										}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Input
										type="number"
										min="0"
										index={index}
										name="penulis_mahasiswa.urutan"
										onChange={inputHandler}
										value={form.penulis_mahasiswa[index].urutan}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Input
										type="text"
										index={index}
										name="penulis_mahasiswa.afiliasi"
										onChange={inputHandler}
										value={form.penulis_mahasiswa[index].afiliasi}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="penulis_mahasiswa.peran"
										onChange={inputHandler}
										value={form.penulis_mahasiswa[index].peran}
										options={[
											{ label: "Penulis", value: "Penulis" },
											{ label: "Editor", value: "Editor" },
											{ label: "Penerjemah", value: "Penerjemah" },
											{ label: "Penemu/Inventor", value: "Penemu/Inventor" },
										]}
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1">
										{(index > 0 || user?.role != ROLE_ID_MAHASISWA) && (
											<Button.Icon
												type="button"
												variant="danger"
												icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
												onClick={() => removeFromUser("penulis_mahasiswa", index, "Mahasiswa")}
											/>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={6} className="text-sm border-2 border-white bg-gray-50">
								<Button
									type="button"
									variant="primary"
									className="mx-auto"
									onClick={() =>
										setForm((state) => ({
											...state,
											penulis_mahasiswa: [...state.penulis_mahasiswa, { ...INITIAL_ANGGOTA, role: "Mahasiswa" }],
										}))
									}
								>
									Tambah Anggota
								</Button>
							</td>
						</tr>
					</tfoot>
				</table>
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
