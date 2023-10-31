import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import UploadDokumen from "../../../../modules/pelaksanaan-pengabdian/pembicara/upload-dokumen";
import useCRUD from "../../../../hooks/useCRUD";
import useKategoriPublikasi from "../../../../repo/kategori-publikasi";

export default function PembicaraCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/pengabdian/pembicara/addPembicara`;

  const INITIAL_FORM = {
    kategori_id: "",
    kategori_pembicara: "",
    judul_makalah: "",
    nama_pertemuan: "",
    penyelenggara: "",
    tingkat_pertemuan: "",
    tgl_pelaksanaan: "",
    bahasa: "",
    no_sk_penugasan: "",
    tgl_sk_penugasan: "",
    nama_dok: "",
    keterangan: "",
    tautan_dok: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "kategori_pembicara", label: "Kategori Pembicara" },
      { field: "judul_makalah", label: "Judul Makalah" },
      { field: "nama_pertemuan", label: "Nama Pertemuan" },
      { field: "penyelenggara", label: "Penyelenggara" },
      { field: "tingkat_pertemuan", label: "Tingkat Pertemuan" },
      { field: "tgl_pelaksanaan", label: "Tanggal Pelaksanaan" },
      { field: "bahasa", label: "Bahasa" },
      { field: "no_sk_penugasan", label: "No. SK Penugasan" },
      { field: "tgl_sk_penugasan", label: "Tanggal SK Penugasan" },
      { field: "nama_dok", label: "Nama Dokumen" },
      { field: "keterangan", label: "Keterangan Dokumen" },
      { field: "tautan_dok", label: "Tautan Dokumen" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { data: kategoriPublikasi, isLoading: isLoadingKategoriPublikasi } =
    useKategoriPublikasi([user]);
  const { form, inputHandler } = formdata;

  if ([user, menu, isLoadingKategoriPublikasi].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Pembicara</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Publikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                onChange={inputHandler}
                options={
                  kategoriPublikasi &&
                  kategoriPublikasi.map((item) => ({
                    label: `${item.nama_kategori} - ${item.tingkatan}`,
                    value: item.id,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Pembicara <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_pembicara"
                onChange={inputHandler}
                value={form.kategori_pembicara}
                options={[
                  {
                    label: "Pembicara pada pertemuan ilmiah",
                    value: "Pembicara pada pertemuan ilmiah",
                  },
                  { label: "Pembicara kunci", value: "Pembicara kunci" },
                  {
                    label:
                      "Pembicara/narasumber pada pelatihan/penyuluhan/ceramah",
                    value:
                      "Pembicara/narasumber pada pelatihan/penyuluhan/ceramah",
                  },
                ]}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Makalah <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_makalah"
                onChange={inputHandler}
                value={form.judul_makalah}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Pertemuan Ilmiah <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_pertemuan"
                onChange={inputHandler}
                value={form.nama_pertemuan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tingkat Pertemuan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tingkat_pertemuan"
                onChange={inputHandler}
                value={form.tingkat_pertemuan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Penyelenggara <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="penyelenggara"
                onChange={inputHandler}
                value={form.penyelenggara}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_pelaksanaan"
                onChange={inputHandler}
                value={form.tgl_pelaksanaan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Bahasa <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="bahasa"
                onChange={inputHandler}
                value={form.bahasa}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                No SK Pengugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_sk_penugasan"
                onChange={inputHandler}
                value={form.no_sk_penugasan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal Pengugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk_penugasan"
                onChange={inputHandler}
                value={form.tgl_sk_penugasan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <UploadDokumen form={form} inputHandler={inputHandler} />
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
