import useSWR from "swr";
import axios from "axios";

/**
 * Repo LMS (Modul Pembelajaran) — lapisan akses data ke backend tias-backend (`/lms`).
 * Token JWT dilampirkan global oleh useUser (`axios.defaults.headers.common['token']`),
 * jadi hook SWR di sini cukup memakai fetcher global (lihat _app.jsx).
 *
 * Catatan: backend `GET /lms/sections?kelasKuliahId=` sudah menyertakan `content_items`
 * tiap section (urut posisi), jadi satu panggilan = topik + item.
 */

const LMS_BASE = () => `${process.env.NEXT_PUBLIC_API_URL}/lms`;

/**
 * Daftar kelas LMS (pintu masuk) — `GET /lms/classes`. Backend yang memfilter sesuai
 * role/scope user (dosen pengampu, mahasiswa terdaftar, admin scope). FE hanya UX.
 *
 * Respons backend: { limit, page, total, total_page, rows: [...] }.
 *
 * @param {object} params { semester, search, page, limit, enabled }
 *  - enabled=false → SWR tidak fetch (dipakai mode contoh/?demo=1 yang memakai data lokal).
 */
export function useLmsClasses({ semester, search, page = 1, limit = 12, enabled = true } = {}) {
  const qs = new URLSearchParams();
  if (semester) qs.set("semester", semester);
  if (search) qs.set("search", search);
  qs.set("page", page);
  qs.set("limit", limit);

  const url = enabled ? `${LMS_BASE()}/classes?${qs.toString()}` : null;
  const { data, error, isLoading, mutate } = useSWR(url);

  // Fetcher global mengembalikan `response.data` (objek paginasi) atau objek error → jaga aman.
  const payload = data && Array.isArray(data.rows) ? data : null;

  return {
    classes: payload?.rows || [],
    total: payload?.total || 0,
    page: payload?.page || page,
    totalPage: payload?.total_page || 0,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Daftar topik (section) beserta item-nya untuk satu kelas.
 * `kelasKuliahId` null/kosong → SWR tidak fetch (mencegah panggilan tanpa konteks kelas).
 */
export function useLmsSections(kelasKuliahId) {
  const url = kelasKuliahId
    ? `${LMS_BASE()}/sections?kelasKuliahId=${encodeURIComponent(kelasKuliahId)}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(url);

  // Fetcher repo bisa mengembalikan objek error (bukan array) saat gagal → jaga tetap array.
  const sections = Array.isArray(data) ? data : [];

  return { sections, error, isLoading, mutate };
}

/**
 * Ambil file LMS (PDF/PPT) dari endpoint BEROTORISASI `GET /lms/files/:id` sebagai Blob.
 *
 * ⚠️ Endpoint ini butuh header JWT `token`, jadi TIDAK bisa dipakai lewat `<iframe src>`
 * polos (browser tak mengirim header kustom). Caranya: Axios GET responseType "blob"
 * (header `token` sudah disuntik global oleh useUser) → buat object URL di komponen →
 * render (PDF di iframe blob) / unduh (PPT). Object URL WAJIB di-revoke saat unmount.
 *
 * @returns {Promise<Blob>}
 */
export async function fetchLmsFileBlob(itemId) {
  const res = await axios.get(`${LMS_BASE()}/files/${itemId}`, { responseType: "blob" });
  return res.data;
}

/* ----------------------------- MUTASI (sisi dosen) ----------------------------- */
// Semua memakai axios global (header JWT `token` sudah disuntik useUser). Mengembalikan
// body respons backend: { isSuccess, statusCode, responseMessage, data }.

// Topik (section)
export async function createSection(payload) {
  const res = await axios.post(`${LMS_BASE()}/sections`, payload);
  return res.data;
}
export async function updateSection(id, payload) {
  const res = await axios.put(`${LMS_BASE()}/sections/${id}`, payload);
  return res.data;
}
export async function deleteSection(id) {
  const res = await axios.delete(`${LMS_BASE()}/sections/${id}`);
  return res.data;
}

// Item/aktivitas
export async function createItem(sectionId, payload) {
  const res = await axios.post(`${LMS_BASE()}/sections/${sectionId}/items`, payload);
  return res.data;
}
// Tipe berbasis file (pdf/ppt): multipart ke endpoint upload. `formData` berisi
// field: file, type, title, is_published. axios menyetel Content-Type multipart otomatis.
export async function uploadItem(sectionId, formData) {
  const res = await axios.post(`${LMS_BASE()}/sections/${sectionId}/items/upload`, formData);
  return res.data;
}
export async function updateItem(id, payload) {
  const res = await axios.put(`${LMS_BASE()}/items/${id}`, payload);
  return res.data;
}
export async function deleteItem(id) {
  const res = await axios.delete(`${LMS_BASE()}/items/${id}`);
  return res.data;
}

// Urut ulang. `items` = [{ id, position }]. Backend men-scope ke kelas/section terverifikasi.
export async function reorderSections(kelasKuliahId, items) {
  const res = await axios.patch(`${LMS_BASE()}/sections/reorder`, { kelasKuliahId, items });
  return res.data;
}
export async function reorderItems(sectionId, items) {
  const res = await axios.patch(`${LMS_BASE()}/sections/${sectionId}/items/reorder`, { items });
  return res.data;
}

export { LMS_BASE };
