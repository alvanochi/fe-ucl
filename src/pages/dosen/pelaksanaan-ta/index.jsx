import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import { Loading } from "../../../components/Loading";
import TugasAkhirModule from "../../../modules/pelaksanaan-pendidikan/tugas-akhir";
import BimbinganTaModule from "../../../modules/pelaksanaan-pendidikan/bimbingan-ta";

export default function PelaksanaanTA() {
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
        {active.url === "#bimbingan-ta" && (
          <BimbinganTaModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#tugas-akhir" && (
          <TugasAkhirModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
