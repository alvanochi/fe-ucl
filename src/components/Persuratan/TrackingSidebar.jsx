import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Card from "../Card";

export default function TrackingSidebar({ lampirans, trackingList, historyDisposisi, onPreview }) {
  const cleanActorText = (str) => {
    if (!str) return str;
    return str.replace(/\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\s*-\s*/gi, "(");
  };

  const renderCatatanTracking = (text) => {
    if (!text) return "-";
    const parts = text.split(/dilakukan oleh:\s*/i);
    if (parts.length > 1) {
      return (
        <div className="flex flex-col gap-2 mt-1">
          <span className="leading-relaxed text-gray-700 text-sm">{parts[0].trim()}</span>
          <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Icon icon="mdi:account-circle" className="text-gray-500 shrink-0" width={16} />
            <span className="text-[11px] font-bold text-gray-700">{cleanActorText(parts[1].trim())}</span>
          </div>
        </div>
      );
    }
    return <span className="leading-relaxed text-gray-700 text-sm">{text}</span>;
  };

  const getTimelineVisual = (status, text) => {
    const isDisposisi = text?.toLowerCase().includes("disposisi");
    if (isDisposisi) return { icon: "mdi:share-all", color: "bg-indigo-500", border: "border-indigo-100", bgCard: "bg-indigo-50/50" };

    switch (status) {
      case "Sent":
        return { icon: "mdi:send-circle", color: "bg-blue-500", border: "border-blue-100", bgCard: "bg-blue-50/50" };
      case "Read":
        return { icon: "mdi:eye-check", color: "bg-yellow-500", border: "border-yellow-100", bgCard: "bg-yellow-50/50" };
      case "Replied":
        return { icon: "mdi:comment-processing", color: "bg-purple-500", border: "border-purple-100", bgCard: "bg-purple-50/50" };
      case "Selesai":
        return { icon: "mdi:check-decagram", color: "bg-green-500", border: "border-green-100", bgCard: "bg-green-50/50" };
      case "Ditolak":
        return { icon: "mdi:close-octagon", color: "bg-red-500", border: "border-red-100", bgCard: "bg-red-50/50" };
      default:
        return { icon: "mdi:record-circle", color: "bg-gray-500", border: "border-gray-100", bgCard: "bg-gray-50/50" };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-200 shadow-sm overflow-hidden bg-white rounded-3xl">
        <div className="bg-primary-50 border-b-2 border-primary-100 text-primary-700 px-5 sm:px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono">
            <Icon icon="mdi:folder-open" width={20} /> Lampiran
          </span>
          <span className="bg-primary-100 px-3 py-1 rounded-lg text-[10px] font-bold">{lampirans?.length || 0} File</span>
        </div>
        <div className="p-5 sm:p-6 space-y-4 bg-white font-bold max-h-[300px] overflow-y-auto">
          {lampirans?.length === 0 && <p className="text-xs text-center text-gray-400 font-medium py-4">Tidak ada lampiran.</p>}
          {lampirans?.map((file, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl hover:border-primary-200 hover:bg-white transition-all shadow-sm group">
              <div className="flex items-center gap-3 mb-4">
                <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0", file.file_url.endsWith(".pdf") ? "bg-red-50 border-red-100 text-red-500" : "bg-blue-50 border-blue-100 text-blue-500")}>
                  <Icon icon={file.file_url.endsWith(".pdf") ? "mdi:file-pdf-box" : "mdi:image-outline"} width={20} />
                </div>
                <p className="text-xs font-bold text-gray-800 break-all line-clamp-2 leading-snug" title={file.nama_file}>
                  {file.nama_file}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onPreview(file)}
                  className="py-2.5 bg-white text-[10px] font-black border-2 border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition-all active:scale-95 uppercase tracking-wider focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  Preview
                </button>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/lampiran-surat/${file.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="py-2.5 bg-gray-800 text-white text-[10px] font-black rounded-xl text-center shadow-sm hover:bg-black transition-all active:scale-95 uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  Unduh
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky top-6 space-y-6">
        <Card className="border-2 border-gray-200 shadow-sm overflow-hidden bg-white rounded-3xl">
          <div className="bg-gray-800 border-b-2 border-gray-900 text-white px-5 sm:px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono">
              <Icon icon="mdi:timeline-check" width={20} /> Timeline Pengajuan
            </span>
          </div>
          <div className="p-5 sm:p-6 bg-white max-h-[500px] overflow-y-auto">
            {trackingList?.length === 0 ? (
              <p className="text-xs text-center text-gray-400 font-medium py-4">Memuat timeline...</p>
            ) : (
              <div className="relative border-l-[3px] border-gray-200 ml-4 space-y-6 pb-2">
                {trackingList?.map((track, i) => {
                  const visual = getTimelineVisual(track.status, track.catatan);
                  return (
                    <div key={track.id || i} className="relative pl-8 animate-in fade-in slide-in-from-right-2">
                      {/* Icon Node */}
                      <div className={classNames("absolute -left-[18px] top-0 w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center text-white shadow-md z-10", visual.color)}>
                        <Icon icon={visual.icon} width={16} />
                      </div>

                      {/* Content Card */}
                      <div className={classNames("p-4 rounded-xl border border-gray-200 shadow-sm", visual.bgCard)}>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <p className={classNames("text-[11px] font-black uppercase tracking-widest", visual.color.replace("bg-", "text-"))}>{track.status}</p>
                          <p className="text-[10px] text-gray-500 font-mono font-bold whitespace-nowrap">{new Date(track.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div className="text-gray-800">{renderCatatanTracking(track.catatan)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* History Disposisi */}
        {historyDisposisi && historyDisposisi.length > 0 && (
          <Card className="border-2 border-gray-200 shadow-sm overflow-hidden bg-white rounded-3xl animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-indigo-600 border-b-2 border-indigo-700 text-white px-5 sm:px-6 py-4 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono">
                <Icon icon="mdi:source-branch" width={20} /> Rute Disposisi
              </span>
              <span className="bg-indigo-700 text-white border border-indigo-500 px-2 py-0.5 rounded-md text-[9px] font-bold">{historyDisposisi.length} Rute</span>
            </div>
            <div className="p-5 sm:p-6 bg-white max-h-[400px] overflow-y-auto">
              <div className="relative border-l-[3px] border-gray-200 ml-4 space-y-6 pb-2">
                {historyDisposisi.map((disp, idx) => (
                  <div key={idx} className="relative pl-8 animate-in fade-in slide-in-from-right-2">
                    <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center text-white shadow-md z-10 bg-indigo-500">
                      <Icon icon="mdi:share-all" width={16} />
                    </div>

                    {/* Content Card */}
                    <div className="p-4 rounded-xl border border-indigo-100 shadow-sm bg-indigo-50/50">
                      {/* Header: label + timestamp */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <p className="text-[11px] font-black uppercase tracking-widest text-indigo-500">Disposisi</p>
                        <p className="text-[10px] text-gray-500 font-mono font-bold whitespace-nowrap">
                          {new Date(disp.tanggal).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {/* Catatan */}
                      {disp.catatan && (
                        <p className="leading-relaxed text-gray-700 text-sm mb-3">&quot;{disp.catatan}&quot;</p>
                      )}

                      {/* Aktor pill */}
                      <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm mb-2">
                        <Icon icon="mdi:account-circle" className="text-gray-500 shrink-0" width={16} />
                        <span className="text-[11px] font-bold text-gray-700">{cleanActorText(disp.aktor)}</span>
                      </div>

                      {/* Panah → Target */}
                      <div className="flex items-center gap-2 mt-1 mb-2">
                        <Icon icon="mdi:arrow-right-bold" className="text-indigo-400 shrink-0" width={16} />
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
                          <Icon icon="mdi:account-arrow-right" className="text-indigo-500 shrink-0" width={16} />
                          <span className="text-[11px] font-bold text-indigo-700">{disp.target_penerima}</span>
                        </div>
                      </div>

                      {/* Lampiran */}
                      {disp.lampiran && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/lampiran-surat/${disp.lampiran.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700 transition-colors mt-1"
                        >
                          <Icon icon={disp.lampiran.file_url.endsWith(".pdf") ? "mdi:file-pdf-box" : "mdi:image-outline"} className={disp.lampiran.file_url.endsWith(".pdf") ? "text-red-500" : "text-primary-500"} width={16} />
                          <span className="truncate max-w-[150px]">{disp.lampiran.nama_file}</span>
                          <Icon icon="mdi:download" width={14} className="text-gray-400 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
