import Head from "next/head";
import PersuratanModule from "../../../modules/persuratan";

export default function PersuratanPage() {
  return (
    <>
      <Head>
        <title>Persuratan | UCL</title>
      </Head>
      <PersuratanModule isPreview={false} />
    </>
  );
}
