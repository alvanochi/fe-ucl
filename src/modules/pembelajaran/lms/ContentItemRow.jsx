import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import { typeMeta } from "./typeMeta";
import ContentItemViewer from "./ContentItemViewer";

/**
 * Satu aktivitas/sumber di dalam topik — TAMPIL LANGSUNG (tanpa pop-up/modal), namun bisa
 * di-collapse per aktivitas (default terbuka) agar topik dengan banyak materi tetap ringkas.
 *
 * Header: ikon tipe + judul + label tipe + deskripsi (deskripsi dosen bila ada, jika tidak
 * memakai keterangan jenis aktivitas). Di bawahnya konten di-render inline.
 *
 * props:
 *  - item, manage, demo
 *  - onEdit, onDelete
 *  - onMove(dir): "up" | "down" — urut ulang (mode kelola)
 *  - isFirst, isLast: untuk menonaktifkan tombol batas
 */
export default function ContentItemRow({ item, manage = false, demo = false, onEdit, onDelete, onMove, isFirst, isLast }) {
  const meta = typeMeta(item.type);
  const [open, setOpen] = useState(true);

  // Deskripsi dosen (item.description) diprioritaskan; fallback ke keterangan jenis aktivitas.
  const description = item.description && item.description.trim() ? item.description : meta.desc;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      {/* Header aktivitas */}
      <div className="flex items-start gap-3 border-b border-gray-50 bg-gray-50/60 px-3 py-2.5">
        {manage && (
          <div className="flex flex-col pt-1">
            <button
              type="button"
              onClick={() => onMove && onMove("up")}
              disabled={isFirst}
              className="text-gray-300 transition hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-300"
              title="Naikkan"
            >
              <Icon icon="mdi:chevron-up" width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={() => onMove && onMove("down")}
              disabled={isLast}
              className="-mt-1 text-gray-300 transition hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-300"
              title="Turunkan"
            >
              <Icon icon="mdi:chevron-down" width={18} height={18} />
            </button>
          </div>
        )}

        {/* Area judul = tombol buka/tutup aktivitas */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className={classNames("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-black/5", meta.bg, meta.color)}>
            <Icon icon={meta.icon} width={22} height={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-800">{item.title}</span>
              <span className={classNames("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", meta.bg, meta.color)}>
                {meta.label}
              </span>
              {manage && !item.is_published && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                  Draft
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          </div>
          <Icon
            icon="mdi:chevron-down"
            width={20}
            height={20}
            className={classNames("mt-1 shrink-0 text-gray-400 transition-transform duration-300", open ? "rotate-0" : "-rotate-90")}
          />
        </button>

        {manage && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit && onEdit(item)}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary-600"
              title="Edit item"
            >
              <Icon icon="mdi:pencil-outline" width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(item)}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-danger-100 hover:text-danger-700"
              title="Hapus item"
            >
              <Icon icon="mdi:trash-can-outline" width={18} height={18} />
            </button>
          </div>
        )}
      </div>

      {/* Konten tampil langsung (inline) — animasi collapse via grid-rows */}
      <div className={classNames("grid transition-all duration-300 ease-in-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="px-4 py-3">
            <ContentItemViewer item={item} demo={demo} manage={manage} inline />
          </div>
        </div>
      </div>
    </div>
  );
}
