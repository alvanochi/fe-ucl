import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import { Loading } from "../../../components/Loading";
import LaporanModule from "../../../modules/admin/laporan/list-laporan";
import StatistikLaporanModule from "../../../modules/admin/laporan/statistik";
import SebaranLaporanModule from "../../../modules/admin/laporan/sebaran";

export default function Laporan() {
  /* eslint-disable */
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();
  /* eslint-enable */

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
        {active.url === "#laporan" && (
          <LaporanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#laporan-statistik" && (
          <StatistikLaporanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#laporan-sebaran" && (
          <SebaranLaporanModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
