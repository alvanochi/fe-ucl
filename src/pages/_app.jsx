import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import "swiper/css/bundle";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const loadCSSBasedOnPath = async () => {
      const path = router.pathname;

      if (path === "/") {
        await import("../../styles/main.css");
      } else if (
        path.startsWith("/mahasiswa") ||
        path.startsWith("/dosen") ||
        path.startsWith("/admin") ||
        path.startsWith("/demo") ||
        path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/forgot-password") ||
        path.startsWith("/verification") ||
        path.startsWith("/resetPassword") ||
        path.startsWith("/createDataPribadi")
      ) {
        await import("../../styles/tailwind.globals.css");
      }
    };

    loadCSSBasedOnPath();
  }, [router.pathname, Component]); // Update useEffect dependencies

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SWRConfig
        value={{
          fetcher: fetcher,
          onError: (error) => console.error(error),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default MyApp;
