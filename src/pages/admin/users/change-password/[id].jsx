import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useForm from "../../../../hooks/useForm";
import { toastAlert } from "../../../../lib/sweetalert";
import _ from "underscore";
import axios from "axios";
import { Loading } from "../../../../components/Loading";

export default function ChangePassword() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();


  const INITIAL_FORM = {
    password: "",
    confirmPassword: "",
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {});

  async function submitHandler(event) {
    event.preventDefault();
    if (form.password != form.confirmPassword)
      return toastAlert("error", "Password baru tidak sesuai!");

    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/users/change-password/${router.query.id}`,
        method: "PATCH",
        data: _.omit(form, ["confirmPassword"]),
      });
      const response = await request;
      
      if (response) {
        toastAlert("success", "Sukses mengubah passoword");
        return router.push(prefix + menu.url);
      }

      toastAlert("error", response.message);
      router.push(prefix + menu.url);
    } catch (error) {
      console.log(error);
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);

        return;
      }

      toastAlert("error", error.message);
    }
  }


	if ([user, menu].some((item) => item == null)) return <Loading />;
	return (
		<Layout>
			<PageHeader title={`Ubah Sandi ${menu.label}`} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Ubah Kata Sandi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Password<span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="password"
                  className="flex-1"
                  name="password"
                  onChange={inputHandler}
                  required
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Konfirmasi Sandi Baru <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="password"
                  className="flex-1"
                  name="confirmPassword"
                  onChange={inputHandler}
                  value={form.confirmPassword}
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
