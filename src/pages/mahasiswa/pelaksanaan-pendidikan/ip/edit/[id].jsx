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

export default function IpCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/ipMhs/detail`;

  const INITIAL_FORM = {
    ip_id: "",
    semester: "",
    tahun: "",
    ip: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "semester", label: "Semester" },
      { field: "tahun", label: "Tahun" },
      { field: "ip", label: "Indeks Prestasi Persemerter (IPS)" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/ipMhs/edit`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.ip_id}`, method: "PATCH" };

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
          <Card.Header className="text-center">Edit IP</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Semester <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="semester"
                value={form.semester}
                onChange={inputHandler}
                options={[
                  { label: "Semester 1", value: "Semester 1" },
                  { label: "Semester 2", value: "Semester 2" },
                  { label: "Semester 3", value: "Semester 3" },
                  { label: "Semester 4", value: "Semester 4" },
                  { label: "Semester 5", value: "Semester 5" },
                  { label: "Semester 6", value: "Semester 6" },
                  { label: "Semester 7", value: "Semester 7" },
                  { label: "Semester 8", value: "Semester 8" },
                ]}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Indeks Prestasi Persemerter (IPS){" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="ip"
                value={form.ip}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun"
                value={form.tahun}
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
