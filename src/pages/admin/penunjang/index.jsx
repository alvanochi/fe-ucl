import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import AnggotaProfesiModule from "../../../modules/admin/penunjang/anggota-profesi/index";
import PenghargaanModule from "../../../modules/admin/penunjang/penghargaan/index";

export default function Penunjang() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader
        title={menu.label}
        icon={menu.icon}
        items={menu.submenus}
        active={active.url}
        handler={setActive}
      />
      <div className="my-8">
        {active.url === "#anggota-profesi" && (
          <AnggotaProfesiModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#penghargaan" && (
          <PenghargaanModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
