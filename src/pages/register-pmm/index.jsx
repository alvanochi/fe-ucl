import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Slider from "react-slick";
import Button from "../../components/Button";
import useForm from "../../hooks/useForm";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./register.module.css";
import Link from "next/link";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";
import { useEffect, useState } from "react";

export const Register = () => {
  const [displayValue, setDisplayValue] = useState("flex");
  const [formWidth, setFormWidth] = useState("w-2/5");
  const [stylesForm, setStylesForm] = useState({
    container: "w-3/5",
    head: "text-2xl",
    subHead: "block",
    footer: "mt-12",
    formWidth: "w-2/5",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const screenWidth = window.innerWidth;
        setStylesForm({
          container: screenWidth <= 880 ? "w-4/5" : "w-3/5",
          head: screenWidth <= 880 ? "text-base" : "text-2xl",
          subHead: screenWidth <= 880 ? "none" : "block",
          footer: screenWidth <= 880 ? "mt-5" : "mt-12",
          formWidth: screenWidth <= 880 ? "w-4/5" : "w-2/5",
        });

        setDisplayValue(screenWidth <= 780 ? "block" : "flex");
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const INITIAL_FORM = {
    npm: "",
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
      { field: "npm", label: "NPM" },
      { field: "email", label: "E-Mail" },
      { field: "password", label: "Password" },
    ],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/auth/register-pmm`,
        method: "POST",
        data: form,
      });
      const response = await request.data;

      toastAlert("info", response.message);
      Router.push("/verification/verificationPage");
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);

        return;
      }
      loadingAlert();
      MySwal.close();

      toastAlert("error", error.message);
    }
  }

  return (
    <>
      <Head>
        <title>{`Register - ${process.env.APP_NAME}`}</title>
      </Head>
      <div
        className={`w-full min-h-screen bg-motion bg-cover bg-no-repeat`}
        style={{ display: displayValue }}
      >
        <div
          className={`relative flex flex-col grow py-12 px-10 ${styles["slider"]}`}
        >
          <div className={`mb-16 ${styles["logo"]}`}>
            <img src="/img/app_logo.png" alt="App Logo" />
          </div>
          <div className="block relative w-[32rem] mx-auto my-auto">
            {/* SLIDER HERE */}
            <Slider {...settings} arrows={false} className={styles["slider"]}>
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
          className={`flex items-center justify-center  shrink-0 h=full bg-white ml-auto rounded-l-3xl ${styles["form"]} ${stylesForm.formWidth}`}
        >
          <div className={`block ${stylesForm.container}`}>
            <div className="block mb-6">
              <h1
                className={`block font-bold text-primary-600 ${stylesForm.head}`}
              >
                Buat Akun Pribadi - MAHASISWA PMM
              </h1>
              <p
                className=" text-gray-600 text-sm"
                style={{ display: stylesForm.subHead }}
              >
                Daftarkan diri anda menjadi keluarga TIAS dengan mengisi Data
                Pribadi anda!
              </p>
            </div>
            <div className="block mb-6">
              <label className="block text-sm font-medium mb-1">NPM/NIM ASAL</label>
              <input
                type="text"
                className="form-input"
                name="npm"
                onChange={inputHandler}
                value={form.npm}
                required
              />
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
              <label className="block text-sm font-medium mb-1">Password</label>
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
              Buat Akun
            </Button>
            <div className={`block ${stylesForm.footer}`}>
              <p className="block text-sm text-center font-medium text-gray-400">
                Mahasiswa UIKA?{" "}
                <Link href="/register" className="text-primary-600">
                  Daftar disini
                </Link>
              </p>
              <p className="block text-sm text-center font-medium text-gray-400 mt-4">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary-600">
                  Silahkan masuk disini
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
