// import "../../styles/slick/slick.min.css";
// import "../../styles/slick/slick-theme.min.css";
// import "../../styles/tailwind.globals.css";
// import "../../styles/main.css";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Mendapatkan path halaman saat ini
    const path = window.location.pathname;

    // Mengatur file CSS berdasarkan path halaman
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
      import("../../styles/tailwind.globals.css");
    } else if (path === "/") {
      import("../../styles/tailwind.globals.css");
      import("../../styles/main.css");
    }
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
