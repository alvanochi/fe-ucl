import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Slider from "react-slick";
import Button from "../../components/Button";
import useForm from "../../hooks/useForm";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./login.module.css";
import Link from "next/link";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";

export const Login = () => {
  const API_URL = `${process.env.API_ENDPOINT}/auth/login`;
  const INITIAL_FORM = {
    email: "",
    password: "",
  };

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

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: "email", label: "E-Mail" },
      { field: "password", label: "Password" },
    ],
  });

  async function setLoginSession(data) {
    try {
      const response = await axios({
        url: "/api/login",
        method: "POST",
        data: data,
      });
      return response.data;
    } catch (error) {
      return await toastAlert("error", error.message);
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const request = await axios({
        url: API_URL,
        method: "POST",
        data: form,
      });
      const response = await request.data;

      if (
        response.message == "Please complete the purchased personal data first."
      ) {
        toastAlert("warning", response.message);
        await setLoginSession(response.data);

        return Router.push("/createDataPribadi");
      }

      if (response.data) {
        loadingAlert();
        await setLoginSession(response.data);
        MySwal.close();

        return Router.push("/");
      }

      throw new Error(response.message);
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;

        if (
          message == "Account not verified. Check your email for verification."
        ) {
          toastAlert("info", message);
          return Router.push("/verification/verificationPage");
        }

        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }

      console.error(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>{`Login - ${process.env.APP_NAME}`}</title>
      </Head>
      <div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat">
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
        <form
          onSubmit={submitHandler}
          className="flex items-center justify-center w-2/5 shrink-0 h=full bg-white ml-auto rounded-l-3xl"
        >
          <div className="block w-3/5">
            <div className="block mb-6">
              <h1 className="block text-2xl font-bold text-primary-600">
                Login
              </h1>
              <p className="block text-gray-600 text-sm">
                Selamat datang di TIAS
              </p>
            </div>
            <div className="block mb-6">
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input
                type="email"
                className="form-input"
                name="email"
                onChange={inputHandler}
                value={form.email}
                required
              />
            </div>
            <div className="block mb-6">
              <div className="flex items-baseline justify-between">
                <label className="block text-sm font-medium mb-1">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary-600 text-sm font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <input
                type="password"
                className="form-input"
                name="password"
                onChange={inputHandler}
                value={form.password}
                required
              />
            </div>
            <Button variant="primary" className="w-full h-12">
              Masuk
            </Button>
            <div className="block mt-12">
              <p className="block text-sm text-center font-medium text-gray-400">
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary-600">
                  Silahkan daftar disini
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
