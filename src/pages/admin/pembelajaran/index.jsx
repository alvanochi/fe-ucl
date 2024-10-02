import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import ChangePasswordModule from "../../../modules/setting/change-password";
import AkunModule from "../../../modules/setting/akun";
import { Loading } from "../../../components/Loading";
import MatakuliahModule from "../../../modules/admin/pembelajaran/matakuliah";
import KurikulumModule from "../../../modules/admin/pembelajaran/kurikulum";

export default function Pembelajaran() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  if ([user, menu].some((item) => item == null)) return <Loading />;
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
        {active.url === "#matakuliah" && (
          <MatakuliahModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kurikulum" && (
          <KurikulumModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
