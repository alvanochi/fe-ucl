import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../../utils/date";
import { Icon } from "@iconify-icon/react";

export default function DetailMhs() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/users/detail-user`;

	const INITIAL_FORM = {
		nama_lengkap: "",
		npm: "",
		email: "",
		jenkel: "",
		tanggal_lahir: "",
		tempat_lahir: "",
		ibu_kandung: "",
		nik: "",
    agama: "",
    warga_negara: "",
    alamat: "",
    rt: "",
    rw: "",
    desa_kelurahan: "",
    kota_kabupaten: "",
    provinsi: "",
    no_hp: "",
    status_kawin: 0,
    nama_pasangan: "",
    nip_pasangan: "",
    point_kompetensi: "",
    point_pengabdian: "",
    point_pendidikan: "",
    point_penelitian: "",
    point_penunjang: "",
    point_rekomendasi: "",
    total_point: ""
	};

	const { formdata, show } = useCRUD(API_URL, INITIAL_FORM, {
		rules: [
      { field: "nik", label: "NIK" },
      { field: "npm", label: "NPM" },
			{ field: "jenkel", label: "Jenis Kelamin" },
			{ field: "nama_lengkap", label: "Nama Lengkap" },
			{ field: "tempat_lahir", label: "Tempat Lahir" },
			{ field: "tanggal_lahir", label: "Tanggal Lahir" },
			{ field: "ibu_kandung", label: "Nama Ibu Kandung" },
      { field: "agama", label: "Agama" },
			{ field: "warga_negara", label: "Kewarganegaraan" },
      { field: "nama_pasangan", label: "Nama Suami/Istri" },
			{ field: "nip_pasangan", label: "NIP Suami/Istri" },
			{ field: "pekerjaan_pasangan", label: "Pekerjaan Suami/Istri" },
			{ field: "tanggal_pns_pasangan", label: "Terhitung Mulai Tanggal PNS Suami/Istri " },
      { field: "email", label: "Email" },
      { field: "alamat", label: "Alamat" },
      { field: "rt", label: "Rt" },
      { field: "rw", label: "Rw" },
      { field: "desa_kelurahan", label: "Desa/Kelurahan" },
      { field: "kota_kabupaten", label: "Kota/Kabupaten" },
      { field: "provinsi", label: "Provinsi" },
      { field: "kode_pos", label: "Kode POS" },
      { field: "no_hp", label: "No. HP" },
      { field: "point_kompetensi", label: "Point Kompetensi" },
      { field: "point_pengabdian", label: "Point Pengabdian" },
      { field: "point_pendidikan", label: "Point Pendidikan" },
      { field: "point_penelitian", label: "Point Penelitian" },
      { field: "point_penunjang", label: "Point Penunjang" },
      { field: "point_rekomendasi", label: "Point Rekomendasi" },
      { field: "total_point", label: "Total Point" },
		],
		success: () => router.push(prefix + menu.url),
	});

	const { form, inputHandler } = formdata;

	useEffect(() => {
		if (router.isReady === false || !user) return;
		show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tanggal_lahir: data.tanggal_lahir ? date.formatToInput(data.tanggal_lahir) : "",
      }),
    });
	}, [router, user]);

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Detail ${menu.label}`} icon={menu.icon} handler={setActive} />
			<div className="flex justify-center mt-4">
				<Button
					as="a"
					href={`${prefix + menu.url}/kepangkatan/edit/${form.pangkat_id}`}
					variant="secondary"
					icon={<Icon icon="bx:edit" width={20} height={20} />}
					pill
				>
					Edit
				</Button>
			</div>
			<Form>
				<Card className="mt-4">
					<Card.Header className="text-center">Detail Mahasiswa</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Lengkap<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_lengkap"
								onChange={inputHandler}
								value={form.nama_lengkap}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								NPM<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="npm"
								onChange={inputHandler}
								value={form.npm}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								email<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="email"
								className="flex-1"
								name="email"
								onChange={inputHandler}
								value={form.email}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Jenis Kelamin <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="flex gap-4">
								<Form.Label>
									<Form.Radio name="jenkel" value="L" onChange={inputHandler} checked={form.jenkel == "L"} />
									Laki-Laki
								</Form.Label>
								<Form.Label>
									<Form.Radio name="jenkel" value="P" onChange={inputHandler} checked={form.jenkel == "P"} />
									Perempuan
								</Form.Label>
							</div>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tanggal Lahir <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input type="date" className="flex-1" name="tanggal_lahir" onChange={inputHandler} value={form.tanggal_lahir} disabled />
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Tempat Lahir<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="tempat_lahir"
								onChange={inputHandler}
								value={form.tempat_lahir}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Ibu Kandung<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="ibu_kandung"
								onChange={inputHandler}
								value={form.ibu_kandung}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								NIK<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="nik"
								onChange={inputHandler}
								value={form.nik}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Agama<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="agama"
								onChange={inputHandler}
								value={form.agama}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Warga Negara<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="warga_negara"
								onChange={inputHandler}
								value={form.warga_negara}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Alamat <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                rows="2"
                name="alamat"
                onChange={inputHandler}
                value={form.alamat}
                disabled
              ></Form.Textarea>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								RT<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="rt"
								onChange={inputHandler}
								value={form.rt}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								RW<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="rw"
								onChange={inputHandler}
								value={form.rw}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Desa/Kelurahan<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="desa_kelurahan"
								onChange={inputHandler}
								value={form.desa_kelurahan}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kota/Kabupaten<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="kota_kabupaten"
								onChange={inputHandler}
								value={form.kota_kabupaten}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Provinsi<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="provinsi"
								onChange={inputHandler}
								value={form.provinsi}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								No. Telp<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="number"
								className="flex-1"
								name="no_hp"
								onChange={inputHandler}
								value={form.no_hp}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Status Perkawinan</Form.Label>
            <span>:</span>
              {form.status_kawin == 1 ? (
                <p>Sudah Menikah</p>
              ) : (
                <p>Belum Menikah</p>
              )}
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Nama Pasangan<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="text"
								className="flex-1"
								name="nama_pasangan"
								onChange={inputHandler}
								value={form.nama_pasangan}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								NIP Pasangan<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="nip_pasangan"
								onChange={inputHandler}
								value={form.nip_pasangan}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Kompetensi<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_kompetensi"
								onChange={inputHandler}
								value={form.point_kompetensi}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Pengabdian<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_pengabdian"
								onChange={inputHandler}
								value={form.point_pengabdian}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Pendidikan<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_pendidikan"
								onChange={inputHandler}
								value={form.point_pendidikan}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Penelitian<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_penelitian"
								onChange={inputHandler}
								value={form.point_penelitian}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Penunjang<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_penunjang"
								onChange={inputHandler}
								value={form.point_penunjang}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Point Rekomendasi<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="point_rekomendasi"
								onChange={inputHandler}
								value={form.point_rekomendasi}
								disabled
							/>
						</Form.Group>
            <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Total Point<span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="Number"
								className="flex-1"
								name="total_point"
								onChange={inputHandler}
								value={form.total_point}
								disabled
							/>
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
