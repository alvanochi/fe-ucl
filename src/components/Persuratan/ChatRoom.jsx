import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import { toastAlert } from "../../lib/sweetalert";

export default function ChatRoom({ replies, user, isTerminalState, status, isSending, onSendReply, onPreview }) {
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      e.target.value = null;
      return toastAlert("error", `File "${oversizedFiles[0].name}" melebihi batas 10MB!`);
    }

    setReplyFiles((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeFile = (idx) => setReplyFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = () => {
    if (!replyText.trim() && replyFiles.length === 0) return;
    onSendReply(replyText, replyFiles, () => {
      setReplyText("");
      setReplyFiles([]);
    });
  };

  return (
    <div className="border-2 border-gray-200 shadow-sm bg-white rounded-3xl p-4 sm:p-8 flex flex-col">
      <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-4 border-b-2 border-gray-100 shrink-0 px-2 sm:px-0">
        <Icon icon="mdi:chat-processing-outline" width={24} className="text-gray-400" />
        <h3 className="text-xs sm:text-sm font-black text-gray-600 uppercase tracking-widest">Ruang Percakapan</h3>
      </div>

      <div
        className="bg-[#F8FAFC] border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-3 sm:p-6 space-y-5 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto shadow-inner mb-4 sm:mb-6 flex-1 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {replies?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 h-full">
            <Icon icon="mdi:message-text-outline" width={48} className="text-gray-300 mb-3" />
            <p className="text-xs font-bold text-gray-400 text-center">
              Belum ada percakapan.
              <br className="block sm:hidden" /> Silakan mulai diskusi.
            </p>
          </div>
        ) : (
          replies?.map((reply, index) => {
            const isMe = user?.user_id === reply.user_id || user?.id === reply.user_id;
            const timeChat = new Date(reply.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB";

            return (
              <div key={index} className={classNames("flex w-full animate-in fade-in slide-in-from-bottom-2", isMe ? "justify-end" : "justify-start")}>
                <div className={classNames("flex flex-col gap-1 sm:gap-1.5 max-w-[92%] sm:max-w-[85%] md:max-w-[75%]", isMe ? "items-end" : "items-start")}>
                  <div className={classNames("flex items-center gap-2 px-1 mb-0.5 sm:mb-1", isMe ? "flex-row-reverse" : "flex-row")}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isMe ? "Anda" : reply.Pengirim?.personal_data?.nama_lengkap || "Pengguna"}</span>
                    <span className="text-[9px] font-mono text-gray-400">{timeChat}</span>
                  </div>
                  <div
                    className={classNames(
                      "p-3 sm:p-4 text-sm leading-relaxed shadow-sm w-fit transition-all",
                      isMe ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm" : "bg-white border-2 border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm",
                    )}
                  >
                    {reply.form_data?.pesan && <p className="whitespace-pre-wrap text-xs sm:text-[13px] font-medium break-words">{reply.form_data?.pesan}</p>}
                    {reply.DokumenLampirans?.map((lampiran, i) => (
                      <div
                        key={i}
                        className={classNames(
                          "mt-2 sm:mt-3 flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all border-2 font-bold",
                          isMe ? "bg-white/10 border-transparent text-white" : "bg-gray-50 border-gray-100 text-gray-700",
                        )}
                      >
                        <div onClick={() => onPreview(lampiran)} className="flex items-center gap-2 cursor-pointer hover:opacity-70 flex-1 overflow-hidden min-w-0">
                          <Icon icon={lampiran.file_url.endsWith(".pdf") ? "mdi:file-pdf-box" : "mdi:image-outline"} width={18} className="shrink-0 sm:w-[20px]" />
                          <span className="text-[10px] sm:text-xs truncate">{lampiran.nama_file}</span>
                        </div>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/lampiran-surat/${lampiran.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className={classNames("shrink-0 p-1.5 sm:p-2 rounded-lg transition-colors focus:ring-2 outline-none", isMe ? "hover:bg-black/20 focus:ring-white" : "hover:bg-gray-200 text-gray-500 focus:ring-primary-500")}
                          title="Unduh File"
                        >
                          <Icon icon="mdi:download" width={16} className="sm:w-[18px]" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {isTerminalState ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl sm:rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <Icon icon={status === "Selesai" ? "mdi:lock-check" : "mdi:lock-alert"} width={36} className="text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-600">Pengajuan ini telah {status.toLowerCase()}.</p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 font-medium">Ruang percakapan ditutup.</p>
        </div>
      ) : (
        <div className="bg-gray-900 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-gray-800 transition-all focus-within:ring-2 focus-within:ring-primary-500">
          {replyFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-800 rounded-xl sm:rounded-2xl mx-1 border-2 border-gray-700 font-bold max-h-24 sm:max-h-32 overflow-y-auto">
              {replyFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2 bg-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-gray-600">
                  <Icon icon={f.type.includes("pdf") ? "mdi:file-pdf-box" : "mdi:image"} className="text-gray-300" width={14} />
                  <span className="text-[9px] sm:text-[10px] text-white truncate max-w-[80px] sm:max-w-[140px]">{f.name}</span>
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-400 transition-colors p-0.5 sm:p-1">
                    <Icon icon="mdi:close-circle" width={16} className="sm:w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-row items-end gap-2 sm:gap-3">
            <div className="relative flex items-center justify-center shrink-0 cursor-pointer group">
              <input type="file" onChange={handleFileChange} multiple className="absolute inset-0 opacity-0 cursor-pointer w-full z-10" accept=".pdf,.jpg,.jpeg,.png" disabled={isSending} />
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-800 rounded-xl text-gray-400 border-2 border-gray-700 group-hover:bg-gray-700 group-hover:text-white transition-all active:scale-95">
                <Icon icon="mdi:paperclip" width={20} className="sm:w-[22px]" />
              </div>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ketik pesan... (Ctrl+Enter untuk kirim)"
              disabled={isSending}
              className="flex-1 w-full bg-gray-800 border-2 border-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-xs sm:text-sm outline-none focus:border-primary-500 min-h-[40px] sm:min-h-[48px] max-h-[120px] sm:max-h-[150px] resize-y placeholder-gray-500 leading-tight font-medium"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isSending || (!replyText.trim() && replyFiles.length === 0)}
              className="shrink-0 px-4 sm:px-6 h-10 sm:h-11 text-xs font-black uppercase tracking-widest rounded-xl sm:rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none transition-all active:scale-95 outline-none focus:ring-2 focus:ring-white"
            >
              {isSending ? (
                <Icon icon="mdi:loading" className="animate-spin" width={18} />
              ) : (
                <>
                  <span className="hidden sm:block">Kirim</span>
                  <Icon icon="mdi:send" width={18} className="block" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
