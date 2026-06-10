import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";

/**
 * Halaman kelas — Modul Pembelajaran (LMS) sisi MAHASISWA (mode baca).
 * URL: /mahasiswa/pembelajaran/<kelasKuliahId>  (tambah ?demo=1 untuk pratinjau data contoh).
 *
 * Akses BACA mahasiswa terdaftar ditegakkan backend (studentEnrolled); di sini selalu read-only.
 */
export default function MahasiswaPembelajaranKelas() {
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
          canManage={false}
          demo={demo === "1"}
        />
      </div>
    </Layout>
  );
}
