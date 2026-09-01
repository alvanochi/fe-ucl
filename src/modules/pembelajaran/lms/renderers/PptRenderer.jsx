import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { fetchLmsFileBlob, fetchLmsFilePreviewBlob } from "../../../../repo/lms";

/**
 * Renderer tipe PPT (SPEC v6 §5.2) — file di balik endpoint berotorisasi `GET /lms/files/:id`.
 *
 * Backend sekarang meng-convert ppt/pptx ke PDF saat upload (best-effort, lihat
 * controllers/lms/fileController.js di tias-backend) dan menyajikannya lewat
 * `GET /lms/files/:id/preview`. Jadi alurnya sama seperti PdfRenderer: Axios GET
 * responseType blob → object URL → <iframe> (PDF viewer bawaan browser).
 *
 * FALLBACK: kalau preview 404 (item lama sebelum fitur ini ada, atau konversi gagal di
 * backend), turun ke tombol unduh berkas asli seperti perilaku lama — supaya tidak dead-end.
 * Object URL di-revoke saat unmount. (Header JWT tak bisa lewat <iframe src>/<a href>
 * langsung ke endpoint, makanya selalu lewat blob dulu — sama seperti PDF.)
 */
export default function PptRenderer({ item, demo = false }) {
  const [state, setState] = useState({ loading: !demo, mode: null, url: null, error: demo ? "demo" : null });
  const fileName = item?.payload?.file_name || "presentasi.pptx";

  useEffect(() => {
    if (demo) return;
    let objUrl;
    let cancelled = false;
    setState({ loading: true, mode: null, url: null, error: null });

    fetchLmsFilePreviewBlob(item.id)
      .then((blob) => {
        if (cancelled) return;
        objUrl = URL.createObjectURL(blob);
        setState({ loading: false, mode: "preview", url: objUrl, error: null });
      })
      .catch(() =>
        // Preview belum tersedia (konversi gagal / item lama) — fallback ke unduh berkas asli.
        fetchLmsFileBlob(item.id)
          .then((blob) => {
            if (cancelled) return;
            objUrl = URL.createObjectURL(blob);
            setState({ loading: false, mode: "download", url: objUrl, error: null });
          })
          .catch(() => {
            if (!cancelled) setState({ loading: false, mode: null, url: null, error: "gagal" });
          })
      );

    return () => {
      cancelled = true;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [item.id, demo]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-primary-600">
        <Icon icon="mdi:loading" className="animate-spin" width={26} height={26} />
        <span className="font-medium">Menyiapkan presentasi…</span>
      </div>
    );
  }

  if (state.error === "demo") {
    return <FilePlaceholder fileName={fileName} note="Pratinjau presentasi memerlukan backend (mode contoh)." />;
  }

  if (state.error) {
    return <FilePlaceholder fileName={fileName} note="Gagal menyiapkan berkas. Pastikan Anda punya akses & coba lagi." isError />;
  }

  if (state.mode === "preview") {
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

  // mode === "download": preview belum tersedia, tampilkan tombol unduh saja (perilaku lama).
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-12 text-center">
      <Icon icon="mdi:file-powerpoint-box" width={52} height={52} className="text-orange-600" />
      <p className="font-medium text-gray-700">{fileName}</p>
      <p className="text-sm text-gray-400">Pratinjau belum tersedia untuk berkas ini.</p>
      <a
        href={state.url}
        download={fileName}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
      >
        <Icon icon="mdi:download" width={18} height={18} />
        Unduh Presentasi
      </a>
    </div>
  );
}

function FilePlaceholder({ fileName, note, isError = false }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-12 text-center">
      <Icon
        icon={isError ? "mdi:file-alert-outline" : "mdi:file-powerpoint-box"}
        width={48}
        height={48}
        className={isError ? "text-danger-600" : "text-orange-600"}
      />
      <p className="font-medium text-gray-700">{fileName}</p>
      <p className="text-sm text-gray-400">{note}</p>
    </div>
  );
}
