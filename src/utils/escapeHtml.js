const ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escape nilai untuk aman diselipkan ke string HTML mentah (mis. dipakai
 * bareng document.write()). Non-string dikembalikan apa adanya.
 */
export function escapeHtml(value) {
  if (typeof value !== "string") return value;
  return value.replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}

/**
 * Escape rekursif semua nilai string di dalam objek/array (nested), tanpa
 * mengubah struktur atau tipe non-string. Dipakai untuk membersihkan data
 * dari API sebelum dirakit jadi template HTML mentah untuk cetak/print.
 */
export function escapeHtmlDeep(data) {
  if (typeof data === "string") return escapeHtml(data);
  if (Array.isArray(data)) return data.map(escapeHtmlDeep);
  if (data && typeof data === "object") {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = escapeHtmlDeep(data[key]);
    }
    return result;
  }
  return data;
}
