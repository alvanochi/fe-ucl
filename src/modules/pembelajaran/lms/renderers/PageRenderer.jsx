import { useMemo } from "react";
import DOMPurify from "dompurify";

/**
 * Renderer tipe Page (SPEC v6 §5.1) — payload { html }.
 *
 * ⚠️ Pertahanan berlapis: backend SUDAH menyanitasi HTML, tetapi frontend WAJIB
 * menyanitasi ULANG dengan DOMPurify SEBELUM render (defense-in-depth terhadap stored XSS).
 * DOMPurify butuh DOM → hanya jalan di sisi klien; di server kembalikan string kosong
 * (modal penampil ini memang dibuka setelah interaksi klik, bukan SSR konten).
 *
 * Ditampilkan dalam container `prose` (Tailwind typography) agar rapi terbaca.
 */
export default function PageRenderer({ item }) {
  const html = item?.payload?.html || "";

  const clean = useMemo(() => {
    if (typeof window === "undefined" || !html) return "";
    return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
  }, [html]);

  if (!html) {
    return <p className="text-sm text-gray-400">Halaman masih kosong.</p>;
  }

  return (
    <div
      className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-800 prose-a:text-primary-600"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
