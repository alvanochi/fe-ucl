import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import TopicCard from "./TopicCard";
import TopicSkeleton from "./Skeleton";
import TopicEditorModal from "./TopicEditorModal";
import ItemEditorModal from "./ItemEditorModal";
import { SAMPLE_SECTIONS } from "./sampleData";
import {
  useLmsSections,
  deleteSection,
  deleteItem,
  reorderSections,
  reorderItems,
} from "../../../repo/lms";
import { toastAlert, warningAlert } from "../../../lib/sweetalert";

/**
 * Modul Pembelajaran (LMS) — tampilan kelas ala SPADA: daftar topik vertikal bertumpuk,
 * tiap topik berisi item dengan ikon per tipe.
 *
 * KERANGKA (langkah 1): struktur + mode dosen (kelola) vs mahasiswa (baca). Renderer
 * konten per tipe (langkah 2), editor (langkah 3), dan forum (langkah 4) menyusul — aksi
 * kelola & buka item di sini masih placeholder agar bisa dinilai secara visual lebih dulu.
 *
 * props:
 *  - kelasKuliahId: string (UUID kelas SIAK v2)
 *  - canManage: boolean (dosen pengampu / admin)
 *  - demo: boolean (pakai data contoh untuk pratinjau, ?demo=1)
 */
export default function KelasLmsModule({ kelasKuliahId, canManage = false, demo = false }) {
  const [previewAsStudent, setPreviewAsStudent] = useState(false);
  const [topicEditor, setTopicEditor] = useState({ open: false, section: null });
  const [itemEditor, setItemEditor] = useState({ open: false, sectionId: null, item: null });
  const [collapsedIds, setCollapsedIds] = useState(() => new Set()); // kosong = semua terbuka
  const { sections: liveSections, isLoading, mutate } = useLmsSections(demo ? null : kelasKuliahId);

  const sections = demo ? SAMPLE_SECTIONS : liveSections;
  const manage = canManage && !previewAsStudent;

  // Mode baca (mahasiswa / pratinjau mahasiswa): hanya topik & aktivitas yang TERBIT.
  // Catatan: backend `GET /lms/sections` belum memfilter is_published per role, jadi
  // penyaringan tampilan dilakukan di sini. (Hardening backend = pekerjaan lanjutan.)
  const visibleSections = manage
    ? sections
    : sections
        .filter((s) => s.is_published)
        .map((s) => ({
          ...s,
          content_items: (s.content_items || []).filter((i) => i.is_published),
        }));

  const totalItems = visibleSections.reduce((a, s) => a + (s.content_items?.length || 0), 0);
  const anyOpen = visibleSections.some((s) => !collapsedIds.has(s.id));

  const refresh = () => mutate && mutate();

  const toggleTopic = (id) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () => setCollapsedIds(anyOpen ? new Set(visibleSections.map((s) => s.id)) : new Set());

  // Buka editor boleh di mode contoh (untuk pratinjau form); penyimpanan diblokir di editor.
  const addTopic = () => setTopicEditor({ open: true, section: null });
  const editTopic = (section) => setTopicEditor({ open: true, section });
  const addItem = (section) => setItemEditor({ open: true, sectionId: section.id, item: null });
  const editItem = (item) => setItemEditor({ open: true, sectionId: item.section_id, item });

  // Aksi yang butuh id/backend nyata (hapus, reorder) diblokir di mode contoh.
  const guard = (fn) => (...args) => {
    if (demo) return toastAlert("info", "Aksi ini nonaktif di mode contoh.");
    return fn(...args);
  };

  const removeTopic = guard((section) =>
    warningAlert(async () => {
      try {
        const res = await deleteSection(section.id);
        if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal menghapus.");
        await refresh();
        toastAlert("success", "Topik dihapus.");
      } catch (e) {
        toastAlert("error", e?.response?.data?.responseMessage || "Gagal menghapus topik.");
      }
    }, "Topik beserta seluruh isinya akan dihapus.")
  );

  const removeItem = guard((item) =>
    warningAlert(async () => {
      try {
        const res = await deleteItem(item.id);
        if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal menghapus.");
        await refresh();
        toastAlert("success", "Item dihapus.");
      } catch (e) {
        toastAlert("error", e?.response?.data?.responseMessage || "Gagal menghapus item.");
      }
    }, "Item ini akan dihapus.")
  );

  const moveTopic = guard(async (section, dir) => {
    const idx = sections.findIndex((s) => s.id === section.id);
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= sections.length) return;
    const arr = [...sections];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    try {
      const res = await reorderSections(kelasKuliahId, arr.map((s, i) => ({ id: s.id, position: i })));
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal mengurutkan.");
      await refresh();
    } catch (e) {
      toastAlert("error", e?.response?.data?.responseMessage || "Gagal mengurutkan topik.");
    }
  });

  const reorderItemsH = guard(async (sectionId, payload) => {
    try {
      const res = await reorderItems(sectionId, payload);
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal mengurutkan.");
      await refresh();
    } catch (e) {
      toastAlert("error", e?.response?.data?.responseMessage || "Gagal mengurutkan item.");
    }
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {demo && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary-100 px-2 py-1 font-medium text-secondary-700">
              <Icon icon="mdi:flask-outline" /> Mode contoh
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Icon icon="mdi:folder-multiple-outline" width={16} height={16} /> {sections.length} topik
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Icon icon="mdi:file-multiple-outline" width={16} height={16} /> {totalItems} aktivitas
          </span>
        </div>

        <div className="flex items-center gap-2">
          {visibleSections.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <Icon icon={anyOpen ? "mdi:unfold-less-horizontal" : "mdi:unfold-more-horizontal"} width={18} height={18} />
              {anyOpen ? "Tutup semua" : "Buka semua"}
            </button>
          )}

          {canManage && (
            <>
              <button
                type="button"
                onClick={() => setPreviewAsStudent((v) => !v)}
                className={classNames(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition",
                  previewAsStudent
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
                title="Lihat sebagaimana mahasiswa melihatnya"
              >
                <Icon icon={previewAsStudent ? "mdi:eye-check-outline" : "mdi:eye-outline"} width={18} height={18} />
                <span className="hidden sm:inline">{previewAsStudent ? "Pratinjau mahasiswa" : "Pratinjau sebagai mahasiswa"}</span>
              </button>
              <button
                type="button"
                onClick={addTopic}
                className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
              >
                <Icon icon="mdi:plus" width={18} height={18} />
                Tambah Topik
              </button>
            </>
          )}
        </div>
      </div>

      {/* Konten */}
      {isLoading && !demo ? (
        <TopicSkeleton count={3} />
      ) : visibleSections.length === 0 ? (
        <EmptyState canManage={manage} onAdd={addTopic} />
      ) : (
        <div className="space-y-4">
          {visibleSections.map((section, idx) => (
            <TopicCard
              key={section.id}
              section={section}
              manage={manage}
              demo={demo}
              open={!collapsedIds.has(section.id)}
              onToggle={() => toggleTopic(section.id)}
              onAddItem={addItem}
              onEditTopic={editTopic}
              onDeleteTopic={removeTopic}
              onMoveTopic={(dir) => moveTopic(section, dir)}
              onEditItem={editItem}
              onDeleteItem={removeItem}
              onReorderItems={reorderItemsH}
              isFirst={idx === 0}
              isLast={idx === visibleSections.length - 1}
            />
          ))}
        </div>
      )}

      {/* Editor topik & item (langkah 3) */}
      <TopicEditorModal
        open={topicEditor.open}
        onClose={() => setTopicEditor({ open: false, section: null })}
        kelasKuliahId={kelasKuliahId}
        section={topicEditor.section}
        onSaved={refresh}
        demo={demo}
      />
      <ItemEditorModal
        open={itemEditor.open}
        onClose={() => setItemEditor({ open: false, sectionId: null, item: null })}
        sectionId={itemEditor.sectionId}
        item={itemEditor.item}
        onSaved={refresh}
        demo={demo}
      />
    </div>
  );
}

function EmptyState({ canManage, onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
      <Icon icon="mdi:book-open-page-variant-outline" width={48} height={48} className="text-gray-300" />
      <p className="font-medium text-gray-500">Belum ada topik pada kelas ini.</p>
      {canManage ? (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Icon icon="mdi:plus" width={18} height={18} /> Buat Topik Pertama
        </button>
      ) : (
        <p className="text-sm text-gray-400">Materi akan tampil di sini setelah dosen menambahkannya.</p>
      )}
    </div>
  );
}
