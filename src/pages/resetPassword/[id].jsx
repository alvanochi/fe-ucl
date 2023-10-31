import Head from "next/head";
import Link from "next/link";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./resetPassword.module.css";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import useForm from "../../hooks/useForm";
import { toastAlert } from "../../lib/sweetalert";
import { MySwal, loadingAlert } from "../../lib/sweetalert";

import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: styles["slick-dots"],
    customPaging: function (i) {
      return (
        <div className="w-full rounded-full h-1 bg-white bg-opacity-20 dots"></div>
      );
    },
  };

  const INITIAL_FORM = {
    password: "",
    password2: "",
  };

  const RESET_URL = `${process.env.API_ENDPOINT}/auth/resetPassword/${router.query.id}`;

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      {
        field: "password",
        label: "New Password",
        field: "password2",
        label: "Confirm Password",
      },
    ],
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      return toastAlert("error", "Password do not match.");
    }

    try {
      delete form.password2;
      loadingAlert("Harap Tunggu", "Memproses permintaan...");
      const request = await axios({
        url: RESET_URL,
        method: "PATCH",
        data: form,
      });

      MySwal.close();

      const response = await request;

      if (response.status == 200) {
        toastAlert("info", response.data.message);
        router.push("/login");
      }
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{`Reset Password - ${process.env.APP_NAME}`}</title>
      </Head>

      <div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat">
        <form
          onSubmit={submitHandler}
          type="formdata"
          className="flex items-center justify-center w-2/5 shrink-0 h=full bg-white ml-auto rounded-l-3xl"
        >
          <div className="block w-3/5">
            <div className="block mb-6">
              <h1 className="block text-2xl font-bold text-primary-600">
                Reset Password
              </h1>
              <p className="block text-gray-600 text-sm">
                Silahkan Masukan Password Baru
              </p>
            </div>
            <div className="block mb-6">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                name="password"
                onChange={inputHandler}
                value={form.password}
                required
              />
            </div>
            <div className="block mb-6">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-input"
                name="password2"
                onChange={inputHandler}
                value={form.password2}
                required
              />
            </div>
            <Button variant="primary" className="w-full h-12">
              Save
            </Button>
            <div className="block mt-12">
              <p className="block text-sm text-center font-medium text-gray-400">
                <Link href="/login" className="text-primary-600">
                  Kembali
                </Link>
              </p>
            </div>
          </div>
        </form>
        <div className="relative flex flex-col grow py-12 px-10">
          <div className="block mb-16">
            <img src="/img/app_logo.png" alt="App Logo" />
          </div>
          <div className="block relative w-[32rem] mx-auto my-auto">
            {/* SLIDER HERE */}
            <Slider {...settings} arrows={false}>
              <div>
                <div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
                  <h3 className="block text-3xl text-white font-bold mb-12">
                    Platform <br /> Digital Untuk <br /> Mempermudah <br />{" "}
                    Administrasi
                  </h3>
                  <p className="block text-white text-sm font-semibold">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga TIAS
                  </p>
                </div>
              </div>
              <div>
                <div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
                  <img
                    src="/img/login/vector-1.png"
                    alt="Login slider"
                    className="mx-auto mb-2 h-72"
                  />
                  <p className="block text-white text-sm font-semibold">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga TIAS
                  </p>
                </div>
              </div>
              <div>
                <div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
                  <img
                    src="/img/login/vector-2.png"
                    alt="Login slider"
                    className="mx-auto mb-2 h-72"
                  />
                  <p className="block text-white text-sm font-semibold">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga TIAS
                  </p>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
