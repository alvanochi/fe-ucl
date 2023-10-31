import Head from "next/head";
import React from "react";

const VerificationPage = () => {
  return (
    <>
      <Head>
        <title>{`Verification Sent - ${process.env.APP_NAME}`}</title>
      </Head>

      <div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat">
        <div className="relative flex flex-col grow py-7 px-6">
          <div className="block ">
            <img src="/img/app_logo.png" alt="App Logo" />
          </div>
          <div className="block relative w-[32rem] mx-auto my-auto ">
            <div>
              <div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
                <h1 className="block text-white text-center text-lg font-semibold">
                  Verification Email Sent!!
                </h1>
                <h1 className="block text-white text-center text-lg font-semibold">
                  Check Your Email For Verification Account.
                </h1>
                <img
                  src="/img/verification/verify-send-vector.png"
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

export default VerificationPage;
