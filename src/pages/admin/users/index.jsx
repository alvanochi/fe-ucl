import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import MahasiswaModule from "../../../modules/admin/users/mahasiswa/index";
import DosenModule from "../../../modules/admin/users/dosen";
import { Loading } from "../../../components/Loading";
import DosenExtModule from "../../../modules/admin/users/dosenExt";
import MahasiswaExtModule from "../../../modules/admin/users/mahasiswaBeasiswa";
import PegawaiModule from "../../../modules/admin/users/pegawai";

export default function Users() {
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
        {active.url === "#list-mhs" && (
          <MahasiswaModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#list-mhs-beasiswa" && (
          <MahasiswaExtModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#list-dosen" && (
          <DosenModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#list-dosen-ext" && (
          <DosenExtModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#list-pegawai" && (
          <PegawaiModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
