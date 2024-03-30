import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import { Loading } from "../../../components/Loading";
import StrukturalProdiModule from "../../../modules/admin/struktural-prodi";

export default function Jabatan() {
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
        {active.url === "#struktural-prodi" && (
          <StrukturalProdiModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
