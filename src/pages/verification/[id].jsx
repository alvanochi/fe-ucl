import Head from "next/head";
import React from "react";
import Button from "../../components/Button";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";

const Verification = () => {
  const router = useRouter();

  const setLoginSession = async (data) => {
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
  };

  const verifyAccount = async () => {
    try {
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/auth/verifyUser/${router.query.id}`,
        method: "PATCH",
      });

      const response = await request;

      if (response.data) {
        loadingAlert();
        await setLoginSession(response.data.data);
        MySwal.close();

        toastAlert("info", response.data.message);
        return Router.push("/createDataPribadi");
      }
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }

      console.error(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>{`Verify Akun - ${process.env.APP_NAME}`}</title>
      </Head>

      <div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat">
        <div className="relative flex flex-col grow py-7 px-6">
          <div className="block ">
            <img src="/img/app_logo.png" alt="App Logo" />
          </div>
          <div className="block relative w-[32rem] mx-auto my-auto ">
            <div>
              <div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
                <p className="block text-white text-center text-sm font-semibold">
                  Verify Your Account!!
                </p>
                <Button
                  onClick={verifyAccount}
                  variant="primary"
                  className="w-full h-12 mt-8"
                >
                  Verify
                </Button>
                <img
                  src="/img/verification/verification-vector.png"
                  alt="Login slider"
                  className="mx-auto mb-2 h-42"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;
