"use client";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./registDosenExt.module.css";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import useForm from "../../hooks/useForm";
import { toastAlert } from "../../lib/sweetalert";
import { MySwal, loadingAlert } from "../../lib/sweetalert";

import axios from "axios";
import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const RegisterDosenExt = () => {
  const [stylesPage, setStylesPage] = useState({
    displayValue: "flex",
    formWidth: "w-2/5",
    formContainer: "w-3/5",
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setStylesPage({
        displayValue: screenWidth <= 780 ? "block" : "flex",
        formWidth: screenWidth <= 880 ? "w-4/5" : "w-2/5",
        formContainer: screenWidth <= 880 ? "w-10/12" : "w-3/5",
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const router = useRouter();

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

  const INITIAL_FORM = {
    nama_lengkap: "",
    jenkel: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    agama: "",
    email: "",
    no_hp: "",
    nip: "",
    instansi: "",
    password: "",
    password2: "",
  };

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

  const { form, inputHandler } = useForm(INITIAL_FORM);

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
    if (form?.password.length > 7) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [form]);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  async function submitHandler(event) {
    event.preventDefault();

    if (
      !form.nama_lengkap ||
      !form.jenkel ||
      !form.tanggal_lahir ||
      !form.tempat_lahir ||
      !form.agama ||
      !form.email ||
      !form.no_hp ||
      !form.nip ||
      !form.instansi ||
      !form.password ||
      !form.password2
    ) {
      return toastAlert("error", "Please fill required field");
    }

    if (form.password !== form.password2) {
      return toastAlert("error", "Password do not match.");
    }

    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/auth/register-dosen-ext`,
        method: "POST",
        data: form,
      });
      const response = await request.data;

      toastAlert("info", response.message);
      router.push("/login");
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
        <title>{`Registrasi Dosen External - ${process.env.APP_NAME}`}</title>
      </Head>

      <div
        className={`w-full min-h-screen bg-motion bg-cover bg-no-repeat`}
        style={{ display: stylesPage.displayValue }}
      >
        <form
          className={`flex items-center justify-center shrink-0 h-full bg-white ml-auto rounded-l-3xl overflow-y-auto ${styles["form"]} ${stylesPage.formWidth}`}
          style={{ maxHeight: "100vh" }}
          onSubmit={submitHandler}
        >
          <div className={`block ${stylesPage.formContainer}`}>
            <div className="block mb-6" style={{ marginTop: "70vh" }}>
              <h1 className="block text-2xl font-bold text-primary-600">
                Registrasi
              </h1>
              <p className="block text-2xl font-bold text-primary-600">
                Dosen External
              </p>
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="form-input"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={inputHandler}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                Nama Instansi
              </label>
              <input
                type="text"
                className="form-input"
                name="instansi"
                value={form.instansi}
                onChange={inputHandler}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                Jenis Kelamin
              </label>
              <div className="flex flex-row">
                <Form.Label className="mr-8">
                  <Form.Radio
                    name="jenkel"
                    value="L"
                    onChange={inputHandler}
                    checked={form.jenkel == "L"}
                  />
                  Laki-Laki
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="jenkel"
                    value="P"
                    onChange={inputHandler}
                    checked={form.jenkel == "P"}
                  />
                  Perempuan
                </Form.Label>
              </div>
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="form-input"
                name="tanggal_lahir"
                onChange={inputHandler}
                value={form.tanggal_lahir}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                className="form-input"
                name="tempat_lahir"
                onChange={inputHandler}
                value={form.tempat_lahir}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">Agama</label>
              <input
                type="text"
                className="form-input"
                name="agama"
                onChange={inputHandler}
                value={form.agama}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="form-input"
                name="email"
                onChange={inputHandler}
                value={form.email}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">No HP</label>
              <input
                type="number"
                className="form-input"
                name="no_hp"
                onChange={inputHandler}
                value={form.no_hp}
                required
              />
            </div>
            <div className="block mb-4">
              <label className="block text-sm font-medium mb-1">NIK/NIP</label>
              <input
                type="number"
                className="form-input"
                name="nip"
                onChange={inputHandler}
                value={form.nip}
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

            <div className="block relative mb-2">
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
                      &nbsp; At least 8 Character
                    </span>
                  </li>
                </ul>
              </p>
            </div>
            <Button variant="primary" className="w-full h-12">
              Save
            </Button>
            <div className="block mt-12 mb-20">
              <p className="block text-sm text-center font-medium text-gray-400">
                <Link href="/login" className="text-primary-600">
                  Kembali
                </Link>
              </p>
            </div>
          </div>
        </form>
        <div
          className={`relative flex flex-col grow py-12 px-10 ${styles["slider"]}`}
        >
          <div className="block mb-16">
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
      </div>
    </>
  );
};

export default RegisterDosenExt;
