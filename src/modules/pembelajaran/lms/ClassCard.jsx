import Link from "next/link";
import { Icon } from "@iconify-icon/react";

/**
 * Kartu satu kelas pada daftar kelas LMS (pintu masuk ala SPADA).
 * Klik kartu → halaman ruang belajar kelas (`<basePath>/<kelasKuliahId>`).
 *
 * props:
 *  - kelas: row dari `GET /lms/classes`
 *  - basePath: prefix halaman detail per-role (mis. "/mahasiswa/pembelajaran")
 *  - demo: bila true, tautan diberi ?demo=1 agar detail ikut mode contoh
 */
export default function ClassCard({ kelas, basePath, demo = false }) {
  const href = `${basePath}/${encodeURIComponent(kelas.kelasKuliahId)}${demo ? "?demo=1" : ""}`;

  return (
    <Link href={href} legacyBehavior>
      <a className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md">
        {/* Pita atas: identitas matakuliah */}
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold tracking-wide">
              {kelas.kode_matakuliah || "—"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-xs font-medium">
              <Icon icon="mdi:account-group-outline" width={14} height={14} />
              {kelas.total_participants ?? 0}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug">
            {kelas.nama_matakuliah || "Tanpa Nama Matakuliah"}
          </h3>
          <p className="mt-0.5 text-sm text-white/80">
            Kelas {kelas.nama_kelas || "—"} • {kelas.sks ?? "?"} SKS
          </p>
        </div>

        {/* Badan: prodi/fakultas + ringkasan konten */}
        <div className="flex flex-1 flex-col gap-3 px-5 py-4">
          <div className="space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Icon icon="mdi:school-outline" width={16} height={16} className="text-gray-400" />
              <span className="line-clamp-1">{kelas.nama_prodi || "Prodi —"}</span>
            </p>
            <p className="flex items-center gap-2">
              <Icon icon="mdi:office-building-outline" width={16} height={16} className="text-gray-400" />
              <span className="line-clamp-1">{kelas.nama_fakultas || "Fakultas —"}</span>
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Icon icon="mdi:folder-multiple-outline" width={15} height={15} />
              {kelas.total_sections ?? 0} topik
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon icon="mdi:account-tie-outline" width={15} height={15} />
              {kelas.total_lecturers ?? 0} dosen
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-primary-600 transition group-hover:gap-1.5">
              Masuk
              <Icon icon="mdi:arrow-right" width={15} height={15} />
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
