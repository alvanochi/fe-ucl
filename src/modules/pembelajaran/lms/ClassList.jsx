import { useMemo, useState } from "react";
import { Icon } from "@iconify-icon/react";
import ClassCard from "./ClassCard";
import { useLmsClasses } from "../../../repo/lms";
import { SAMPLE_CLASSES, SAMPLE_SEMESTERS } from "./sampleClasses";

const PAGE_SIZE = 12;

// "20241" → "2024 Ganjil" / "20242" → "2024 Genap". Tahun = 4 digit awal, sesi = digit akhir.
function semesterLabel(kode) {
  if (!kode) return "Semua Semester";
  const year = String(kode).slice(0, 4);
  const sesi = String(kode).slice(4);
  const nama = sesi === "1" ? "Ganjil" : sesi === "2" ? "Genap" : sesi === "3" ? "Pendek" : "";
  return `${year} ${nama}`.trim();
}

// Daftar semester wajar (3 tahun terakhir × Ganjil/Genap) untuk dropdown saat data live —
// backend belum menyediakan endpoint daftar semester, jadi dibangkitkan dari tahun berjalan.
function recentSemesters() {
  const now = new Date();
  const year = now.getFullYear();
  const list = [];
  for (let y = year; y >= year - 2; y -= 1) {
    list.push(`${y}2`, `${y}1`);
  }
  return list;
}

/**
 * Daftar kelas LMS — "pintu masuk" ala SPADA. Backend memfilter sesuai role/scope user;
 * komponen ini hanya UX (cari, filter semester, paginasi, grid kartu kelas).
 *
 * props:
 *  - basePath: prefix halaman detail per-role (mis. "/dosen/pembelajaran")
 *  - demo: bila true, pakai data contoh lokal (?demo=1) tanpa memanggil backend
 */
export default function ClassList({ basePath, demo = false }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);

  // --- Mode LIVE: backend yang filter & paginasi ---
  const live = useLmsClasses({
    semester,
    search,
    page,
    limit: PAGE_SIZE,
    enabled: !demo,
  });

  // --- Mode CONTOH: filter & paginasi data lokal di sisi klien ---
  const demoResult = useMemo(() => {
    if (!demo) return null;
    const q = search.trim().toLowerCase();
    const filtered = SAMPLE_CLASSES.filter((k) => {
      if (semester && k.semester !== semester) return false;
      if (!q) return true;
      return [k.kode_matakuliah, k.nama_matakuliah, k.nama_kelas, k.nama_prodi, k.nama_fakultas]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
    const total = filtered.length;
    const start = (page - 1) * PAGE_SIZE;
    return {
      classes: filtered.slice(start, start + PAGE_SIZE),
      total,
      totalPage: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      isLoading: false,
    };
  }, [demo, search, semester, page]);

  const { classes, total, totalPage, isLoading } = demo ? demoResult : live;
  const semesterOptions = demo ? SAMPLE_SEMESTERS : recentSemesters();

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };
  const changeSemester = (e) => {
    setPage(1);
    setSemester(e.target.value);
  };
  const resetFilter = () => {
    setSearchInput("");
    setSearch("");
    setSemester("");
    setPage(1);
  };

  const hasFilter = !!(search || semester);

  return (
    <div className="space-y-5">
      {/* Toolbar: pencarian + filter semester */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {demo && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary-100 px-2 py-1 font-medium text-secondary-700">
              <Icon icon="mdi:flask-outline" /> Mode contoh
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon icon="mdi:book-multiple-outline" width={16} height={16} />
            {total} kelas
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={semester}
            onChange={changeSemester}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-primary-400 focus:outline-none"
          >
            <option value="">Semua Semester</option>
            {semesterOptions.map((s) => (
              <option key={s} value={s}>
                {semesterLabel(s)}
              </option>
            ))}
          </select>

          <form onSubmit={submitSearch} className="relative">
            <Icon
              icon="mdi:magnify"
              width={18}
              height={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari matakuliah / kelas…"
              className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-primary-400 focus:outline-none sm:w-64"
            />
          </form>
        </div>
      </div>

      {/* Konten */}
      {isLoading ? (
        <ClassGridSkeleton />
      ) : classes.length === 0 ? (
        <EmptyState hasFilter={hasFilter} onReset={resetFilter} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((kelas) => (
            <ClassCard key={kelas.kelasKuliahId} kelas={kelas} basePath={basePath} demo={demo} />
          ))}
        </div>
      )}

      {/* Paginasi sederhana */}
      {totalPage > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition enabled:hover:bg-gray-50 disabled:opacity-40"
          >
            <Icon icon="mdi:chevron-left" width={18} height={18} /> Sebelumnya
          </button>
          <span className="text-sm text-gray-500">
            Hal {page} / {totalPage}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            disabled={page >= totalPage}
            className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition enabled:hover:bg-gray-50 disabled:opacity-40"
          >
            Berikutnya <Icon icon="mdi:chevron-right" width={18} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function ClassGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="h-24 animate-pulse bg-gray-200" />
          <div className="space-y-2 p-5">
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-3 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilter, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
      <Icon icon="mdi:book-search-outline" width={48} height={48} className="text-gray-300" />
      <p className="font-medium text-gray-500">
        {hasFilter ? "Tidak ada kelas yang cocok dengan filter." : "Belum ada kelas untuk Anda."}
      </p>
      {hasFilter ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Reset filter
        </button>
      ) : (
        <p className="text-sm text-gray-400">
          Kelas akan muncul di sini setelah data SIAK tersinkron untuk akun Anda.
        </p>
      )}
    </div>
  );
}
