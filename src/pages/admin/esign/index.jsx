import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import { Loading } from "../../../components/Loading";
import ESignModule from "../../../modules/admin/esign";

export default function esign() {
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
        {active.url === "#esign" && <ESignModule baseURL={prefix + menu.url} />}
        {/* {active.url === "#kurikulum" && (
          <KurikulumModule baseURL={prefix + menu.url} />
        )} */}
      </div>
    </Layout>
  );
}
