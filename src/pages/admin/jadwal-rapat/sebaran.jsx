import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import _ from "underscore";
import { Loading } from "../../../components/Loading";
import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("../../../components/SebaranKegiatan/"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function CreateJadwal() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`${menu.label} - Peta Sebaran`}
        icon={menu.icon}
        handler={setActive}
      />
      <LazyMap />
    </Layout>
  );
}
