import Button from "../../../components/Button";
import Form from "../../../components/Form";
import { useRouter } from "next/router";
import useUser from "../../../hooks/useUser";
import useMenu from "../../../hooks/useMenu";
import useForm from "../../../hooks/useForm";
import { toastAlert } from "../../../lib/sweetalert";
import axios from "axios";
import _ from "underscore";
import Card from "../../../components/Card";
import useCRUD from "../../../hooks/useCRUD";
import { useEffect } from "react";

export default function AkunModule({ baseURL }) {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/auth/get-user`;

  const INITIAL_FORM = {
    user_id: "",
    email: "",
    npm: "",
    nidn: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "email", label: "E-Mail" },
      { field: "npm", label: "NPM" },
      { field: "nidn", label: "NIDN" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/auth/updateUserLogin`;
  const EDIT_OPTION = { url: `${EDIT_URL}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <>
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Form Setting Akun</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Email <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="email"
                className="flex-1"
                name="email"
                onChange={inputHandler}
                value={form.email}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                NPM/NIDN <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name={form.npm ? "npm" : form.nidn ? "nidn" : ""}
                onChange={inputHandler}
                value={form.npm ? form.npm : form.nidn ? form.nidn : ""}
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
    </>
  );
}
