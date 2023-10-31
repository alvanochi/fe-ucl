import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import PendidikanFormalModule from "../../../modules/admin/kualifikasi/pendidikan-formal/index";
import RiwayatPekerjaanModule from "../../../modules/admin/kualifikasi/riwayat-pekerjaan/index";

export default function Kualifikasi() {
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
        {active.url === "#pendidikan-formal" && (
          <PendidikanFormalModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#riwayat-pekerjaan" && (
          <RiwayatPekerjaanModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
