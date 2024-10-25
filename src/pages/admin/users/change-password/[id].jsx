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
import { useEffect, useState } from "react";

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

  const [email, setEmail] = useState("");

  const inputHandlerEmail = (event) => {
    setEmail(event.target.value);
  };

  async function submitHandlerEmail(event) {
    event.preventDefault();

    if (!email) {
      toastAlert("error", "Email harus diisi");
      return;
    }

    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/users/change-email/${router.query.id}`,
        method: "PATCH",
        data: { email: email },
      });
      const response = await request;

      if (response.status === 200) {
        toastAlert("success", "Sukses mengubah email");
        router.push(prefix + menu.url);
      } else {
        toastAlert("error", "Gagal mengubah email");
        router.push(prefix + menu.url);
      }
    } catch (error) {
      setEmail("");
      if (error.response) {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
      } else {
        toastAlert("error", error.message);
      }
    }
  }

  const [isVerified, setIsVerified] = useState(false);

  const handleSwitchChange = async (e) => {
    const newValue = e.target.checked;
    setIsVerified(newValue);
    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/auth/verify-by-admin/${router.query.id}`,
        method: "PUT",
        data: { verified: newValue },
      });
      const response = await request;

      if (response.status === 200 && newValue == true) {
        toastAlert("success", "Sukses verification");
        router.push(prefix + menu.url);
      } else if (response.status === 200 && newValue == false) {
        toastAlert("success", "Account not verification");
        router.push(prefix + menu.url);
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  const fecthUser = async function () {
    try {
      if (user) {
        const response = await axios.get(
          `${process.env.API_ENDPOINT}/users/detail-user/${router.query.id}`
        );
        setIsVerified(response.data.data.isverified);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      fecthUser();
    }
  }, []);

  if (
    [user, menu, router.query.id].some(
      (item) => item == null || item == undefined
    )
  )
    return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`Ubah Sandi/Email ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
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
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>

      <Form onSubmit={submitHandlerEmail}>
        <Card className="mt-8">
          <Card.Header className="text-center">Ubah Email</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                New Email<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="email"
                className="flex-1"
                name="email"
                onChange={inputHandlerEmail}
                value={email}
                required
              />
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>

      <Form>
        <Card className="mt-8">
          <Card.Header className="text-center">Verification</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[2rem]">Is Verified ?</Form.Label>
              <span>:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={handleSwitchChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </Form.Group>
          </Card.Body>
        </Card>
      </Form>
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
    </Layout>
  );
}
