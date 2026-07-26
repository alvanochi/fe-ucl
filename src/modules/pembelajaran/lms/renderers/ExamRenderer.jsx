import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { bootstrapCbtToken } from "../../../../lib/cbtAuth";
import axiosCbt from "../../../../lib/axiosCbt";

/**
 * Renderer tipe "exam" — integrasi LMS-CBT (native, lihat lmsRoutes/CbtAuthController di
 * tias-backend). Pengerjaan ujian TIDAK dilakukan di fe-ucl — mahasiswa diarahkan ke
 * cbt-frontend (SSO via /sso?token=) untuk masuk token ujian yang diumumkan dosen di kelas.
 * Status/nilai ditarik dengan polling `GET /api/student/history` langsung ke cbt-api,
 * difilter ke exam_id yang tertaut pada item ini.
 */

function StatusPanel({ state, entry }) {
  if (state === "loading") {
    return <p className="text-sm text-gray-500">Memuat status…</p>;
  }
  if (state === "error") {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        Gagal memuat status dari Sistem CBT. Coba refresh.
      </p>
    );
  }
  if (!entry) {
    return <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">Belum dikerjakan.</p>;
  }
  if (entry.status === "MENUNGGU_VERIFIKASI") {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Sudah dikumpulkan — menunggu koreksi/verifikasi dosen.
      </p>
    );
  }
  return (
    <div className="space-y-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
      <p className="font-semibold">Nilai akhir: {entry.final_score ?? "-"}</p>
      <p className="text-xs text-emerald-700">
        Pilgan: {entry.skor_pilgan_100} · Esai: {entry.skor_esai_100} · Upload: {entry.skor_file_100}
      </p>
    </div>
  );
}

export default function ExamRenderer({ item }) {
  const { cbt_exam_id, cbt_nama_ujian } = item.payload || {};
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [entry, setEntry] = useState(null);
  const [opening, setOpening] = useState(false);

  const loadHistory = async () => {
    setStatus("loading");
    try {
      await bootstrapCbtToken();
      const res = await axiosCbt.get("/api/student/history");
      const rows = res.data?.data || [];
      setEntry(rows.find((x) => x.exam_id === cbt_exam_id) || null);
      setStatus("ready");
    } catch (_) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (cbt_exam_id) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cbt_exam_id]);

  const handleOpenExam = async () => {
    setOpening(true);
    try {
      const cbtToken = await bootstrapCbtToken();
      const url = `${process.env.NEXT_PUBLIC_CBT_WEB_URL}/sso?token=${encodeURIComponent(cbtToken)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (_) {
      // biarkan tombol tetap bisa dicoba ulang; kegagalan sudah cukup jelas dari tidak terbukanya tab baru
    } finally {
      setOpening(false);
    }
  };

  if (!cbt_exam_id) {
    return <p className="text-sm text-gray-400">Ujian belum ditautkan.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
          <Icon icon="mdi:clipboard-check-outline" width={24} height={24} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800">{cbt_nama_ujian || "Ujian CBT"}</p>
          <p className="text-xs text-gray-400">Dikerjakan di Sistem CBT — masukkan token yang diumumkan dosen.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleOpenExam}
          disabled={opening}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60"
        >
          <Icon icon="mdi:open-in-new" width={18} height={18} />
          Ikuti Ujian di Sistem CBT
        </button>
        <button
          type="button"
          onClick={loadHistory}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Icon icon="mdi:refresh" width={18} height={18} />
          Refresh Nilai
        </button>
      </div>

      <StatusPanel state={status} entry={entry} />
    </div>
  );
}
