import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import BackButton from "../../../components/BackButton";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";
import { useLmsSections } from "../../../repo/lms";

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
  const isDemo = demo === "1";
  // Info kelas untuk judul. Key URL SWR sama dengan modul → satu request dipakai bersama (dedupe).
  const { classInfo } = useLmsSections(!isDemo && router.isReady ? kelasKuliahId : null);
  const namaMatakuliah = classInfo?.nama_matakuliah;

  if (user == null || !router.isReady) return <Loading />;

  const canManage = ["Dosen", "Dosen_Ext", "Admin"].includes(user.role);

  return (
    <Layout>
      <PageHeader
        title={namaMatakuliah ? `Modul Pembelajaran — ${namaMatakuliah}` : "Modul Pembelajaran"}
        icon="mdi:book-education-outline"
        leading={<BackButton />}
      />
      <div className="my-8">
        <KelasLmsModule
          kelasKuliahId={kelasKuliahId}
          canManage={canManage}
          demo={isDemo}
        />
      </div>
    </Layout>
  );
}
