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
import { Icon } from "@iconify-icon/react/dist/iconify.js";

export const Register = () => {
  const [displayValue, setDisplayValue] = useState("flex");
  const [formWidth, setFormWidth] = useState("w-2/5");
  const [stylesForm, setStylesForm] = useState({
    container: "w-3/5",
    head: "text-lg",
    subHead: "block",
    footer: "mt-6",
    formWidth: "w-2/5",
  });

  const INITIAL_FORM = {
    npm: "",
    email: "",
    password: "",
    password2: "",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const screenWidth = window.innerWidth;
        setStylesForm({
          container: screenWidth <= 880 ? "w-4/5 h-full" : "w-3/5",
          head: screenWidth <= 880 ? "text-base pt-10" : "text-xl pt-10",
          subHead: screenWidth <= 880 ? "none" : "block",
          footer: screenWidth <= 880 ? "mt-5" : "mt-6 mb-32",
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

  const [upperCase, setUpperCase] = useState(false);
  const [num, setNum] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  const timesIcon = (
    <Icon
      icon="solar:close-square-bold"
      width="20"
      height="20"
      className="text-red-600"
    />
  );
  const checkIcon = (
    <Icon
      icon="solar:check-square-bold"
      width="20"
      height="20"
      className="text-green-500 "
    />
  );

  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    }
    return timesIcon;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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

  useEffect(() => {
    // Check Lower and Uppercase
    if (form?.password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUpperCase(true);
    } else {
      setUpperCase(false);
    }

    // Check For Numbers
    if (form?.password.match(/([0-9])/)) {
      setNum(true);
    } else {
      setNum(false);
    }

    // Check For Special Character
    if (form?.password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSpecialChar(true);
    } else {
      setSpecialChar(false);
    }

    // Check Password Length
    if (form?.password.length > 5) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [form]);

  async function submitHandler(event) {
    event.preventDefault();

    if (form.password !== form.password2) {
      return toastAlert("error", "Password do not match.");
    }

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

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

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
          className={`flex items-center justify-center  shrink-0 h-full bg-white ml-auto rounded-l-3xl ${styles["form"]} ${stylesForm.formWidth}`}
        >
          <div className={`block ${stylesForm.container}`}>
            <div className="block mb-6">
              <h1
                className={`block font-bold text-primary-600 ${stylesForm.head}`}
              >
                Buat Akun
                <span className="text-xl"> Mahasiswa PMM</span>
              </h1>
              {/* <p
                className=" text-gray-600 text-sm"
                style={{ display: stylesForm.subHead }}
              >
                Daftarkan diri anda menjadi keluarga TIAS dengan mengisi Data
                Pribadi anda!
              </p> */}
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                NPM/NIM ASAL
              </label>
              <input
                type="text"
                className="form-input"
                name="npm"
                onChange={inputHandler}
                value={form.npm}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                E-Mail{" "}
                <span className="text-danger-600">*PASTIKAN EMAIL AKTIF</span>
              </label>
              <input
                type="email"
                className="form-input"
                name="email"
                onChange={inputHandler}
                value={form.email}
                required
              />
            </div>
            <div className="block relative mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                name="password"
                onChange={inputHandler}
                value={form.password}
                required
              />
              <div
                className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <Icon icon="solar:eye-bold" width={20} height={20} />
                ) : (
                  <Icon icon="solar:eye-closed-bold" width={20} height={20} />
                )}
              </div>
            </div>

            <div className="block relative mb-4">
              <label className="block text-sm font-medium mb-1">
                Konfirmasi Password
              </label>
              <input
                type={showPassword2 ? "text" : "password"}
                className="form-input"
                name="password2"
                onChange={inputHandler}
                value={form.password2}
                onPaste={(e) => {
                  e.preventDefault();
                  toastAlert("error", "Cannot paste into input field.");
                  return false;
                }}
                required
              />
              <div
                className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePassword2}
              >
                {showPassword2 ? (
                  <Icon icon="solar:eye-bold" width={20} height={20} />
                ) : (
                  <Icon icon="solar:eye-closed-bold" width={20} height={20} />
                )}
              </div>
            </div>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow mb-2">
              <p className="font-normal text-gray-700 ">
                <ul className="form-list">
                  <li>
                    <span className="text-sm">
                      {switchIcon(upperCase)}
                      &nbsp; Lowercase & Uppercase
                    </span>
                  </li>
                  <li>
                    <span className="text-sm">
                      {switchIcon(num)}
                      &nbsp; Number (0-9)
                    </span>
                  </li>
                  <li>
                    <span className="text-sm">
                      {switchIcon(specialChar)}
                      &nbsp; Special Character (!@#$%^&*)
                    </span>
                  </li>
                  <li>
                    <span className="text-sm">
                      {switchIcon(passLength)}
                      &nbsp; At least 6 Character
                    </span>
                  </li>
                </ul>
              </p>
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
              <p className="block text-sm text-center font-medium text-gray-400">
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
