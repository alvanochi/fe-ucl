import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import ContentItemRow from "./ContentItemRow";
import { typeMeta } from "./typeMeta";

/**
 * Satu "topik" (section) bertumpuk vertikal ala SPADA — sekarang dapat di-collapse.
 * Header bisa diklik untuk buka/tutup; saat tertutup tampil ringkasan (jumlah & ikon tipe).
 *
 * props:
 *  - section, manage, demo, open (controlled), onToggle
 *  - onAddItem, onEditTopic, onDeleteTopic, onMoveTopic(dir)
 *  - onEditItem, onDeleteItem, onReorderItems(sectionId, payload)
 *  - isFirst, isLast (batas reorder topik)
 *
 * Aktivitas di dalam topik tampil LANGSUNG (inline) — tidak ada pop-up/modal lagi.
 */
export default function TopicCard({
  section,
  manage = false,
  demo = false,
  open = true,
  onToggle,
  onAddItem,
  onEditTopic,
  onDeleteTopic,
  onMoveTopic,
  onEditItem,
  onDeleteItem,
  onReorderItems,
  isFirst,
  isLast,
}) {
  const items = Array.isArray(section.content_items) ? section.content_items : [];
  const typesPresent = [...new Set(items.map((i) => i.type))].slice(0, 6);

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn && fn();
  };

  const moveItem = (index, dir) => {
    const j = dir === "up" ? index - 1 : index + 1;
    if (j < 0 || j >= items.length) return;
    const arr = [...items];
    [arr[index], arr[j]] = [arr[j], arr[index]];
    onReorderItems && onReorderItems(section.id, arr.map((it, i) => ({ id: it.id, position: i })));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Header topik (klik = buka/tutup) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle && onToggle()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle && onToggle()}
        className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-white"
      >
        <Icon
          icon="mdi:chevron-down"
          width={24}
          height={24}
          className={classNames("shrink-0 transition-transform duration-300", open ? "rotate-0" : "-rotate-90")}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {section.pertemuan != null && (
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold">Pertemuan {section.pertemuan}</span>
            )}
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs">
              <Icon icon="mdi:file-multiple-outline" width={13} height={13} /> {items.length} aktivitas
            </span>
            {manage && !section.is_published && (
              <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Belum terbit</span>
            )}
          </div>
          <h3 className="mt-1 truncate text-lg font-bold">{section.title}</h3>

          {/* Ringkasan tipe saat tertutup */}
          {!open && typesPresent.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-white/80">
              {typesPresent.map((t) => (
                <Icon key={t} icon={typeMeta(t).icon} width={16} height={16} title={typeMeta(t).label} />
              ))}
            </div>
          )}
        </div>

        {manage && (
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={stop(() => onMoveTopic && onMoveTopic("up"))} disabled={isFirst} className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-30" title="Naikkan topik">
              <Icon icon="mdi:arrow-up" width={17} height={17} />
            </button>
            <button type="button" onClick={stop(() => onMoveTopic && onMoveTopic("down"))} disabled={isLast} className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-30" title="Turunkan topik">
              <Icon icon="mdi:arrow-down" width={17} height={17} />
            </button>
            <span className="mx-1 h-5 w-px bg-white/20" />
            <button type="button" onClick={stop(() => onEditTopic && onEditTopic(section))} className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white" title="Edit topik">
              <Icon icon="mdi:pencil-outline" width={18} height={18} />
            </button>
            <button type="button" onClick={stop(() => onDeleteTopic && onDeleteTopic(section))} className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white" title="Hapus topik">
              <Icon icon="mdi:trash-can-outline" width={18} height={18} />
            </button>
          </div>
        )}
      </div>

      {/* Isi topik — animasi collapse via grid-rows */}
      <div className={classNames("grid transition-all duration-300 ease-in-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-2 px-4 py-4">
            {section.description && <p className="mb-3 text-sm text-gray-500">{section.description}</p>}

            {items.length === 0 && (
              <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">
                Belum ada aktivitas atau sumber pada topik ini.
              </p>
            )}

            {items.map((item, idx) => (
              <ContentItemRow
                key={item.id}
                item={item}
                manage={manage}
                demo={demo}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onMove={(dir) => moveItem(idx, dir)}
                isFirst={idx === 0}
                isLast={idx === items.length - 1}
              />
            ))}

            {manage && (
              <button
                type="button"
                onClick={() => onAddItem && onAddItem(section)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-200 py-2.5 text-sm font-medium text-primary-600 transition hover:border-primary-400 hover:bg-primary-50"
              >
                <Icon icon="mdi:plus" width={20} height={20} />
                Tambah aktivitas / sumber
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
