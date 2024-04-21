import { useEffect } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import { useRouter } from "next/router";
import date from "../../../../utils/date";
import { Loading } from "../../../../components/Loading";

export default function WaliEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;

  const INITIAL_FORM = {
    dp_id: "",
    wali: "",
    alamat_wali: "",
    telp_wali: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "wali", label: "wali" },
      { field: "alamat_wali", label: "Alamat wali" },
      { field: "telp_wali", label: "No Telp Wali" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/profile/editData`;
  const EDIT_OPTION = { url: `${EDIT_URL}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show("", {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`Edit ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Wali</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="w-[18rem]">
                Nama Wali <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="wali"
                onChange={inputHandler}
                value={form.wali}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="w-[18rem]">
                No. Telp Wali <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="telp_wali"
                onChange={inputHandler}
                value={form.telp_wali}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="w-[18rem]">
                Alamat Wali <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="alamat_wali"
                onChange={inputHandler}
                value={form.alamat_wali}
                required
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
