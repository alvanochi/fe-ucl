import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import "swiper/css/bundle";
import AOS from "aos";
import "aos/dist/aos.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const loadCSSBasedOnPath = async () => {
      const path = router.pathname;

      if (path === "/" || path.startsWith("/validasi-dokumen") || path.startsWith("/validasi-surat")) {
        await import("../../styles/main.css");
        await import("../../styles/tailwind.globals.css");
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
  }, [router.pathname, Component]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

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
