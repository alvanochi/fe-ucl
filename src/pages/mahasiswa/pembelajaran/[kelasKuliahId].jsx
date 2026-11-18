import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import BackButton from "../../../components/BackButton";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import KelasLmsModule from "../../../modules/pembelajaran/lms";
import { useLmsSections } from "../../../repo/lms";

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
  const isDemo = demo === "1";
  // Info kelas untuk judul. Key URL SWR sama dengan modul → satu request dipakai bersama (dedupe).
  const { classInfo } = useLmsSections(!isDemo && router.isReady ? kelasKuliahId : null);
  const namaMatakuliah = classInfo?.nama_matakuliah;

  if (user == null || !router.isReady) return <Loading />;

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
          canManage={false}
          demo={isDemo}
        />
      </div>
    </Layout>
  );
}
