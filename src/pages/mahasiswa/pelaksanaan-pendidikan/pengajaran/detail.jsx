import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import BackButton from "../../../../components/BackButton";

export default function PengajaranDetail() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const router = useRouter();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} handler={setActive} leading={<BackButton />} />
			<div className="flex justify-center mt-4">
				<Button
					as="a"
					href={`${prefix + menu.url}/pengajaran/edit`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Pengajaran</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Mata Kuliah <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Verifikasi dan Validasi Perangkat Lunak"
								options={[
									{ label: "Akhlak", value: "Akhlak" },
									{ label: "Algoritma dan Pemrograman + Praktikum", value: "Algoritma dan Pemrograman + Praktikum" },
									{ label: "Aljabar Linear", value: "Aljabar Linear" },
									{ label: "Analisis Algoritma", value: "Analisis Algoritma" },
									{ label: "Arsitektur dan Organisasi Komputer", value: "Arsitektur dan Organisasi Komputer" },
									{ label: "Bahasa Indonesia", value: "Bahasa Indonesia" },
									{ label: "Bahasa Inggris + Praktikum", value: "Bahasa Inggris + Praktikum" },
									{ label: "Basis Data + Praktikum", value: "Basis Data + Praktikum" },
									{ label: "Fisika Dasar + Praktikum", value: "Fisika Dasar + Praktikum" },
									{ label: "ID (Islam Disiplin Ilmu)", value: "ID (Islam Disiplin Ilmu)" },
									{ label: "Inovasi Teknologi dan Kewirausahaan", value: "Inovasi Teknologi dan Kewirausahaan" },
									{ label: "Interaksi Manusia dan Komputer", value: "Interaksi Manusia dan Komputer" },
									{ label: "Internet of Things", value: "Internet of Things" },
									{ label: "Jaringan Komputer + Praktikum", value: "Jaringan Komputer + Praktikum" },
									{ label: "Kalkulus I", value: "Kalkulus I" },
									{ label: "Kalkulus II", value: "Kalkulus II" },
									{ label: "Kecerdasan Buatan", value: "Kecerdasan Buatan" },
									{ label: "Keamanan Informasi + Praktikum", value: "Keamanan Informasi + Praktikum" },
									{ label: "Komputer dan Masyarakat", value: "Komputer dan Masyarakat" },
									{ label: "Matematika Diskrit", value: "Matematika Diskrit" },
									{ label: "Metode Numerik + Praktikum", value: "Metode Numerik + Praktikum" },
									{
										label: "Pancasila dan Pendidikan Kewarganegaraan",
										value: "Pancasila dan Pendidikan Kewarganegaraan",
									},
									{ label: "Pemrograman Berorientasi Obyek + Prakt.", value: "Pemrograman Berorientasi Obyek + Prakt." },
									{ label: "Pengantar Teknologi Informasi", value: "Pengantar Teknologi Informasi" },
									{ label: "Pengolahan Paralel + Praktikum", value: "Pengolahan Paralel + Praktikum" },
									{
										label: "Perancangan dan Pemrograman Web + Prakt.",
										value: "Perancangan dan Pemrograman Web + Prakt.",
									},
									{ label: "Rekayasa Perangkat Lunak + Praktikum", value: "Rekayasa Perangkat Lunak + Praktikum" },
									{
										label: "Rekayasa Perangkat Lunak Lanjut + Praktikum",
										value: "Rekayasa Perangkat Lunak Lanjut + Praktikum",
									},
									{ label: "Sistem Informasi", value: "Sistem Informasi" },
									{ label: "Sistem Informasi Geografis + Praktikum", value: "Sistem Informasi Geografis + Praktikum" },
									{ label: "Sistem Operasi", value: "Sistem Operasi" },
									{ label: "Sistem Pakar", value: "Sistem Pakar" },
									{ label: "Statistika dan Probabilitas", value: "Statistika dan Probabilitas" },
									{ label: "Struktur Data", value: "Struktur Data" },
									{ label: "Syariah", value: "Syariah" },
									{ label: "Teori Bahasa dan Automata", value: "Teori Bahasa dan Automata" },
									{ label: "Verifikasi dan Validasi Perangkat Lunak", value: "Verifikasi dan Validasi Perangkat Lunak" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Mata Kuliah <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Wajib"
								options={[
									{ label: "Wajib", value: "Wajib" },
									{ label: "Peminatan", value: "Peminatan" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kelas <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								value="Reguler B"
								options={[
									{ label: "Reguler A", value: "Reguler A" },
									{ label: "Reguler B", value: "Reguler B" },
									{ label: "Reguler C", value: "Reguler C" },
									{ label: "Reguler D", value: "Reguler D" },
									{ label: "Reguler Karyawan", value: "Reguler Karyawan" },
								]}
								disabled
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jumlah Mahasiswa <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="number" min="0" className="flex-1" value="23" disabled />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								SKS <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="number" min="0" max="3" className="flex-1" value="2" disabled />
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Semester <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="number" min="1" max="16" className="flex-1" value="5" disabled />
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
