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
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import Swal from "sweetalert2";

export const Login = () => {
  const [stylesPage, setStylesPage] = useState({
    displayValue: "flex",
    formWidth: "w-2/5",
    formContainer: "w-3/5",
  });

  const [isSsoLoading, setIsSsoLoading] = useState(false);

  console.log(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const handleSsoLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ssoToken = urlParams.get("token");
      const roleId = urlParams.get("role_id");
      const appModuleId = urlParams.get("appModule_id");

      if (!ssoToken || !roleId || !appModuleId) return;

      setIsSsoLoading(true); // ← tambahin ini

      try {
        localStorage.clear();
        console.log("Memproses SSO...");

        const { data: ssoRes } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sso/callback`,
          {
            params: {
              token: ssoToken,
              role_id: roleId,
              appModule_id: appModuleId,
            },
          },
        );

        if (ssoRes.status !== 200) {
          throw new Error(ssoRes.message || "SSO Gagal");
        }

        const userData = ssoRes.data;

        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem(
          "account_info",
          JSON.stringify({
            id: userData.user_id,
            nama: userData.nama_lengkap,
            code: userData.kode_mhs || userData.nip || "SSO",
          }),
        );

        await axios.post("/staging/api/login", userData);

        const role = userData.role?.toLowerCase();
        let targetPath = "/dashboard";

        if (role === "admin") targetPath = "/admin";
        else if (role === "mahasiswa") targetPath = "/mahasiswa";
        else if (role === "dosen") targetPath = "/dosen";
        else if (role === "dosen_ext") targetPath = "/dosen_ext";
        else if (role === "pegawai") targetPath = "/pegawai";

        window.location.href = targetPath;
      } catch (error) {
        console.error("[SSO Error]", error);
        setIsSsoLoading(false); // ← tambahin ini
        toastAlert("error", "SSO Login gagal. Silakan login manual.");
      }
    };

    if (typeof window !== "undefined") {
      handleSsoLogin();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { error } = Router.query;
      if (error) {
        if (error === "invalid") {
          toastAlert("error", "invalid email");
        } else if (error === "not_verified") {
          toastAlert("error", "account not verified");
        }
      }
    }
  }, []);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  console.log(`ini url ${API_URL}`);
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
    autoplay: true,
    autoplaySpeed: 2000,
    dotsClass: styles["slick-dots"],
    customPaging: function (i) {
      return (
        <div className="w-full h-1 bg-white rounded-full bg-opacity-20 dots"></div>
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
        url: "/staging/api/login",
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
      console.log("LOGIN RESPONSE:", response);

      if (response.data) {
        loadingAlert();
        await setLoginSession(response.data);
        MySwal.close();

        return Router.reload();
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

        return;
      }

      toastAlert("error", error);
    }
  }
  const googleLogin = async () => {
    try {
      const API_URL_GOOLE = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      window.location.href = API_URL_GOOLE;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.message || "An unexpected error occurred.",
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (isSsoLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <img
          src="/img/app_logo.png"
          alt="Logo"
          className="object-contain h-16 mb-8"
        />
        <div className="w-10 h-10 mb-4 border-4 rounded-full border-primary-600 border-t-transparent animate-spin" />
        <p className="text-lg font-bold text-gray-700">Memproses SSO...</p>
        <p className="mt-1 text-sm text-gray-400">
          Mohon tunggu, sedang memverifikasi akses Anda
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Login - awda`}</title>
      </Head>
      <div
        className={`w-full min-h-screen bg-motion bg-cover bg-no-repeat`}
        style={{ display: stylesPage.displayValue }}
      >
        <div
          className={`relative flex flex-col grow py-12 px-10 ${styles["slider"]}`}
        >
          <Link href="/" className={`mb-16 ${styles["logo"]}`}>
            <img src="/img/app_logo.png" alt="App Logo" />
          </Link>
          <div className="block relative w-[32rem] mx-auto my-auto">
            {/* SLIDER HERE */}
            <Slider {...settings} arrows={false} className={styles["slider"]}>
              <div>
                <div className="w-full p-8 bg-white rounded-2xl bg-opacity-20">
                  <h3 className="block mb-12 text-3xl font-bold text-white">
                    Platform <br /> Digital Untuk <br /> Mempermudah <br />{" "}
                    Administrasi
                  </h3>
                  <p className="block text-sm font-semibold text-white">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga UCL
                  </p>
                </div>
              </div>
              <div>
                <div className="w-full p-8 bg-white rounded-2xl bg-opacity-20">
                  <img
                    src="/img/login/vector-1.png"
                    alt="Login slider"
                    className="mx-auto mb-2 h-72"
                  />
                  <p className="block text-sm font-semibold text-white">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga UCL
                  </p>
                </div>
              </div>
              <div>
                <div className="w-full p-8 bg-white rounded-2xl bg-opacity-20">
                  <img
                    src="/img/login/vector-2.png"
                    alt="Login slider"
                    className="mx-auto mb-2 h-72"
                  />
                  <p className="block text-sm font-semibold text-white">
                    Kembangkan karir dan relasi anda dengan daftar menjadi
                    keluarga UCL
                  </p>
                </div>
              </div>
            </Slider>
          </div>
        </div>
        <form
          onSubmit={submitHandler}
          className={`flex items-center justify-center  shrink-0 h=full bg-white ml-auto rounded-l-3xl ${styles["form"]} ${stylesPage.formWidth}`}
        >
          <div className={`block ${stylesPage.formContainer}`}>
            <div className="block mb-2">
              <h1 className="block text-2xl font-bold text-primary-600">
                Login
              </h1>
              <p className="block text-sm text-gray-600">
                Selamat datang di UCL. Kami merekomendasikan untuk login
                menggunakan perangkat dengan layar berukuran desktop.
              </p>
            </div>
            <div className="block mb-6">
              <label className="block mb-1 text-sm font-medium">E-Mail</label>
              <input
                type="email"
                className="form-input"
                name="email"
                onChange={inputHandler}
                value={form.email}
                required
              />
            </div>
            <div className="relative block mb-6">
              <div className="flex items-baseline justify-between">
                <label className="block mb-1 text-sm font-medium">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-600"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                name="password"
                onChange={inputHandler}
                value={form.password}
                required
              />
              <div
                className="absolute transform -translate-y-1/2 cursor-pointer right-3 top-12"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <Icon
                    icon="solar:eye-bold"
                    className="text-gray-600"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Icon icon="solar:eye-closed-bold" width={20} height={20} />
                )}
              </div>
            </div>
            <Button variant="primary" className="w-full h-12">
              Masuk
            </Button>
            <button
              type="button"
              onClick={() => googleLogin()}
              className="flex items-center justify-center w-full h-12 px-4 py-2 mt-2 font-semibold text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-100"
            >
              <img
                src="/img/google.png"
                alt="Google Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-center">Login dengan Google</span>
            </button>
            <div className="block mt-12">
              <p className="block text-sm font-medium text-center text-gray-400">
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
