import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";

export default function PengujianCreate() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Pengujian Mahasiswa</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Judul Aktivitas Pembimbingan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Lokasi Kegiatan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nomor SK Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal SK Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Keterangan Aktivitas <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Bimbingan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								options={[
									{ label: "Kolokium", value: "Kolokium" },
									{ label: "Tugas Akhir", value: "Tugas Akhir" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Program Studi Mahasiswa <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								options={[
									{ label: "Teknik Informatika", value: "Teknik Informatika" },
									{ label: "Teknik Mesin", value: "Teknik Mesin" },
									{ label: "Teknik Elektro", value: "Teknik Elektro" },
									{ label: "Teknik Sipil", value: "Teknik Sipil" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Semester <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" />
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
						<tr>
							<td className="text-sm border-2 border-white bg-gray-50">FITRAH FAJAR SATRYA FAJAR KUSUMA</td>
							<td className="text-sm border-2 border-white bg-gray-50">
								<Form.Select
									className="flex-1"
									options={[
										{
											label: "Ketua Penguji",
											value: "Ketua Penguji",
										},
										{
											label: "Anggota Penguji",
											value: "Anggota Penguji",
										},
									]}
								/>
							</td>
							<td className="text-sm border-2 border-white bg-gray-50">
								<Form.Input type="number" min="0" />
							</td>

							<td className="text-sm border-2 border-white bg-gray-50">
								<div className="flex items-stretch gap-1">
									<Button.Icon
										variant="danger"
										icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
									/>
								</div>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={4} className="text-sm border-2 border-white bg-gray-50">
								<Button type="button" variant="primary" className="mx-auto">
									Tambah Dosen
								</Button>
							</td>
						</tr>
					</tfoot>
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
						<tr>
							<td className="text-sm border-2 border-white bg-gray-50">
								<Form.Select
									options={[
										{ label: "Alif Fajar Maulana", value: "Alif Fajar Maulana" },
										{ label: "Adam Kurniawan", value: "Adam Kurniawan" },
										{ label: "Muhammad Taman Mulya", value: "Muhammad Taman Mulya" },
									]}
								/>
							</td>
							<td className="text-sm border-2 border-white bg-gray-50">
								<Form.Select
									options={[
										{ label: "Individu/Mandiri", value: "Individu/Mandiri" },
										{ label: "Kelompok", value: "Kelompok" },
									]}
								/>
							</td>
							<td className="text-sm border-2 border-white bg-gray-50">
								<div className="flex items-stretch gap-1">
									<Button.Icon
										variant="danger"
										icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
									/>
								</div>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={3} className="text-sm border-2 border-white bg-gray-50">
								<Button type="button" variant="primary" className="mx-auto">
									Tambah Mahasiswa
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
