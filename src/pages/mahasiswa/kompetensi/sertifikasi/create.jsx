import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useCRUD from "../../../../hooks/useCRUD";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useKategoriSertifikasi from "../../../../repo/kategori-sertifikasi";

export default function SertifikasiCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kompetensi/addCertificate`;
  const INITIAL_FORM = {
    jenis_serti: "",
    nama_serti: "",
    bidang_studi: "",
    nomor_sk: "",
    tgl_serti: "",
    kategori_id: "",
    nomor_peserta: "",
    nomor_regist: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "kategori_id", label: "Kategori Sertifikasi" },
      { field: "jenis_serti", label: "Jenis Sertifikasi" },
      { field: "nama_serti", label: "Nama Sertifikasi" },
      { field: "bidang_studi", label: "Bidang Studi" },
      { field: "nomor_sk", label: "Nomor SK" },
      { field: "tgl_serti", label: "Tanggal Sertifikasi" },
      { field: "nomor_peserta", label: "Nomor Peserta" },
      { field: "nomor_regist", label: "Nomor Registrasi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const { data: kategoriSertifikasi, isLoading: isLoadingKategoriSertifikasi } =
    useKategoriSertifikasi([user]);

  if ([user, menu, isLoadingKategoriSertifikasi].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Sertifikasi</Card.Header>
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
                onChange={inputHandler}
                options={
                  kategoriSertifikasi &&
                  kategoriSertifikasi.map((item) => ({
                    label: item.nama_kategori,
                    value: item.id,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Sertifikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenis_serti"
                value={form.jenis_serti}
                onChange={inputHandler}
                options={[
                  { label: "Sertifikasi Dosen", value: "Sertifikasi Dosen" },
                  {
                    label: "Sertifikai Keahlian",
                    value: "Sertifikai Keahlian",
                  },
                  {
                    label: "Sertifikasi Kegiatan",
                    value: "Sertifikasi Kegiatan",
                  },
                ]}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Bidang Studi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="bidang_studi"
                value={form.bidang_studi}
                onChange={inputHandler}
                options={[
                  {
                    label: "Software Engineering",
                    value: "Software Engineering",
                  },
                  {
                    label: "Computer System and Network",
                    value: "Computer System and Network",
                  },
                  {
                    label: "Geospatial Information Technology",
                    value: "Geospatial Information Technology",
                  },
                  {
                    label:
                      "Knowledge Engineering and Reliable Intelligent System",
                    value:
                      "Knowledge Engineering and Reliable Intelligent System",
                  },
                  { label: "Lainya...", value: "Lainya..." },
                ]}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Sertifikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_serti"
                value={form.nama_serti}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                No. SK Sertifikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nomor_sk"
                value={form.nomor_sk}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal Sertifikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_serti"
                value={form.tgl_serti}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Peserta <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="nomor_peserta"
                value={form.nomor_peserta}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Registrasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="nomor_regist"
                value={form.nomor_regist}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Unggah File <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="file_serti"
                onChange={inputHandler}
              />
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
