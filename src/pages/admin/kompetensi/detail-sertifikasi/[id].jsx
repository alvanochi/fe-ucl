import { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import useKategoriSertifikasi from "../../../../repo/kategori-sertifikasi";
import date from "../../../../utils/date";

export default function SertifikasiDetail() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kompetensi/detailCertif`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-sertifikasi`;

  const { formdata, show } = useCRUD(API_URL);
  const { form } = formdata;

  const { data: kategoriSertifikasi, isLoading: isLoadingKategoriSertifikasi } =
    useKategoriSertifikasi([user]);

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tgl_serti: date.formatToInput(data.tgl_serti),
      }),
    });
  }, [router, user]);

  if (
    [user, menu, form, isLoadingKategoriSertifikasi].some(
      (item) => item == null
    )
  )
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form>
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
                options={
                  kategoriSertifikasi &&
                  kategoriSertifikasi.map((item) => ({
                    label: item.nama_kategori,
                    value: item.id,
                  }))
                }
                disabled
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
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Bidang Studi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                value={form.bidang_studi}
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
                No. SK Sertifikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                value={form.nomor_sk}
                disabled
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
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Peserta <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                value={form.nomor_peserta}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Registrasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                value={form.nomor_regist}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                File <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <embed
                src={`${FILE_URL}/${form.file}`}
                className="w-full h-[256px]"
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
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
