/**
 * Metadata per tipe item LMS (SPEC v6 §5): ikon, label, & warna aksen.
 * Dipakai untuk ikon per tipe di daftar item ala SPADA. Renderer detail = langkah berikutnya.
 */
export const CONTENT_TYPE_META = {
  page: { label: "Halaman", icon: "mdi:file-document-outline", color: "text-sky-600", bg: "bg-sky-100" },
  pdf: { label: "PDF", icon: "mdi:file-pdf-box", color: "text-red-600", bg: "bg-red-100" },
  ppt: { label: "Presentasi", icon: "mdi:file-powerpoint-box", color: "text-orange-600", bg: "bg-orange-100" },
  video: { label: "Video", icon: "mdi:youtube", color: "text-rose-600", bg: "bg-rose-100" },
  url: { label: "Tautan", icon: "mdi:link-variant", color: "text-indigo-600", bg: "bg-indigo-100" },
  forum: { label: "Forum Diskusi", icon: "mdi:forum-outline", color: "text-emerald-600", bg: "bg-emerald-100" },
  assignment: { label: "Tugas", icon: "mdi:clipboard-text-outline", color: "text-amber-600", bg: "bg-amber-100" },
  exam: { label: "Ujian", icon: "mdi:clipboard-check-outline", color: "text-purple-600", bg: "bg-purple-100" },
};

const FALLBACK = {
  label: "Item",
  icon: "mdi:help-circle-outline",
  color: "text-gray-500",
  bg: "bg-gray-100",
};

export const typeMeta = (type) => CONTENT_TYPE_META[type] || { ...FALLBACK, label: type || FALLBACK.label };

// Tipe yang boleh dibuat dosen di langkah editor (exam ditunda ke CBT — paling akhir).
export const CREATABLE_TYPES = ["page", "url", "video", "pdf", "ppt", "forum", "assignment"];
