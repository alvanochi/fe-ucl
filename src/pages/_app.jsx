import "../../styles/tailwind.globals.css";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
        path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/forgot-password") ||
        path.startsWith("/verification") ||
        path.startsWith("/createDataPribadi")
      ) {
        await import("../../styles/tailwind.globals.css");
      }
    };

    loadCSSBasedOnPath();
  }, [router.pathname]);

  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        onError: (error) => console.error(error),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
