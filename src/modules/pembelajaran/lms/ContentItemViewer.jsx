import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import { typeMeta } from "./typeMeta";
import UrlRenderer from "./renderers/UrlRenderer";
import VideoRenderer from "./renderers/VideoRenderer";
import PageRenderer from "./renderers/PageRenderer";
import PdfRenderer from "./renderers/PdfRenderer";
import PptRenderer from "./renderers/PptRenderer";

/**
 * Dispatcher penampil item berdasar tipe (dipakai di dalam Modal). Langkah 2:
 * page/url/video/pdf/ppt aktif. forum (langkah 4), assignment & exam (kemudian) → placeholder.
 */
const RENDERERS = {
  url: UrlRenderer,
  video: VideoRenderer,
  page: PageRenderer,
  pdf: PdfRenderer,
  ppt: PptRenderer,
};

const SOON = {
  forum: "Forum diskusi akan tersedia di langkah berikutnya.",
  assignment: "Tugas (assignment) menyusul.",
  exam: "Ujian (CBT) ditangani modul terpisah, menyusul.",
};

export default function ContentItemViewer({ item, demo = false }) {
  if (!item) return null;

  const Renderer = RENDERERS[item.type];
  const meta = typeMeta(item.type);

  return (
    <div className="text-left">
      {/* Chip tipe (judul sudah di header modal) */}
      <div className="mb-4 flex justify-center">
        <span className={classNames("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5", meta.bg, meta.color)}>
          <Icon icon={meta.icon} width={16} height={16} />
          {meta.label}
        </span>
      </div>

      {Renderer ? (
        <Renderer item={item} demo={demo} />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Icon icon="mdi:progress-clock" width={44} height={44} className="text-gray-300" />
          <p className="text-sm text-gray-500">{SOON[item.type] || "Penampil untuk tipe ini menyusul."}</p>
        </div>
      )}
    </div>
  );
}
