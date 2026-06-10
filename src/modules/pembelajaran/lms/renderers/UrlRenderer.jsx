import { Icon } from "@iconify-icon/react";

/**
 * Renderer tipe URL (SPEC v6 §5.5) — payload { url, label, open_in_new_tab }.
 * Backend sudah memvalidasi skema http/https. Tautan eksternal dibuka dengan
 * rel="noopener noreferrer" (cegah tabnabbing).
 */
export default function UrlRenderer({ item }) {
  const { url, label, open_in_new_tab = true } = item.payload || {};

  if (!url) {
    return <p className="text-sm text-gray-400">Tautan belum diisi.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          <Icon icon="mdi:link-variant" width={24} height={24} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800">{label || url}</p>
          <p className="truncate text-xs text-gray-400">{url}</p>
        </div>
      </div>

      <a
        href={url}
        target={open_in_new_tab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
      >
        <Icon icon="mdi:open-in-new" width={18} height={18} />
        Buka Tautan
      </a>
    </div>
  );
}
