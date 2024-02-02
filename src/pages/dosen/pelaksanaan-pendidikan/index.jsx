import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import BimbinganModule from "../../../modules/pelaksanaan-pendidikan/bimbingan";
import BahanAjarModule from "../../../modules/pelaksanaan-pendidikan/bahan-ajar";
import { DevelopmentPage } from "../../../components/DevelopmentPage";

export default function PelaksanaanPendidikan() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      {/* <PageHeader
        title={menu.label}
        icon={menu.icon}
        items={menu.submenus}
        active={active.url}
        handler={setActive}
      />
      <div className="my-8">
        {active.url === "#bimbingan" && (
          <BimbinganModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#bahan-ajar" && (
          <BahanAjarModule baseURL={prefix + menu.url} />
        )}
      </div> */}

      <DevelopmentPage />
    </Layout>
  );
}
