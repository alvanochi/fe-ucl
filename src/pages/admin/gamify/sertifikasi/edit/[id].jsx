import { useRouter } from "next/router";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";

export default function detailKategoriSertifikasi() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kategori/sertifikasi`;

  const INITIAL_FORM = {
    id: "",
    kode: "",
    nama_kategori: "",
    point: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "id", label: "id" },
      { field: "kode", label: "Kode" },
      { field: "nama_kategori", label: "Nama Kategori" },
      { field: "point", label: "Point" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/kategori/sertifikasi`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, { transformData: (data) => ({ ...data }) });
  }, [router, user]);

  if ([user, menu, form].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Kategori Sertifikasi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kode
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kode"
                value={form.kode}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Kategori
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_kategori"
                value={form.nama_kategori}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Point <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="point"
                value={form.point}
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
