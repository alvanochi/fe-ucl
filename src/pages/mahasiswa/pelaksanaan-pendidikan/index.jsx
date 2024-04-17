import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import IpModule from "../../../modules/pelaksanaan-pendidikan/ip/index";
import AkademikModule from "../../../modules/mahasiswa/bimbingan/akademik/index";
import KpModule from "../../../modules/pelaksanaan-pendidikan/kp";
import PerkuliahanModule from "../../../modules/pelaksanaan-pendidikan/perkuliahan";
import { Loading } from "../../../components/Loading";
import TugasAkhirModule from "../../../modules/mahasiswa/bimbingan/tugas-akhir";

export default function PelaksanaanPendidikan() {
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
        {active.url === "#ip" && <IpModule baseURL={prefix + menu.url} />}
        {active.url === "#perkuliahan" && (
          <PerkuliahanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#akademik" && (
          <AkademikModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kp" && <KpModule baseURL={prefix + menu.url} />}
        {active.url === "#tugas-akhir" && (
          <TugasAkhirModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
