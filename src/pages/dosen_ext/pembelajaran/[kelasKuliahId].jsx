import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";

/**
 * Halaman kelas — Modul Pembelajaran (LMS) sisi DOSEN EXTERNAL (mode kelola).
 * URL: /dosen_ext/pembelajaran/<kelasKuliahId>  (tambah ?demo=1 untuk pratinjau data contoh).
 *
 * Otorisasi kelola (dosen pengampu) tetap ditegakkan backend; di sini afordansi kelola aktif.
 */
export default function DosenExtPembelajaranKelas() {
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
