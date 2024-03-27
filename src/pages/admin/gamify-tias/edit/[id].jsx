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
import { Loading } from "../../../../components/Loading";

export default function GamifyEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/achievments/detail`;
  const IMG_URL = `${process.env.API_ENDPOINT}/gamify`;
  const IMG_URL_LENCANA = `${process.env.API_ENDPOINT}/gamify/lencana`;

  const INITIAL_FORM = {
    id: "",
    kode: "",
    name: "",
    sub_judul: "",
    gamify: "",
    start_point: "",
    points: "",
    deskripsi: "",
    image: "",
    lencana: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "name", label: "Name" },
      { field: "kode", label: "Kode" },
      { field: "gamify", label: "Gamify" },
      { field: "start_point", label: "Start Point" },
      { field: "points", label: "Point" },
      { field: "deskripsi", label: "Deskripsi" },
      { field: "sub_judul", label: "Sub Judul" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/achievments`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Gamify</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kode <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kode"
                onChange={inputHandler}
                value={form.kode}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Name <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="name"
                onChange={inputHandler}
                value={form.name}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Sub Judul <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="sub_judul"
                onChange={inputHandler}
                value={form.sub_judul}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Gamify <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="gamify"
                onChange={inputHandler}
                value={form.gamify}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Start Point <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="start_point"
                onChange={inputHandler}
                value={form.start_point}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Points <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="points"
                onChange={inputHandler}
                value={form.points}
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
                Lencana <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="lencana"
                  onChange={inputHandler}
                />
                <img
                  src={`${IMG_URL_LENCANA}/${form.lencana}`}
                  alt="img-edit"
                  width={80}
                  height={80}
                />
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Image <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="image"
                  onChange={inputHandler}
                />
                <img
                  src={`${IMG_URL}/${form.image}`}
                  alt="img-edit"
                  className="w-2/4 h-[256px]"
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
