import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { fetchLmsFileBlob } from "../../../../repo/lms";

/**
 * Renderer tipe PPT (SPEC v6 §5.2) — file di balik endpoint berotorisasi `GET /lms/files/:id`.
 *
 * Tidak ada preview inline yang andal untuk pptx di browser → sediakan tombol UNDUH dari
 * blob berotorisasi (Axios → blob → object URL → <a download>). Object URL di-revoke saat
 * unmount. (Sama seperti PDF, header JWT tak bisa lewat <iframe>/<a href> ke endpoint.)
 */
export default function PptRenderer({ item, demo = false }) {
  const [state, setState] = useState({ loading: !demo, url: null, error: demo ? "demo" : null });
  const fileName = item?.payload?.file_name || "presentasi.pptx";

  useEffect(() => {
    if (demo) return;
    let objUrl;
    let cancelled = false;
    setState({ loading: true, url: null, error: null });

    fetchLmsFileBlob(item.id)
      .then((blob) => {
        if (cancelled) return;
        objUrl = URL.createObjectURL(blob);
        setState({ loading: false, url: objUrl, error: null });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, url: null, error: "gagal" });
      });

    return () => {
      cancelled = true;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [item.id, demo]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-12 text-center">
      <Icon icon="mdi:file-powerpoint-box" width={52} height={52} className="text-orange-600" />
      <p className="font-medium text-gray-700">{fileName}</p>

      {state.loading && (
        <span className="inline-flex items-center gap-2 text-sm text-primary-600">
          <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} /> Menyiapkan berkas…
        </span>
      )}

      {state.error === "demo" && (
        <p className="text-sm text-gray-400">Unduhan presentasi memerlukan backend (mode contoh).</p>
      )}

      {state.error === "gagal" && (
        <p className="text-sm text-danger-600">Gagal menyiapkan berkas. Pastikan Anda punya akses & coba lagi.</p>
      )}

      {state.url && (
        <a
          href={state.url}
          download={fileName}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Icon icon="mdi:download" width={18} height={18} />
          Unduh Presentasi
        </a>
      )}
    </div>
  );
}
