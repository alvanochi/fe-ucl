import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("./createComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function SebaranLaporanModule({ baseURL }) {
  return <LazyMap />;
}
