import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";

/**
 * Halaman kelas — Modul Pembelajaran (LMS) sisi ADMIN (mode kelola/pantau sesuai scope).
 * URL: /admin/pembelajaran/<kelasKuliahId>  (tambah ?demo=1 untuk pratinjau data contoh).
 *
 * Scope admin (univ/fakultas/prodi) ditegakkan backend; di sini afordansi kelola aktif.
 */
export default function AdminPembelajaranKelas() {
  const { user } = useUser({ redirectTo: "/login" });
  const router = useRouter();
  const { kelasKuliahId, demo } = router.query;

  if (user == null || !router.isReady) return <Loading />;

  return (
    <Layout>
      <PageHeader title="Modul Pembelajaran" icon="mdi:book-education-outline" />
      <div className="my-8">
        <KelasLmsModule
          kelasKuliahId={kelasKuliahId}
          canManage={user.role === "Admin"}
          demo={demo === "1"}
        />
      </div>
    </Layout>
  );
}
