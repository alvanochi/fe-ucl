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
import useDosen from "../../../../../repo/dosen";
import useMahasiswa from "../../../../../repo/mahasiswa";
import { useEffect } from "react";
import date from "../../../../../utils/date";
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from "../../../../../config/role";

export default function PenghargaanDetail() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/pendidikan/bimbingan/detail`;

	const INITIAL_ANGGOTA_DOSEN = {
		user_id: "",
		kategori_kegiatan: "",
		urutan_promotor: "",
	};

	const INITIAL_ANGGOTA_MAHSISWA = {
		user_id: "",
		peran: "",
	};

	const INITIAL_FORM = {
		bimbingan_id: "",
		judul_bimbingan: "",
		jenis_bimbingan: "",
		program_studi: "",
		no_sk_penugasan: "",
		tgl_sk_penugasan: "",
		lokasi_kegiatan: "",
		semester: "",
		dosen_pembimbing: [],
		mhs_bimbingan: [],
	};

	const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		transformData: (data) => ({
			...data,
			dosen_pembimbing: JSON.stringify(data.dosen_pembimbing),
			mhs_bimbingan: JSON.stringify(data.mhs_bimbingan),
		}),
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler, setForm } = formdata;

	const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
	const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user]);

	const EDIT_URL = `${process.env.API_ENDPOINT}/pendidikan/bimbingan/edit`;
	const EDIT_OPTION = { url: `${EDIT_URL}/${form.bimbingan_id}`, method: "PATCH" };

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
				...data.dataBimbingan[0],
				tgl_sk_penugasan: date.formatToInput(data.dataBimbingan[0].tgl_sk_penugasan),
				dosen_pembimbing: data.dosenPembimbing,
				mhs_bimbingan: data.mhsBimbingan,
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
					href={`${prefix + menu.url}/bimbingan/edit/${form.bimbingan_id}`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Bimbingan Mahasiswa</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Judul Aktivitas Pembimbingan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="judul_bimbingan"
								value={form.judul_bimbingan}
								onChange={inputHandler}
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
								value={form.lokasi_kegiatan}
								onChange={inputHandler}
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
								value={form.no_sk_penugasan}
								onChange={inputHandler}
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
								value={form.tgl_sk_penugasan}
								onChange={inputHandler}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Bimbingan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="jenis_bimbingan"
								value={form.jenis_bimbingan}
								onChange={inputHandler}
								options={[
									{ label: "KP/PKL", value: "KP/PKL" },
									{ label: "KKN", value: "KKN" },
									{ label: "Skripsi", value: "Skripsi" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Program Studi Mahasiswa <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="program_studi"
								value={form.program_studi}
								onChange={inputHandler}
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
								Semester <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="semester"
								value={form.semester}
								onChange={inputHandler}
								disabled
							/>
						</Form.Group>
					</Card.Body>
				</Card>
				<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4" cellPadding={10}>
					<thead>
						<tr>
							<th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
								Dosen Pembimbing
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama Dosen</th>
							<th className="text-sm border-2 border-white bg-gray-200">Kategori Kegiatan</th>
							<th className="text-sm border-2 border-white bg-gray-200">Urutan</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.dosen_pembimbing.map((item, index) => (
							<tr key={`dosen-pembimbing-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="dosen_pembimbing.user_id"
										onChange={inputHandler}
										value={form.dosen_pembimbing[index].user_id}
										options={
											listDosen &&
											listDosen.map((dosen) => ({
												label: dosen.nama_lengkap,
												value: dosen.user_id,
											}))
										}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										className="flex-1"
										name="dosen_pembimbing.kategori_kegiatan"
										onChange={inputHandler}
										value={form.dosen_pembimbing[index].kategori_kegiatan}
										options={[
											{
												label: "Skripsi (pembimbing utama)",
												value: "Skripsi (pembimbing utama)",
											},
											{
												label: "Skripsi (pembimbing pendamping)",
												value: "Skripsi (pembimbing pendamping)",
											},
											{
												label: "Anggota penguji",
												value: "Anggota penguji",
											},
										]}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Input
										index={index}
										type="number"
										min="0"
										name="dosen_pembimbing.urutan_promotor"
										onChange={inputHandler}
										value={form.dosen_pembimbing[index].urutan_promotor}
										disabled
									/>
								</td>

								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1"></div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4" cellPadding={10}>
					<thead>
						<tr>
							<th colSpan={3} className="text-sm border-2 border-white bg-gray-50">
								Mahasiswa Yang Dibimbing
							</th>
						</tr>
						<tr>
							<th className="text-sm border-2 border-white bg-gray-200">Nama</th>
							<th className="text-sm border-2 border-white bg-gray-200">Peran</th>
							<th className="text-sm border-2 border-white bg-gray-200"></th>
						</tr>
					</thead>
					<tbody>
						{form.mhs_bimbingan.map((item, index) => (
							<tr key={`dosen-pembimbing-${index}`}>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="mhs_bimbingan.user_id"
										onChange={inputHandler}
										value={form.mhs_bimbingan[index].user_id}
										options={
											listMahasiswa &&
											listMahasiswa.map((dosen) => ({
												label: dosen.nama_lengkap,
												value: dosen.user_id,
											}))
										}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<Form.Select
										index={index}
										name="mhs_bimbingan.peran"
										onChange={inputHandler}
										value={form.mhs_bimbingan[index].peran}
										options={[
											{ label: "Individu/Mandiri", value: "Individu/Mandiri" },
											{ label: "Kelompok", value: "Kelompok" },
										]}
										disabled
									/>
								</td>
								<td className="text-sm border-2 border-white bg-gray-50">
									<div className="flex items-stretch gap-1"></div>
								</td>
							</tr>
						))}
					</tbody>
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
