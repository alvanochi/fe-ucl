import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import BackButton from "../../../../../components/BackButton";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../../../utils/date";
import useKategoriSertifikasi from "../../../../../repo/kategori-sertifikasi";

export default function TesDetail() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kompetensi/detailTes`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-tes`;

  const INITIAL_FORM = {
    tes_id: "",
    nama_tes: "",
    jenis_tes: "",
    penyelenggara: "",
    tgl_tes: "",
    skor_tes: "",
    file: "",
    kategori_id: "",
  };

  const { formdata, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_tes", label: "Nama Tes" },
      { field: "jenis_tes", label: "Jenis Tes" },
      { field: "penyelenggara", label: "Penyelenggara" },
      { field: "tgl_tes", label: "Tanggal Tes" },
      { field: "skor_tes", label: "Skor Tes" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form } = formdata;

  const { data: kategoriSertifikasi, isLoading: isLoadingKategoriSertifikasi } =
    useKategoriSertifikasi([user]);

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tgl_tes: date.formatToInput(data.tgl_tes),
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
      <PageHeader
        title={menu.label}
        icon={menu.icon}
        handler={setActive}
        leading={<BackButton />}
      />
      <div className="flex justify-center mt-4">
        <Button
          as="a"
          href={`${prefix + menu.url}/tes/edit/${form.prof_id}`}
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Tes</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Tes <span className="text-danger-600">*</span>
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
                Nama Tes <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_tes"
                value={form.nama_tes}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Tes <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="jenis_tes"
                value={form.jenis_tes}
                disabled
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
                value={form.penyelenggara}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal Tes <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_tes"
                value={form.tgl_tes}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Skor Tes <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="skor_tes"
                value={form.skor_tes}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
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
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
