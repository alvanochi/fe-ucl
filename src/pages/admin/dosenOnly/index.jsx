import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import SertifikasiModule from "../../../modules/admin/kompetensi/sertifikasi/index";
import KepangkatanModule from "../../../modules/admin/dosenOnly/kepangkatan/index";
import JabatanFungsionalModule from "../../../modules/admin/dosenOnly/jabatan-fungsional/index";
import TesModule from "../../../modules/admin/kompetensi/tes/index";

export default function dosenOnly() {
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
        {active.url === "#kepangkatan" && (
          <KepangkatanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#jabatan-fungsional" && (
          <JabatanFungsionalModule baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
