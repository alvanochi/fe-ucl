import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import UploadDokumen from "../../../../modules/pelaksanaan-pendidikan/tugas-tambahan/upload-dokumen";

export default function TugasTambahanEdit() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Tugas Tambahan</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Tugas Tambahan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Ketua Jurusan"
								options={[
									{ label: "Rektor", value: "Rektor" },
									{ label: "Wakil Rektor I", value: "Wakil Rektor I" },
									{ label: "Wakil Rektor II", value: "Wakil Rektor II" },
									{ label: "Wakil Rektor III", value: "Wakil Rektor III" },
									{ label: "Wakil Rektor IV", value: "Wakil Rektor IV" },
									{ label: "Sekretaris PT", value: "Sekretaris PT" },
									{ label: "Kaprodi", value: "Kaprodi" },
									{ label: "Sekretaris Prodi", value: "Sekretaris Prodi" },
									{ label: "Dekan", value: "Dekan" },
									{ label: "Wakil Dekan I", value: "Wakil Dekan I" },
									{ label: "Wakil Dekan II", value: "Wakil Dekan II" },
									{ label: "Wakil Dekan III", value: "Wakil Dekan III" },
									{ label: "Ketua Jurusan", value: "Ketua Jurusan" },
									{ label: "Wakil Ketua Jurusan", value: "Wakil Ketua Jurusan" },
									{ label: "Pembantu Direktur I", value: "Pembantu Direktur I" },
									{ label: "Pembantu Direktur II", value: "Pembantu Direktur II" },
									{ label: "Pembantu Direktur III", value: "Pembantu Direktur III" },
									{ label: "Pembantu Direktur IV", value: "Pembantu Direktur IV" },
									{ label: "Wakil Rektor V", value: "Wakil Rektor V" },
									{ label: "Wakil Dekan IV", value: "Wakil Dekan IV" },
									{ label: "Wakil Ketua I", value: "Wakil Ketua I" },
									{ label: "Wakil Ketua II", value: "Wakil Ketua II" },
									{ label: "Wakil Ketua III", value: "Wakil Ketua III" },
									{ label: "Kepala LLDIKTI", value: "Kepala LLDIKTI" },
									{ label: "Direktur Politeknik", value: "Direktur Politeknik" },
									{ label: "Direktur Pascasarjana", value: "Direktur Pascasarjana" },
									{ label: "Ketua Senat Universitas", value: "Ketua Senat Universitas" },
									{ label: "Ketua Sekolah Tinggi", value: "Ketua Sekolah Tinggi" },
									{ label: "Ketua Lembaga", value: "Ketua Lembaga" },
									{ label: "Wakil Direktur Pascasarjana", value: "Wakil Direktur Pascasarjana" },
									{ label: "Ketua Senat Fakultas", value: "Ketua Senat Fakultas" },
									{ label: "Wakil Ketua Sekolah Tinggi", value: "Wakil Ketua Sekolah Tinggi" },
									{ label: "Wakil Direktur Politeknik", value: "Wakil Direktur Politeknik" },
									{ label: "Direktur Akademi", value: "Direktur Akademi" },
									{ label: "Wakil Direktur Akademi", value: "Wakil Direktur Akademi" },
									{ label: "Sekretaris Lembaga", value: "Sekretaris Lembaga" },
									{ label: "Ketua Departemen", value: "Ketua Departemen" },
									{ label: "Ketua Bagian", value: "Ketua Bagian" },
									{ label: "Kepala Laboratorium", value: "Kepala Laboratorium" },
									{ label: "Sekretaris Bagian", value: "Sekretaris Bagian" },
									{ label: "Sekretaris Departemen", value: "Sekretaris Departemen" },
									{ label: "Kepala UPT", value: "Kepala UPT" },
									{ label: "Kepala Unit Kerja", value: "Kepala Unit Kerja" },
									{ label: "Ketua Badan", value: "Ketua Badan" },
									{ label: "Wakil Ketua Badan", value: "Wakil Ketua Badan" },
									{ label: "Sekretaris Badan", value: "Sekretaris Badan" },
									{ label: "Lainnya", value: "Lainnya" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Perguruan Tinggi Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Universitas Indonesia"
								options={[
									{ label: "Universitas Ibn Khaldun Bogor", value: "Universitas Ibn Khaldun Bogor" },
									{ label: "Universitas Indonesia", value: "Universitas Indonesia" },
									{ label: "Institut Teknologi Bandung", value: "Institut Teknologi Bandung" },
									{ label: "Universitas Gadjah Mada", value: "Universitas Gadjah Mada" },
									{ label: "Institut Pertanian Bogor", value: "Institut Pertanian Bogor" },
									{ label: "Universitas Airlangga", value: "Universitas Airlangga" },
									{ label: "Universitas Diponegoro", value: "Universitas Diponegoro" },
								]}
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Unit Kerja <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Teknik Informatika"
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
								Jumlah Jam Diakui <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="number" min="1" className="flex-1" value="8" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nomor SK Penugasan <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="text" className="flex-1" value="194/KEP/UIKA/2020" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Terhitung Mulai Tanggal <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" value="2020-11-28" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Berakhir Tugas <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" value="2024-11-28" />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Dokumen <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<UploadDokumen />
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
