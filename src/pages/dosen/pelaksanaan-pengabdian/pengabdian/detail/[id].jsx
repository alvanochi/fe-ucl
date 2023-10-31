import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import KolabolatorEksternal from "../../../../../modules/pelaksanaan-pengabdian/pengabdian/kolaborator-eksternal";
import UploadDokumen from "../../../../../modules/pelaksanaan-pengabdian/pengabdian/upload-dokumen";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import _ from "underscore";
import useDosen from "../../../../../repo/dosen";
import useMahasiswa from "../../../../../repo/mahasiswa";
import { useEffect } from "react";
import date from "../../../../../utils/date";
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from "../../../../../config/role";
import Accordion from "../../../../../components/Accordion";

export default function PengabdianDetail() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/pengabdian/detailPengabdian`;
	const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-pengabdian`;

	const INITIAL_ANGGOTA = {
		user_id: "",
		peran: "",
		status: "",
		role: "",
	};

	const INITIAL_FORM = {
		pengabdian_id: "",
		judul_kegiatan: "",
		kelompok_bidang: "",
		lokasi_kegiatan: "",
		lama_kegiatan: "",
		no_sk_penugasan: "",
		tgl_sk_penugasan: "",
		nama_dok: "",
		keterangan: "",
		tautan_dok: "",
		anggota_pengabdian_dosen: [],
		anggota_pengabdian_mahasiswa: [],
		docs: [],
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "judul_kegiatan", label: "Judul Kegiatan" },
			{ field: "kelompok_bidang", label: "Kelompok Bidang" },
			{ field: "lokasi_kegiatan", label: "Lokasi Kegiatan" },
			{ field: "lama_kegiatan", label: "Lama Kegiatan" },
			{ field: "no_sk_penugasan", label: "No. SK Penugasan" },
			{ field: "tgl_sk_penugasan", label: "Tanggal SK Penugasan" },
			{ field: "nama_dok", label: "Nama Dokumen" },
			{ field: "keterangan", label: "Keterangan Dokumen" },
			{ field: "tautan_dok", label: "Tautan Dokumen" },
		],
		transformData: (data) =>
			_.omit(
				{
					...data,
					anggota_pengabdian: JSON.stringify([
						...data.anggota_pengabdian_dosen.map((item) => _.omit(item, ["role"])),
						...data.anggota_pengabdian_mahasiswa.map((item) => _.omit(item, ["role"])),
					]),
				},
				["anggota_pengabdian_dosen", "anggota_pengabdian_mahasiswa"]
			),
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler, setForm } = formdata;

	const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
	const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user]);

	const findInUser = (lists, id) => lists.find((item) => item.user_id == id) ?? null;

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
			transformData: (data) => ({
				...INITIAL_FORM,
				...data.dataPengabdian[0],
				tgl_sk_penugasan: date.formatToInput(data.dataPengabdian[0].tgl_sk_penugasan),
				anggota_pengabdian_dosen: data.anggotaPengabdian.filter((item) => item.role == ROLE_ID_DOSEN),
				anggota_pengabdian_mahasiswa: data.anggotaPengabdian.filter((item) => item.role == ROLE_ID_MAHASISWA),
				docs: data.dataDokumen,
			}),
		});
	}, [router, user]);

	if ([user, menu, isDosenLoading, isMahasiswaLoading].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<div className="flex justify-center mt-4">
				<Button
					as="a"
					href={`${prefix + menu.url}/pengabdian/edit/${form.pengabdian_id}`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Pengabdian</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Judul Pengabdian <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="judul_kegiatan"
								onChange={inputHandler}
								value={form.judul_kegiatan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kelompok Bidang <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="kelompok_bidang"
								onChange={inputHandler}
								value={form.kelompok_bidang}
								options={[
									{ label: "Teknik Informatika", value: "Teknik Informatika" },
									{ label: "Teknik Mesin", value: "Teknik Mesin" },
									{ label: "Teknik Elektro", value: "Teknik Elektro" },
									{ label: "Teknik Sipil", value: "Teknik Sipil" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Lokasi Kegiatan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="lokasi_kegiatan"
								onChange={inputHandler}
								value={form.lokasi_kegiatan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Lama Kegiatan (Tahun) <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="lama_kegiatan"
								onChange={inputHandler}
								value={form.lama_kegiatan}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nomor SK Penugasan <span className="text-danger-600">*</span>
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
								Tanggal SK Penugasan <span className="text-danger-600">*</span>
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
							<div className="flex-1 block">
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
							<th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
								Anggota Dosen
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama</th>
							<th className="text-sm border-2 border-white bg-gray-200">Peran</th>
							<th className="text-sm border-2 border-white bg-gray-200">Status</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.anggota_pengabdian_dosen.map((item, index) => (
							<tr key={`anggota-dosen-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									{user?.user_id == item.user_id && listDosen && findInUser(listDosen, item.user_id)?.nama_lengkap}
									{user?.user_id != item.user_id && (
										<Form.Select
											index={index}
											name="anggota_pengabdian_dosen.user_id"
											onChange={inputHandler}
											value={form.anggota_pengabdian_dosen[index].user_id}
											options={
												listDosen &&
												listDosen.map((dosen) => ({
													label: dosen.nama_lengkap,
													value: dosen.user_id,
												}))
											}
											disabled
										/>
									)}
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="anggota_pengabdian_dosen.peran"
										onChange={inputHandler}
										value={form.anggota_pengabdian_dosen[index].peran}
										options={[
											{ label: "Ketua", value: "ketua" },
											{ label: "Anggota", value: "anggota" },
										]}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Label>
										<Form.Checkbox
											index={index}
											name="anggota_pengabdian_dosen.status"
											onChange={inputHandler}
											checked={form.anggota_pengabdian_dosen[index].status}
											disabled
										/>{" "}
										Aktif
									</Form.Label>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1"></div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={4} className="text-sm border-2 border-white bg-gray-50"></td>
						</tr>
					</tfoot>
				</table>
				<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4" cellPadding={10}>
					<thead>
						<tr>
							<th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
								Anggota Mahasiswa
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama</th>
							<th className="text-sm border-2 border-white bg-gray-200">Peran</th>
							<th className="text-sm border-2 border-white bg-gray-200">Status</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.anggota_pengabdian_mahasiswa.map((item, index) => (
							<tr key={`anggota-dosen-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									{user?.user_id == item.user_id &&
										listMahasiswa &&
										findInUser(listMahasiswa, item.user_id)?.nama_lengkap}
									{user?.user_id != item.user_id && (
										<Form.Select
											index={index}
											name="anggota_pengabdian_mahasiswa.user_id"
											onChange={inputHandler}
											value={form.anggota_pengabdian_mahasiswa[index].user_id}
											options={
												listMahasiswa &&
												listMahasiswa.map((dosen) => ({
													label: dosen.nama_lengkap,
													value: dosen.user_id,
												}))
											}
											disabled
										/>
									)}
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="anggota_pengabdian_mahasiswa.peran"
										onChange={inputHandler}
										value={form.anggota_pengabdian_mahasiswa[index].peran}
										options={[
											{ label: "Ketua", value: "ketua" },
											{ label: "Anggota", value: "anggota" },
										]}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Label>
										<Form.Checkbox
											index={index}
											name="anggota_pengabdian_mahasiswa.status"
											onChange={inputHandler}
											checked={form.anggota_pengabdian_mahasiswa[index].status}
											disabled
										/>{" "}
										Aktif
									</Form.Label>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1"></div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={4} className="text-sm border-2 border-white bg-gray-50"></td>
						</tr>
					</tfoot>
				</table>
				<div className="flex gap-4 mt-4">
					<Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
						Kembali
					</Button>
				</div>
			</Form>
		</Layout>
	);
}
