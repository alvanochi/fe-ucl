import dynamic from "next/dynamic";

const LazyMap = dynamic(
  () => import("../../../../components/SebaranLaporan/"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function SebaranLaporanModule({ baseURL }) {
  return <LazyMap />;
}
