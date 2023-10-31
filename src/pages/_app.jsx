// import "../../styles/slick/slick.min.css";
// import "../../styles/slick/slick-theme.min.css";
import "../../styles/tailwind.globals.css";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";

function MyApp({ Component, pageProps }) {
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
