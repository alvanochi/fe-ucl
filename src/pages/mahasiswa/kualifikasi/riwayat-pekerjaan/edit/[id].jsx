import { useEffect } from "react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import date from "../../../../../utils/date";

export default function RiwayatPekerjaanEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kualifikasi/detailRiwayatPekerjaan`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-riwayatPekerjaan`;

  const INITIAL_FORM = {
    rwyt_pekerjaan_id: "",
    bidang_usaha: "",
    jenis_pekerjaan: "",
    jabatan: "",
    nama_instansi: "",
    divisi: "",
    deskripsi: "",
    mulai_kerja: "",
    selesai_kerja: "",
    area_kerja: "",
    pendapatan: "",
    file: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/kualifikasi/editRiwayatPekerjaan`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.rwyt_pekerjaan_id}`,
    method: "PATCH",
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;

    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        mulai_kerja: date.formatToInput(data.mulai_kerja),
        selesai_kerja: date.formatToInput(data.selesai_kerja),
      }),
    });
  }, [router, user]);

  if ([user, menu, form].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Riwayat Pekerjaan</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Bidang Usaha <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="bidang_usaha"
                onChange={inputHandler}
                value={form.bidang_usaha}
                options={[
                  {
                    value: "Pertanian, Kehutanan dan Perikanan",
                    label: "Pertanian, Kehutanan dan Perikanan",
                  },
                  {
                    value: "Pertambangan dan Penggalian",
                    label: "Pertambangan dan Penggalian",
                  },
                  {
                    value: "Industri Pengolahan",
                    label: "Industri Pengolahan",
                  },
                  {
                    value:
                      "Pengadaan Listrik, Gas, Uap/Air Panas Dan Udara Dingin",
                    label:
                      "Pengadaan Listrik, Gas, Uap/Air Panas Dan Udara Dingin",
                  },
                  {
                    value:
                      "Pengelolaan Air, Pengelolaan Air Limbah, Pengelolaan dan Daur Ulang Sampah, dan Aktivitas Remediasi",
                    label:
                      "Pengelolaan Air, Pengelolaan Air Limbah, Pengelolaan dan Daur Ulang Sampah, dan Aktivitas Remediasi",
                  },
                  { value: "Konstruksi", label: "Konstruksi" },
                  {
                    value:
                      "Perdagangan Besar Dan Eceran; Reparasi Dan Perawatan Mobil Dan Sepeda Motor",
                    label:
                      "Perdagangan Besar Dan Eceran; Reparasi Dan Perawatan Mobil Dan Sepeda Motor",
                  },
                  {
                    value: "Pengangkutan dan pergudangan",
                    label: "Pengangkutan dan pergudangan",
                  },
                  {
                    value: "Penyediaan Akomodasi Dan Penyediaan Makan Minum",
                    label: "Penyediaan Akomodasi Dan Penyediaan Makan Minum",
                  },
                  {
                    value: "Informasi Dan Komunikasi",
                    label: "Informasi Dan Komunikasi",
                  },
                  {
                    value: "Aktivitas Keuangan Dan Asuransi",
                    label: "Aktivitas Keuangan Dan Asuransi",
                  },
                  { value: "Real Estat", label: "Real Estat" },
                  {
                    value: "Aktivitas Profesional, Ilmiah Dan Teknis",
                    label: "Aktivitas Profesional, Ilmiah Dan Teknis",
                  },
                  {
                    value:
                      "Aktivitas Penyewaan dan Sewa Guna Usaha Tanpa Hak Opsi, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha Lainnya",
                    label:
                      "Aktivitas Penyewaan dan Sewa Guna Usaha Tanpa Hak Opsi, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha Lainnya",
                  },
                  {
                    value:
                      "Administrasi Pemerintahan, Pertahanan Dan Jaminan Sosial Wajib",
                    label:
                      "Administrasi Pemerintahan, Pertahanan Dan Jaminan Sosial Wajib",
                  },
                  { value: "Pendidikan", label: "Pendidikan" },
                  {
                    value: "Aktivitas Kesehatan Manusia Dan Aktivitas Sosial",
                    label: "Aktivitas Kesehatan Manusia Dan Aktivitas Sosial",
                  },
                  {
                    value: "Kesenian, Hiburan Dan Rekreasi",
                    label: "Kesenian, Hiburan Dan Rekreasi",
                  },
                  {
                    value: "Aktivitas Jasa Lainnya",
                    label: "Aktivitas Jasa Lainnya",
                  },
                  {
                    value:
                      "Aktivitas Rumah Tangga Sebagai Pemberi Kerja; Aktivitas Yang Menghasilkan Barang Dan Jasa Oleh Rumah Tangga yang Digunakan untuk Memenuhi Kebutuhan Sendiri",
                    label:
                      "Aktivitas Rumah Tangga Sebagai Pemberi Kerja; Aktivitas Yang Menghasilkan Barang Dan Jasa Oleh Rumah Tangga yang Digunakan untuk Memenuhi Kebutuhan Sendiri",
                  },
                  {
                    value:
                      "Aktivitas Badan Internasional Dan Badan Ekstra Internasional Lainnya",
                    label:
                      "Aktivitas Badan Internasional Dan Badan Ekstra Internasional Lainnya",
                  },
                ]}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Pekerjaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenis_pekerjaan"
                onChange={inputHandler}
                value={form.jenis_pekerjaan}
                options={[
                  { label: "Peneliti", value: "Peneliti" },
                  {
                    label: "Tim Ahli / Konsultan",
                    value: "Tim Ahli / Konsultan",
                  },
                  { label: "Magang", value: "Magang" },
                  {
                    label: "Tenaga Pengajar / Instruktur / Fasiltator",
                    value: "Tenaga Pengajar / Instruktur / Fasiltator",
                  },
                  {
                    label: "Pimpinan / Manajerial",
                    value: "Pimpinan / Manajerial",
                  },
                ]}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jabatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="jabatan"
                onChange={inputHandler}
                value={form.jabatan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Instansi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_instansi"
                onChange={inputHandler}
                value={form.nama_instansi}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Divisi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="divisi"
                onChange={inputHandler}
                value={form.divisi}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Deskripsi Kerja <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="deskripsi"
                onChange={inputHandler}
                value={form.deskripsi}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Mulai Bekerja <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="mulai_kerja"
                onChange={inputHandler}
                value={form.mulai_kerja}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Selesai Bekerja <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="selesai_kerja"
                onChange={inputHandler}
                value={form.selesai_kerja}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Area Pekerjaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Group className="flex w-full items-center gap-4">
                <Form.Label>
                  <Form.Radio
                    name="area_kerja"
                    onChange={inputHandler}
                    value="Dalam Negri"
                    checked={form.area_kerja == "Dalam Negri"}
                  />
                  Dalam Negeri
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="area_kerja"
                    onChange={inputHandler}
                    value="Luar Negri"
                    checked={form.area_kerja == "Luar Negri"}
                  />
                  Luar Negeri
                </Form.Label>
              </Form.Group>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pendapatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="pendapatan"
                onChange={inputHandler}
                value={form.pendapatan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Unggah File <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="file_rwyt_pekerjaan"
                  onChange={inputHandler}
                />
                <embed
                  src={`${FILE_URL}/${form.file}`}
                  className="w-full h-[256px]"
                />
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
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
