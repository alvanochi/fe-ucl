import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import { typeMeta } from "./typeMeta";

/**
 * Satu baris item/aktivitas di dalam topik (ikon per tipe + judul). Ala SPADA.
 *
 * props:
 *  - item, manage
 *  - onOpen, onEdit, onDelete
 *  - onMove(dir): "up" | "down" — urut ulang (mode kelola)
 *  - isFirst, isLast: untuk menonaktifkan tombol batas
 */
export default function ContentItemRow({ item, manage = false, onOpen, onEdit, onDelete, onMove, isFirst, isLast }) {
  const meta = typeMeta(item.type);

  return (
    <div
      className={classNames(
        "group flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-all",
        "border-gray-100 hover:-translate-y-px hover:border-primary-200 hover:shadow-sm"
      )}
    >
      {manage && (
        <div className="flex flex-col">
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

      <span className={classNames("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-black/5", meta.bg, meta.color)}>
        <Icon icon={meta.icon} width={22} height={22} />
      </span>

      <button
        type="button"
        onClick={() => onOpen && onOpen(item)}
        className="flex min-w-0 flex-1 flex-col items-start text-left"
      >
        <span className="flex items-center gap-2 truncate font-medium text-gray-800 group-hover:text-primary-700">
          {item.title}
          {manage && !item.is_published && (
            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
              Draft
            </span>
          )}
        </span>
        <span className="text-xs text-gray-400">{meta.label}</span>
      </button>

      {manage ? (
        <div className="flex items-center gap-1 opacity-100 md:opacity-60 md:group-hover:opacity-100">
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
      ) : (
        <Icon
          icon="mdi:chevron-right"
          width={22}
          height={22}
          className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500"
        />
      )}
    </div>
  );
}
