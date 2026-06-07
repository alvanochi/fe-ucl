import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Card from "../Card";

export default function TrackingSidebar({ lampirans, trackingList, historyDisposisi, onPreview }) {
  const renderCatatanTracking = (text) => {
    if (!text) return "-";
    const parts = text.split(/dilakukan oleh:\s*/i);
    if (parts.length > 1) {
      return (
        <div className="flex flex-col gap-2 mt-1">
          <span className="leading-relaxed text-gray-700">{parts[0].trim()}</span>
          <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <Icon icon="mdi:account-circle" className="text-gray-500 shrink-0" width={16} />
            <span className="text-xs font-bold text-gray-700">{parts[1].trim()}</span>
          </div>
        </div>
      );
    }
    return <span className="leading-relaxed text-gray-700">{text}</span>;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-200 shadow-sm overflow-hidden bg-white rounded-3xl">
        <div className="bg-primary-50 border-b-2 border-primary-100 text-primary-700 px-5 sm:px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono">
            <Icon icon="mdi:folder-open" width={20} /> Lampiran Utama
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
              <Icon icon="mdi:history" width={20} /> Riwayat Aktivitas
            </span>
          </div>
          <div className="p-5 sm:p-6 bg-white max-h-[300px] overflow-y-auto">
            {trackingList?.length === 0 ? (
              <p className="text-xs text-center text-gray-400 font-medium py-4">Memuat riwayat...</p>
            ) : (
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                {trackingList?.map((track, i) => (
                  <div key={track.id || i} className="relative pl-6 animate-in fade-in slide-in-from-right-2">
                    <div
                      className={classNames("absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm", track.status === "Selesai" ? "bg-green-500" : track.status === "Ditolak" ? "bg-red-500" : "bg-primary-500")}
                    />
                    <p className="text-[11px] font-black text-gray-800 uppercase tracking-wide">{track.status}</p>
                    <div className="mt-1">{renderCatatanTracking(track.catatan)}</div>
                    <p className="text-[9px] text-gray-400 font-mono mt-2 font-bold">{new Date(track.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {historyDisposisi && historyDisposisi.length > 0 && (
          <Card className="border-2 border-gray-200 shadow-sm overflow-hidden bg-white rounded-3xl animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-gray-800 border-b-2 border-gray-900 text-white px-5 sm:px-6 py-4 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-mono">
                <Icon icon="mdi:source-branch" width={20} /> Jalur Disposisi
              </span>
              <span className="bg-gray-700 text-gray-300 border border-gray-600 px-2 py-0.5 rounded-md text-[9px] font-bold">{historyDisposisi.length} Rute</span>
            </div>
            <div className="p-5 sm:p-6 bg-white max-h-[300px] overflow-y-auto">
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                {historyDisposisi.map((disp, idx) => (
                  <div key={idx} className="relative pl-6 animate-in fade-in slide-in-from-right-2">
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm bg-primary-500" />
                    <p className="text-[11px] font-black text-gray-800 tracking-wide mb-1 leading-snug">
                      {disp.aktor} <span className="text-gray-400 font-black mx-1">&rarr;</span> <span className="text-primary-600">{disp.target_penerima}</span>
                    </p>
                    <div className="mt-1 flex flex-col gap-2">
                      <span className="leading-relaxed text-gray-700 font-medium">&quot;{disp.catatan}&quot;</span>
                      {disp.lampiran && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/lampiran-surat/${disp.lampiran.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700 transition-colors"
                        >
                          <Icon icon={disp.lampiran.file_url.endsWith(".pdf") ? "mdi:file-pdf-box" : "mdi:image-outline"} className={disp.lampiran.file_url.endsWith(".pdf") ? "text-red-500" : "text-primary-500"} width={16} />
                          <span className="truncate max-w-[150px]">{disp.lampiran.nama_file}</span>
                          <Icon icon="mdi:download" width={14} className="text-gray-400 shrink-0" />
                        </a>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 font-mono mt-2 font-bold">{new Date(disp.tanggal).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</p>
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
