import "../../styles/tailwind.globals.css";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const path = window.location.pathname;

    const importCSS = async () => {
      if (
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
      } else if (path === "/") {
        await Promise.all([
          import("../../styles/main.css"),
        ]);
      }
    };

    importCSS();
  }, []);
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
