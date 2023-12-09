import Head from "next/head";
import React, { useEffect, useState } from "react";

const VerificationPage = () => {
  const [stylesPage, setStylesPage] = useState({
    displayValue: "flex",
    widthCard: "w-[32rem]",
    mLogo: "",
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setStylesPage({
        displayValue: screenWidth <= 780 ? "block" : "flex",
        widthCard: screenWidth <= 700 ? "w-[20rem]" : "w-[32rem]",
        mLogo: screenWidth <= 700 ? "mb-11" : "",
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{`Verification Sent - ${process.env.APP_NAME}`}</title>
      </Head>

      <div
        className={`w-full min-h-screen bg-motion bg-cover bg-no-repeat`}
        style={{ display: stylesPage.displayValue }}
      >
        <div className="relative flex flex-col grow py-7 px-6">
          <div className={`block ${stylesPage.mLogo}`}>
            <img src="/img/app_logo.png" alt="App Logo" />
          </div>
          <div
            className={`block relative ${stylesPage.widthCard} mx-auto my-auto`}
          >
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
