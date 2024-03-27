import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useCRUD from "../../../hooks/useCRUD";
import { useEffect } from "react";
import { Loading } from "../../../components/Loading";

export default function EventEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/berita/detail`;
  const FILE_URL_PAMFLET = `${process.env.API_ENDPOINT}/berita/pamflet`;
  const FILE_URL_DOKUMEN = `${process.env.API_ENDPOINT}/berita/dokumen`;

  const INITIAL_FORM = {
    id: "",
    title: "",
    deskripsi: "",
    pamflet: "",
    dokumen: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "title", label: "Title" },
      { field: "deskripsi", label: "Deskripsi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/berita`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  if (
    [user, menu, form].some(
      (item) => item == null
    )
  )
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Edit</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Title <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="title"
                onChange={inputHandler}
                value={form.title}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Deskripsi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="deskripsi"
                value={form.deskripsi}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pamflet <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="pamflet"
                  onChange={inputHandler}
                />
                <img src={`${FILE_URL_PAMFLET}/${form.pamflet}`} alt="pamflet" className="w-full h-[256px]" />
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="dokumen"
                  onChange={inputHandler}
                />
                <embed
                  src={`${FILE_URL_DOKUMEN}/${form.dokumen}`}
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
