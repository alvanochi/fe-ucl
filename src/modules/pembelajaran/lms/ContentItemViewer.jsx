import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import { typeMeta } from "./typeMeta";
import UrlRenderer from "./renderers/UrlRenderer";
import VideoRenderer from "./renderers/VideoRenderer";
import PageRenderer from "./renderers/PageRenderer";
import PdfRenderer from "./renderers/PdfRenderer";
import PptRenderer from "./renderers/PptRenderer";
import ForumRenderer from "./renderers/ForumRenderer";
import ExamRenderer from "./renderers/ExamRenderer";
import AssignmentRenderer from "./renderers/AssignmentRenderer";

/**
 * Dispatcher penampil item berdasar tipe. Semua tipe di CONTENT_TYPE_META aktif.
 *
 * `inline`: bila true, chip tipe (header) tidak dirender karena pemanggil (ContentItemRow)
 * sudah menampilkan judul + tipe + deskripsi di atas konten. Dipakai untuk tampilan
 * langsung-terbuka (tanpa modal).
 * `manage`: afordansi dosen pengampu/admin — moderator forum (pin/lock/hapus thread orang
 * lain) di ForumRenderer, antrean+nilai submission di AssignmentRenderer; tipe lain mengabaikannya.
 */
const RENDERERS = {
  url: UrlRenderer,
  video: VideoRenderer,
  page: PageRenderer,
  pdf: PdfRenderer,
  ppt: PptRenderer,
  forum: ForumRenderer,
  exam: ExamRenderer,
  assignment: AssignmentRenderer,
};

const SOON = {};

export default function ContentItemViewer({ item, demo = false, inline = false, manage = false }) {
  if (!item) return null;

  const Renderer = RENDERERS[item.type];
  const meta = typeMeta(item.type);

  return (
    <div className="text-left">
      {/* Chip tipe (disembunyikan saat inline — header sudah menampilkannya) */}
      {!inline && (
        <div className="mb-4 flex justify-center">
          <span className={classNames("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5", meta.bg, meta.color)}>
            <Icon icon={meta.icon} width={16} height={16} />
            {meta.label}
          </span>
        </div>
      )}

      {Renderer ? (
        <Renderer item={item} demo={demo} manage={manage} />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Icon icon="mdi:progress-clock" width={44} height={44} className="text-gray-300" />
          <p className="text-sm text-gray-500">{SOON[item.type] || "Penampil untuk tipe ini menyusul."}</p>
        </div>
      )}
    </div>
  );
}
