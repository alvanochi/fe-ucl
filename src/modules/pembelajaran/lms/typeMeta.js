/**
 * Metadata per tipe item LMS (SPEC v6 §5): ikon, label, & warna aksen.
 * Dipakai untuk ikon per tipe di daftar item ala SPADA. Renderer detail = langkah berikutnya.
 */
export const CONTENT_TYPE_META = {
  page: { label: "Halaman", icon: "mdi:file-document-outline", color: "text-sky-600", bg: "bg-sky-100", desc: "Materi bacaan berupa halaman teks yang bisa memuat gambar dan tautan." },
  pdf: { label: "PDF", icon: "mdi:file-pdf-box", color: "text-red-600", bg: "bg-red-100", desc: "Dokumen PDF yang dapat dibaca langsung atau diunduh." },
  ppt: { label: "Presentasi", icon: "mdi:file-powerpoint-box", color: "text-orange-600", bg: "bg-orange-100", desc: "Slide presentasi (PowerPoint) untuk diunduh." },
  video: { label: "Video", icon: "mdi:youtube", color: "text-rose-600", bg: "bg-rose-100", desc: "Video pembelajaran (YouTube) yang diputar langsung di halaman." },
  url: { label: "Tautan", icon: "mdi:link-variant", color: "text-indigo-600", bg: "bg-indigo-100", desc: "Tautan ke sumber belajar di luar kelas (web, drive, dll)." },
  forum: { label: "Forum Diskusi", icon: "mdi:forum-outline", color: "text-emerald-600", bg: "bg-emerald-100", desc: "Ruang diskusi tanya-jawab antara dosen dan mahasiswa." },
  assignment: { label: "Tugas", icon: "mdi:clipboard-text-outline", color: "text-amber-600", bg: "bg-amber-100", desc: "Tugas yang dikerjakan lalu dikumpulkan oleh mahasiswa." },
  exam: { label: "Ujian", icon: "mdi:clipboard-check-outline", color: "text-purple-600", bg: "bg-purple-100", desc: "Ujian atau kuis daring (CBT)." },
};

const FALLBACK = {
  label: "Item",
  icon: "mdi:help-circle-outline",
  color: "text-gray-500",
  bg: "bg-gray-100",
  desc: "Aktivitas atau sumber pembelajaran.",
};

export const typeMeta = (type) => CONTENT_TYPE_META[type] || { ...FALLBACK, label: type || FALLBACK.label };

// Tipe yang boleh dibuat dosen di langkah editor.
export const CREATABLE_TYPES = ["page", "url", "video", "pdf", "ppt", "forum", "assignment", "exam"];
