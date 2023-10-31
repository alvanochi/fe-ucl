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

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tgl_tes: date.formatToInput(data.tgl_tes),
      }),
    });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Tes</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Tes <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenis_tes"
                value={form.jenis_tes}
                options={[
                  { label: "Test Bahasa Asing", value: "Test Bahasa Asing" },
                  {
                    label: "Kompentensi Profesi",
                    value: "Kompentensi Profesi",
                  },
                  { label: "Lainnya", value: "Lainnya" },
                ]}
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
                type="number"
                className="flex-1"
                step="0.1"
                name="skor_tes"
                value={form.skor_tes}
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
            Batal
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
