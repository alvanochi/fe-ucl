import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";

/**
 * Halaman kelas — Modul Pembelajaran (LMS) sisi DOSEN (mode kelola).
 * URL: /dosen/pembelajaran/<kelasKuliahId>  (tambah ?demo=1 untuk pratinjau data contoh).
 *
 * KERANGKA langkah 1: struktur topik/ item + afordansi kelola. Editor & renderer menyusul.
 */
export default function DosenPembelajaranKelas() {
  const { user } = useUser({ redirectTo: "/login" });
  const router = useRouter();
  const { kelasKuliahId, demo } = router.query;

  if (user == null || !router.isReady) return <Loading />;

  const canManage = ["Dosen", "Dosen_Ext", "Admin"].includes(user.role);

  return (
    <Layout>
      <PageHeader title="Modul Pembelajaran" icon="mdi:book-education-outline" />
      <div className="my-8">
        <KelasLmsModule
          kelasKuliahId={kelasKuliahId}
          canManage={canManage}
          demo={demo === "1"}
        />
      </div>
    </Layout>
  );
}
