import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";

export default function KepangkatanCreate() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/profile/addKepangkatan`;
	const INITIAL_FORM = {
		gol_pangkat: "",
		nomor_sk: "",
		tgl_sk: "",
		tgl_mulai: "",
		masa_kerja_bulan: "",
		masa_kerja_tahun: "",
	};

	const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
			{ field: "gol_pangkat", label: "Golongan Pangkat" },
			{ field: "no_sk", label: "No. SK" },
			{ field: "tgl_sk", label: "Tanggal SK" },
			{ field: "tgl_mulai", label: "Terhitung Mulai Tanggal" },
			{ field: "masa_kerja_bulan", label: "Masa Kerja (Bulan)" },
			{ field: "masa_kerja_tahun", label: "Masa Kerja (Tahun)" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Tambah Kepangkatan`} icon={menu.icon} handler={setActive} />
			<Form onSubmit={submitHandler} type="formdata">
				<Card className="mt-4">
					<Card.Header className="text-center">Kepangkatan</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Pangkat <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Select
								className="flex-1"
								name="gol_pangkat"
								onChange={inputHandler}
								value={form.gol_pangkat}
								required
								options={[
									{ label: "I/a - Juru", value: "I/a - Juru" },
									{ label: "I/b - Juru Tingkat I", value: "I/b - Juru Tingkat I" },
									{ label: "I/c - Pengatur", value: "I/c - Pengatur" },
									{ label: "II/a - Pengatur Tingkat I", value: "II/a - Pengatur Tingkat I" },
									{ label: "II/b - Penata Muda", value: "II/b - Penata Muda" },
									{ label: "II/c - Penata Muda Tingkat I", value: "II/c - Penata Muda Tingkat I" },
									{ label: "III/a - Penata", value: "III/a - Penata" },
									{ label: "III/b - Penata Tingkat I", value: "III/b - Penata Tingkat I" },
									{ label: "IV/a - Pembina Utama Muda", value: "IV/a - Pembina Utama Muda" },
									{ label: "IV/b - Pembina Utama Madya", value: "IV/b - Pembina Utama Madya" },
									{ label: "IV/c - Pembina Utama", value: "IV/c - Pembina Utama" },
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
								Tanggal SK <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" name="tgl_sk" onChange={inputHandler} value={form.tgl_sk} required />
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
								Masa Kerja Golongan (Tahun) <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								min="0"
								className="flex-1"
								name="masa_kerja_tahun"
								onChange={inputHandler}
								value={form.masa_kerja_tahun}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Masa Kerja Golongan (Bulan) <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								min="0"
								className="flex-1"
								name="masa_kerja_bulan"
								onChange={inputHandler}
								value={form.masa_kerja_bulan}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Unggah File <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="file" className="flex-1" name="file_kepangkatan" onChange={inputHandler} />
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
