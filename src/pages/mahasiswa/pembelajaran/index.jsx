import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import { Loading } from "../../../components/Loading";
import useUser from "../../../hooks/useUser";
import ClassList from "../../../modules/pembelajaran/lms/ClassList";

/**
 * Daftar Kelas LMS — pintu masuk Modul Pembelajaran sisi MAHASISWA.
 * URL: /mahasiswa/pembelajaran  (tambah ?demo=1 untuk pratinjau data contoh).
 *
 * Klik kartu kelas → /mahasiswa/pembelajaran/<kelasKuliahId> (ruang belajar, read-only).
 */
export default function MahasiswaPembelajaranIndex() {
  const { user } = useUser({ redirectTo: "/login" });
  const router = useRouter();
  const { demo } = router.query;

  if (user == null || !router.isReady) return <Loading />;

  return (
    <Layout>
      <PageHeader title="Kelas Pembelajaran" icon="mdi:book-education-outline" />
      <div className="my-8">
        <ClassList basePath="/mahasiswa/pembelajaran" demo={demo === "1"} />
      </div>
    </Layout>
  );
}
