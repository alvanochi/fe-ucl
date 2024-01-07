import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import SertifikasiGamifyModule from "../../../modules/admin/gamify/sertifikasi";
import PublikasiGamifyModule from "../../../modules/admin/gamify/publikasi";
import ProfesiGamifyModule from "../../../modules/admin/gamify/profesi";
import PrestasiGamifyModule from "../../../modules/admin/gamify/prestasi";
import HkiGamifyModule from "../../../modules/admin/gamify/hki";


export default function Users() {
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
      {active.url === "#kategori-sertifikasi" && (
          <SertifikasiGamifyModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kategori-publikasi" && (
          <PublikasiGamifyModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kategori-profesi" && (
          <ProfesiGamifyModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kategori-prestasi" && (
          <PrestasiGamifyModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kategori-hki" && (
          <HkiGamifyModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
