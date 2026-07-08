import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import useUser from "../../hooks/useUser";
import { toastAlert, warningAlert, loadingAlert } from "../../lib/sweetalert";

import DisposisiModal from "../../components/Persuratan/DisposisiModal";
import ChatRoom from "../../components/Persuratan/ChatRoom";
import TrackingSidebar from "../../components/Persuratan/TrackingSidebar";

const InfoBlock = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1.5 font-bold">
    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-black">{label}</p>
    <div className={classNames("text-sm transition-colors break-words", highlight ? "text-primary-600" : "text-gray-800")}>{value || "-"}</div>
  </div>
);

const ReadMoreText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <p className="text-gray-800 text-sm font-medium leading-relaxed">{text}</p>;

  return (
    <div className="flex flex-col">
      <p className="text-gray-800 text-sm font-medium leading-relaxed transition-all">{isExpanded ? text : `${text.substring(0, maxLength)}...`}</p>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] bg-primary-50 text-primary-600 hover:bg-primary-100 px-5 py-2 rounded-full font-black uppercase tracking-widest active:scale-95 transition-all outline-none border border-primary-200 shadow-sm"
        >
          {isExpanded ? "Tutup Catatan" : "Cek Selengkapnya"}
        </button>
      </div>
    </div>
  );
};

export default function PersuratanDetail({ onBack, surat }) {
  const { user } = useUser();
  const [localSurat, setLocalSurat] = useState(surat);
  const [trackingList, setTrackingList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [activePreview, setActivePreview] = useState(null);
  const [showDisposisi, setShowDisposisi] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchTracking = useCallback(async (suratId) => {
    if (!suratId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat/tracking/${suratId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.isSuccess) setTrackingList(res.data.data);
    } catch (err) {
      console.error("Gagal load tracking:", err);
    }
  }, []);

  useEffect(() => {
    if (surat) {
      setLocalSurat(surat);
      fetchTracking(surat.id);
    }
  }, [surat, fetchTracking]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActivePreview(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users?limit=1000`, { headers: { Authorization: `Bearer ${token}` } });
        const rows = res.data?.data?.rows || res.data?.rows || res.data?.data;
        if (rows && Array.isArray(rows)) {
          const formatted = rows.filter((u) => u.user_id !== user?.user_id).map((u) => ({ label: `${u.personal_data?.nama_lengkap || u.username} - ${u.role ? u.role.toUpperCase() : ""}`, value: u.user_id }));
          setUserList(formatted);
        }
      } catch (error) {
        console.error("Gagal load user:", error);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const refreshDetailData = useCallback(async () => {
    if (!localSurat?.id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat/${localSurat.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const fetchedData = res.data?.data || res.data;
      if (fetchedData) {
        setLocalSurat(fetchedData);
        fetchTracking(localSurat.id);
      }
    } catch (error) {
      console.error("Gagal memuat ulang data:", error);
    }
  }, [localSurat?.id, fetchTracking]);

  const handlePreview = useCallback((file) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/lampiran-surat/${file.file_url}`;
    const type = file.file_url.toLowerCase().endsWith(".pdf") ? "pdf" : "image";
    setActivePreview({ url, type, name: file.nama_file });
  }, []);

  const getMyIdentity = () => {
    const name = user?.personal_data?.nama_lengkap || user?.username || "Pengguna";

    const isValid = (val) => val && val.trim().toLowerCase() !== "null";

    const npm  = isValid(user?.npm) ? user.npm.trim() : null;
    const nidn = isValid(user?.nidn) ? user.nidn.trim() : null;
    const nip  = isValid(user?.personal_data?.nip) ? user.personal_data.nip.trim() : null;

    const identitas = npm || nidn || nip || null;
    const role = user?.role ? user.role.toUpperCase() : "USER";
    return identitas ? `${name} (${identitas} - ${role})` : `${name} (${role})`;
  };

  const handleSendReply = async (text, files, onSuccess) => {
    try {
      setIsSending(true);
      const token = localStorage.getItem("token");
      const fd = new FormData();

      const targetPenerima = user?.user_id === localSurat.user_id ? localSurat.penerima_id : localSurat.user_id;

      fd.append("penerima_id", targetPenerima || localSurat.penerima_id);
      fd.append("jenis_surat", localSurat.jenis_surat);
      fd.append("parent_id", localSurat.id);
      fd.append("form_data", JSON.stringify({ pesan: text }));
      fd.append("nama_aktor", getMyIdentity());
      files.forEach((file) => fd.append("lampiran", file));

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/surat`, fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      if (res.data.isSuccess) {
        onSuccess();
        toastAlert("success", "Balasan berhasil dikirim!");
        await refreshDetailData();
      }
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || err?.response?.data?.message || "Gagal mengirim balasan!");
    } finally {
      setIsSending(false);
    }
  };

  const handleDisposisiSubmit = async (target, catatan, file, onSuccess) => {
    try {
      loadingAlert("Memproses Disposisi...", "Mohon tunggu sebentar");
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("target_penerima_id", target);
      fd.append("catatan_disposisi", catatan);
      fd.append("nama_aktor", getMyIdentity());
      if (file) fd.append("lampiran", file);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/surat/disposisi/${localSurat.id}`, fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      if (res.data.isSuccess) {
        onSuccess();
        setShowDisposisi(false);
        toastAlert("success", "Surat berhasil didisposisikan!");
        await refreshDetailData();
      }
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal melakukan disposisi!");
    }
  };

  const handleComplete = () => {
    warningAlert(
      async () => {
        try {
          loadingAlert("Harap Tunggu", "Sedang menerbitkan dokumen...");
          const token = localStorage.getItem("token");
          const catatanLog = `Pengajuan telah diselesaikan dan ditutup secara permanen. Dilakukan oleh: ${getMyIdentity()}`;
          const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/surat/status/${localSurat.id}`, { status: "Selesai", catatan: catatanLog }, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data.isSuccess) {
            toastAlert("success", "Dokumen Berhasil Diterbitkan!");
            await refreshDetailData();
          }
        } catch (err) {
          toastAlert("error", "Gagal memperbarui status");
        }
      },
      "Status akan diubah menjadi Selesai. Ruang percakapan akan ditutup dan sistem akan otomatis men-generate dokumen resmi (.PDF).",
      "Selesaikan Pengajuan?",
    );
  };

  if (!localSurat) return null;

  const isTerminalState = ["Selesai", "Ditolak", "Archived"].includes(localSurat.status);
  const isSender = user?.user_id === localSurat.user_id;
  const isReceiver = user?.user_id === localSurat.penerima_id;
  const anonymityRole = user?.role?.toLowerCase();

  const canComplete = !isTerminalState && (isSender || isReceiver) && anonymityRole !== "mahasiswa";
  const canDisposisi = !isTerminalState && isReceiver && anonymityRole !== "mahasiswa";

  const hasGeneratedPDF = localSurat.status === "Selesai" && localSurat.form_data?.pdf_url;
  const tglSuratLengkap = new Date(localSurat.created_at).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB";

  return (
    <Layout>
      <Head>
        <title>Detail Pengajuan | {localSurat.id}</title>
      </Head>

      <DisposisiModal show={showDisposisi} onClose={() => setShowDisposisi(false)} onSubmit={handleDisposisiSubmit} userList={userList} />

      <div className="w-full bg-[#F1F5F9] min-h-[calc(100vh-2rem)] py-6 px-4 sm:px-6 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                aria-label="Kembali"
                className="p-3 sm:p-2.5 hover:bg-gray-200 rounded-xl border-2 border-gray-200 bg-white transition-all shadow-sm active:scale-95 text-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <Icon icon="mdi:arrow-left" width={22} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight leading-none">Detail Pengajuan</h1>
                <p className="text-[10px] text-gray-400 font-mono mt-1 tracking-widest uppercase">ID: {localSurat.id}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {canDisposisi && (
                <button
                  onClick={() => setShowDisposisi(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md px-5 py-3 sm:py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all active:scale-95 border-none outline-none flex items-center gap-2 justify-center"
                >
                  <Icon icon="mdi:share-all" width={16} /> Disposisi Surat
                </button>
              )}
              {canComplete && (
                <button
                  onClick={handleComplete}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md px-5 py-3 sm:py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all active:scale-95 border-none outline-none flex items-center gap-2 justify-center"
                >
                  <Icon icon="mdi:check-all" width={16} /> Selesaikan Pengajuan
                </button>
              )}
              <div
                className={classNames(
                  "px-5 py-2.5 rounded-xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm font-mono w-full sm:w-auto text-center",
                  localSurat.status === "Selesai" ? "bg-gray-200 text-gray-700 border-gray-300" : localSurat.status === "Ditolak" ? "bg-red-50 text-red-700 border-red-200" : "bg-primary-50 text-primary-700 border-primary-200",
                )}
              >
                STATUS: {localSurat.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">
              {hasGeneratedPDF ? (
                <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden flex flex-col h-[650px] animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-4 sm:px-6 sm:py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary-50 text-primary-600 rounded-lg border border-primary-100 shadow-sm">
                        <Icon icon="mdi:file-document-check" width={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm tracking-wide">Dokumen Resmi Tersedia</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Versi final telah diterbitkan oleh sistem</p>
                      </div>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${localSurat.form_data.pdf_url}`}
                      target="_blank"
                      rel="noreferrer"
                      download={`Surat_${localSurat.jenis_surat.replace(/\s+/g, "_")}_${localSurat.id}.pdf`}
                      className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm px-4 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 outline-none flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:tray-arrow-down" width={16} className="text-gray-500" />
                      Unduh Dokumen
                    </a>
                  </div>
                  <div className="flex-1 w-full bg-[#E5E7EB]">
                    <iframe src={`${process.env.NEXT_PUBLIC_API_URL}${localSurat.form_data.pdf_url}#view=FitH`} className="w-full h-full border-none shadow-inner" title="Dokumen Resmi PDF" />
                  </div>
                </Card>
              ) : (
                <Card className="border-2 border-gray-200 shadow-sm bg-white rounded-3xl overflow-hidden animate-in fade-in">
                  <div className="p-6 sm:p-8">
                    <div className="mb-6 sm:mb-8 pb-6 border-b-2 border-gray-100">
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Perihal Pengajuan</p>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{localSurat.form_data?.perihal || "TANPA PERIHAL"}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 mb-2">
                      <InfoBlock label="Tipe Surat" value={localSurat.jenis_surat} highlight />
                      <InfoBlock label="Tanggal Pengajuan" value={tglSuratLengkap} />

                      {localSurat.jenis_surat?.toLowerCase() === "surat pengunduran diri" && (
                        <>
                          <InfoBlock label="Semester" value={localSurat.form_data?.semester} />
                          <InfoBlock label="Tanggal Pengarahan" value={localSurat.form_data?.tanggal_pengarahan} />
                          <InfoBlock label="Nama Orang Tua / Wali" value={localSurat.form_data?.nama_ortu_wali} />
                        </>
                      )}

                      {localSurat.jenis_surat?.toLowerCase() === "surat pengajuan cuti" && (
                        <>
                          <InfoBlock label="Mulai Cuti Semester" value={localSurat.form_data?.semester_cuti} />
                          <InfoBlock label="Tahun Akademik Cuti" value={localSurat.form_data?.tahun_akademik_cuti} />
                          <InfoBlock label="Rencana Aktif Semester" value={localSurat.form_data?.semester_aktif} />
                          <InfoBlock label="Tahun Akademik Aktif" value={localSurat.form_data?.tahun_akademik_aktif} />
                        </>
                      )}
                    </div>

                    {localSurat.form_data?.catatan_surat && (
                      <div className="mb-2 pt-6 border-t-2 border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Catatan Tambahan Mahasiswa</p>
                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                          <ReadMoreText text={localSurat.form_data.catatan_surat} maxLength={150} />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <ChatRoom replies={localSurat.Replies} user={user} isTerminalState={isTerminalState} status={localSurat.status} isSending={isSending} onSendReply={handleSendReply} onPreview={handlePreview} />
            </div>

            <div className="lg:col-span-4">
              <TrackingSidebar lampirans={localSurat.DokumenLampirans} trackingList={trackingList} historyDisposisi={localSurat.form_data?.history_disposisi} onPreview={handlePreview} />
            </div>
          </div>
        </div>
      </div>

      {activePreview && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setActivePreview(null)}>
          <div
            className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border-2 border-gray-200 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 bg-gray-50/50 shrink-0">
              <p className="font-bold text-xs sm:text-sm truncate uppercase text-gray-700 ml-2 tracking-widest mr-4">{activePreview.name}</p>
              <button onClick={() => setActivePreview(null)} className="p-2 sm:p-2.5 bg-white border-2 shadow-sm text-gray-400 hover:text-red-500 hover:border-red-100 rounded-full active:scale-90 outline-none">
                <Icon icon="mdi:close" width={22} />
              </button>
            </div>
            <div className="flex-1 bg-gray-100/50 flex items-center justify-center overflow-hidden p-3 sm:p-6">
              {activePreview.type === "pdf" ? (
                <iframe src={activePreview.url} className="w-full h-full border-2 border-gray-200 rounded-2xl sm:rounded-3xl bg-white shadow-sm" title={activePreview.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-white p-2">
                  <img src={activePreview.url} alt="Preview Dokumen" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
