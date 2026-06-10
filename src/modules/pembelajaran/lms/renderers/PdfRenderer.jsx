import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { fetchLmsFileBlob } from "../../../../repo/lms";

/**
 * Renderer tipe PDF (SPEC v6 §5.3) — file di balik endpoint berotorisasi `GET /lms/files/:id`.
 *
 * ⚠️ TIDAK memakai <iframe src="/lms/files/:id"> langsung (browser tak mengirim header JWT
 * `token`). Alur: Axios GET responseType blob → URL.createObjectURL → render di <iframe>
 * (PDF viewer bawaan browser). Object URL di-revoke saat unmount agar tak bocor memori.
 */
export default function PdfRenderer({ item, demo = false }) {
  const [state, setState] = useState({ loading: true, url: null, error: null });
  const fileName = item?.payload?.file_name || "dokumen.pdf";

  useEffect(() => {
    if (demo) {
      setState({ loading: false, url: null, error: "demo" });
      return;
    }
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

  if (state.loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-primary-600">
        <Icon icon="mdi:loading" className="animate-spin" width={26} height={26} />
        <span className="font-medium">Memuat dokumen…</span>
      </div>
    );
  }

  if (state.error === "demo") {
    return <FilePlaceholder icon="mdi:file-pdf-box" color="text-red-600" fileName={fileName} note="Pratinjau PDF memerlukan backend (mode contoh)." />;
  }

  if (state.error) {
    return <FilePlaceholder icon="mdi:file-alert-outline" color="text-danger-600" fileName={fileName} note="Gagal memuat dokumen. Pastikan Anda punya akses & coba lagi." />;
  }

  return (
    <div className="space-y-3">
      <iframe src={state.url} title={fileName} className="h-[70vh] w-full rounded-xl border border-gray-200" />
      <a
        href={state.url}
        download={fileName}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Icon icon="mdi:download" width={18} height={18} />
        Unduh {fileName}
      </a>
    </div>
  );
}

function FilePlaceholder({ icon, color, fileName, note }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-12 text-center">
      <Icon icon={icon} width={48} height={48} className={color} />
      <p className="font-medium text-gray-700">{fileName}</p>
      <p className="text-sm text-gray-400">{note}</p>
    </div>
  );
}
