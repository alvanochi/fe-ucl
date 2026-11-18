import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import axiosCbt from "../../../../lib/axiosCbt";
import { toastAlert } from "../../../../lib/sweetalert";

/**
 * Panel koreksi & rekap nilai ujian CBT, dirender inline di LMS (dosen pengampu/admin) —
 * lihat header ExamRenderer.jsx untuk kenapa ini murni panggil cbt-api langsung (native
 * integration, tidak ada state ujian yang disimpan di sisi LMS). Meniru alur
 * cbt-frontend/src/pages/RekapNilai.jsx + Grading.jsx, disederhanakan karena konteksnya
 * sudah satu exam tetap (tidak perlu picker matkul/ujian).
 */

const TIPE_LABEL = {
  TIPE_1: "Pilihan Ganda",
  TIPE_2: "Teks Pendek",
  TIPE_3: "Esai",
  TIPE_4: "Upload Berkas",
};

const SIAKAD_BADGE = {
  TERKIRIM: { text: "Terkirim", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ANTRIAN: { text: "Antrian", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  GAGAL: { text: "Gagal", cls: "bg-red-50 text-red-700 border-red-200" },
};

function SiakadBadge({ status, error }) {
  const m = SIAKAD_BADGE[status] || { text: "Belum sinkron", cls: "bg-gray-50 text-gray-500 border-gray-200" };
  return (
    <span title={error || ""} className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${m.cls}`}>
      {m.text}
    </span>
  );
}

// Sama seperti RekapNilai.estimateFinalScore — mode PER_SOAL pakai preview server-side,
// mode PER_KATEGORI dihitung dari bobot pilgan/esai/upload.
function estimateFinalScore(attempt, examInfo) {
  if (examInfo?.grading_type === "PER_SOAL") {
    return attempt.preview_final_score ?? null;
  }
  return (
    Number(attempt.skor_pilgan_100) * ((examInfo?.bobot_pilgan || 0) / 100) +
    Number(attempt.skor_esai_100) * ((examInfo?.bobot_esai || 0) / 100) +
    Number(attempt.skor_file_100) * ((examInfo?.bobot_upload || 0) / 100)
  );
}

export default function ExamGradingPanel({ examId }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  const [examInfo, setExamInfo] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [detailAttempt, setDetailAttempt] = useState(null);
  const [pushingAll, setPushingAll] = useState(false);
  const [pushingRowId, setPushingRowId] = useState(null);

  const load = async () => {
    setState((s) => (s === "ready" ? "ready" : "loading"));
    try {
      const res = await axiosCbt.get(`/api/dosen/attempts/${examId}`);
      setExamInfo(res.data?.exam_info || null);
      setAttempts(res.data?.data || []);
      setState("ready");
    } catch (_) {
      setState("error");
    }
  };

  useEffect(() => {
    if (examId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const pushOne = async (attempt) => {
    setPushingRowId(attempt.attempt_id);
    try {
      await axiosCbt.post(`/api/siakad/attempts/${attempt.attempt_id}/push`);
      toastAlert("success", "Nilai masuk antrian pengiriman SIAKAD.");
      await load();
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal push nilai ke SIAKAD.");
    } finally {
      setPushingRowId(null);
    }
  };

  const pushAll = async () => {
    setPushingAll(true);
    try {
      const res = await axiosCbt.post(`/api/siakad/exams/${examId}/push`);
      toastAlert("success", res.data?.message || "Push nilai ujian ke SIAKAD dimulai.");
      await load();
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal push nilai ujian ke SIAKAD.");
    } finally {
      setPushingAll(false);
    }
  };

  if (state === "loading") {
    return <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">Memuat rekap nilai…</p>;
  }
  if (state === "error") {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        Gagal memuat rekap nilai dari Sistem CBT. Coba refresh.
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
      {examInfo && (
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
          {examInfo.grading_type === "PER_SOAL"
            ? `Mode Per Soal — total bobot soal saat ini ${examInfo.total_bobot_soal}/100${
                examInfo.total_bobot_soal !== 100 ? " (belum pas — verifikasi akan ditolak sampai diperbaiki di menu soal CBT)." : "."
              }`
            : `Bobot kategori: Pilihan Ganda ${examInfo.bobot_pilgan}% · Esai ${examInfo.bobot_esai}% · Upload ${examInfo.bobot_upload}%.`}
        </div>
      )}

      <SiakadTargetBar examId={examId} examInfo={examInfo} onSaved={load} onPushAll={pushAll} pushingAll={pushingAll} hasAttempts={attempts.length > 0} />

      <AttemptsTable
        attempts={attempts}
        examInfo={examInfo}
        onDetail={setDetailAttempt}
        onPushOne={pushOne}
        pushingRowId={pushingRowId}
      />

      {detailAttempt && (
        <StudentAnswerModal
          examId={examId}
          examInfo={examInfo}
          attempt={detailAttempt}
          onClose={() => setDetailAttempt(null)}
          onGraded={load}
        />
      )}
    </div>
  );
}

function AttemptsTable({ attempts, examInfo, onDetail, onPushOne, pushingRowId }) {
  if (attempts.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">Belum ada mahasiswa yang mengumpulkan ujian ini.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-400">
          <tr>
            <th className="px-3 py-2">Mahasiswa</th>
            <th className="px-3 py-2 text-center">Pilgan</th>
            <th className="px-3 py-2 text-center">Esai</th>
            <th className="px-3 py-2 text-center">Upload</th>
            <th className="px-3 py-2 text-center">Status</th>
            <th className="px-3 py-2 text-center">SIAKAD</th>
            <th className="px-3 py-2 text-center">Nilai Akhir</th>
            <th className="px-3 py-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attempts.map((a) => {
            const estimate = estimateFinalScore(a, examInfo);
            return (
              <tr key={a.attempt_id} className="hover:bg-gray-50/70">
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-800">{a.nama_mahasiswa}</p>
                  <p className="text-xs text-gray-400">{a.nim}</p>
                </td>
                <td className="px-3 py-2 text-center">{Number(a.skor_pilgan_100).toFixed(1)}</td>
                <td className="px-3 py-2 text-center">{Number(a.skor_esai_100).toFixed(1)}</td>
                <td className="px-3 py-2 text-center">{Number(a.skor_file_100).toFixed(1)}</td>
                <td className="px-3 py-2 text-center">
                  {a.status === "SELESAI" ? (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Final</span>
                  ) : (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">Pending</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <SiakadBadge status={a.siakad_sync_status} error={a.siakad_error} />
                </td>
                <td className="px-3 py-2 text-center">
                  {a.final_score !== null ? (
                    <span className="text-base font-bold text-gray-800">{Number(a.final_score).toFixed(2)}</span>
                  ) : estimate !== null ? (
                    <span className="text-sm italic text-gray-400">≈{Number(estimate).toFixed(2)}</span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDetail(a)}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      {a.status === "SELESAI" ? "Edit Nilai" : "Koreksi"}
                    </button>
                    {a.status === "SELESAI" && (
                      <button
                        type="button"
                        onClick={() => onPushOne(a)}
                        disabled={pushingRowId === a.attempt_id}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
                      >
                        {pushingRowId === a.attempt_id ? "Mengirim…" : a.siakad_sync_status === "GAGAL" ? "Retry" : "Push"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StudentAnswerModal({ examId, examInfo, attempt, onClose, onGraded }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({
    pilgan: Number(attempt.skor_pilgan_100),
    esai: Number(attempt.skor_esai_100),
    file: Number(attempt.skor_file_100),
  });
  const [verifying, setVerifying] = useState(false);

  const load = async () => {
    setState((s) => (s === "ready" ? "ready" : "loading"));
    try {
      const res = await axiosCbt.get(`/api/grading/exams/${examId}/students/${attempt.user_id}/answers`);
      setAnswers(res.data?.data || []);
      setState("ready");
    } catch (_) {
      setState("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveResponseScore = async (responseId, skor) => {
    await axiosCbt.put(`/api/grading/responses/${responseId}/score`, { skor: Number(skor) });
    toastAlert("success", "Skor soal tersimpan.");
    await load();
    onGraded && onGraded();
  };

  const submitVerify = async () => {
    setVerifying(true);
    try {
      const payload =
        examInfo?.grading_type === "PER_SOAL"
          ? {}
          : { skor_pilgan_100: scores.pilgan, skor_esai_100: scores.esai, skor_file_100: scores.file };
      await axiosCbt.post(`/api/dosen/verify-exam/${attempt.attempt_id}`, payload);
      toastAlert("success", "Nilai diverifikasi & dipublikasikan ke mahasiswa.");
      onGraded && onGraded();
      onClose();
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal memverifikasi nilai.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{attempt.nama_mahasiswa}</p>
            <p className="text-xs text-gray-400">{attempt.nim}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon icon="mdi:close" width={22} height={22} />
          </button>
        </div>

        {state === "loading" && <p className="py-8 text-center text-sm text-gray-400">Memuat soal & jawaban…</p>}
        {state === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Gagal memuat jawaban mahasiswa. Coba tutup & buka lagi.</p>
        )}

        {state === "ready" && (
          <div className="space-y-3">
            {answers.length === 0 && <p className="py-6 text-center text-sm text-gray-400">Belum ada jawaban tercatat.</p>}
            {answers.map((ans) => (
              <AnswerCard key={ans.id} answer={ans} onSaveScore={(skor) => saveResponseScore(ans.id, skor)} />
            ))}
          </div>
        )}

        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {examInfo?.grading_type === "PER_SOAL" ? (
            <p className="text-xs text-gray-500">
              Mode Per Soal — nilai akhir dihitung otomatis dari bobot tiap soal, begitu semua jawaban esai/upload di atas dinilai.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <ScoreInput label={`Pilgan (${examInfo?.bobot_pilgan}%)`} value={scores.pilgan} onChange={(v) => setScores((s) => ({ ...s, pilgan: v }))} />
              <ScoreInput label={`Esai (${examInfo?.bobot_esai}%)`} value={scores.esai} onChange={(v) => setScores((s) => ({ ...s, esai: v }))} />
              <ScoreInput label={`Upload (${examInfo?.bobot_upload}%)`} value={scores.file} onChange={(v) => setScores((s) => ({ ...s, file: v }))} />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Tutup
            </button>
            <button
              type="button"
              onClick={submitVerify}
              disabled={verifying}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60"
            >
              {verifying ? "Memproses…" : "Verifikasi & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreInput({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm"
      />
    </div>
  );
}

function AnswerCard({ answer, onSaveScore }) {
  const q = answer.questions || {};
  const [skor, setSkor] = useState(answer.skor ?? "");
  const [saving, setSaving] = useState(false);
  const gradable = q.tipe_soal === "TIPE_3" || q.tipe_soal === "TIPE_4";

  let opsi = null;
  try {
    opsi = q.opsi_jawaban ? JSON.parse(q.opsi_jawaban) : null;
  } catch (_) {
    opsi = null;
  }

  const fileUrl = answer.file_path
    ? `${(process.env.NEXT_PUBLIC_CBT_API_BASE_URL || "").replace(/\/+$/, "")}/${String(answer.file_path).replace(/^\/+/, "")}`
    : null;

  const save = async () => {
    if (skor === "" || isNaN(Number(skor))) return toastAlert("warning", "Skor wajib diisi (angka 0-100).");
    setSaving(true);
    try {
      await onSaveScore(skor);
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal menyimpan skor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-600">
          {TIPE_LABEL[q.tipe_soal] || q.tipe_soal}
        </span>
        <span className="text-xs text-gray-400">Bobot: {q.bobot_nilai ?? "-"}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-gray-800">{q.isi_soal}</p>

      {opsi && (
        <ul className="mt-2 space-y-1 text-xs">
          {Object.entries(opsi).map(([label, teks]) => {
            const isKunci = label === q.kunci_jawaban;
            const isJawaban = label === answer.jawaban_teks;
            return (
              <li
                key={label}
                className={`rounded-md px-2 py-1 ${
                  isKunci ? "bg-emerald-100 text-emerald-800" : isJawaban ? "bg-red-100 text-red-800" : "text-gray-600"
                }`}
              >
                {label}. {teks}
                {isKunci ? " — Kunci" : ""}
                {isJawaban ? " (dipilih mahasiswa)" : ""}
              </li>
            );
          })}
        </ul>
      )}

      {!opsi && (
        <div className="mt-2 space-y-1 text-xs">
          {q.tipe_soal === "TIPE_4" ? (
            <p className="text-gray-500">
              <span className="font-semibold">Berkas jawaban:</span>{" "}
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">
                  Unduh berkas
                </a>
              ) : (
                "Belum ada berkas"
              )}
            </p>
          ) : (
            <p className="text-gray-500">
              <span className="font-semibold">Jawaban mahasiswa:</span> {answer.jawaban_teks || "-"}
            </p>
          )}
          {q.kunci_jawaban && (
            <p className="text-gray-500">
              <span className="font-semibold">Kunci jawaban:</span> {q.kunci_jawaban}
            </p>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        {gradable ? (
          <>
            <input
              type="number"
              min="0"
              max="100"
              value={skor}
              onChange={(e) => setSkor(e.target.value)}
              placeholder="Skor 0-100"
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan…" : "Simpan Skor"}
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400">Skor: {answer.skor ?? "-"} (otomatis)</span>
        )}
      </div>
    </div>
  );
}

function SiakadTargetBar({ examId, examInfo, onSaved, onPushAll, pushingAll, hasAttempts }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState({ kelas: "", periode: "", rencana: "" });
  const [saving, setSaving] = useState(false);
  const [rencanaOptions, setRencanaOptions] = useState([]);
  const [loadingRencana, setLoadingRencana] = useState(false);

  useEffect(() => {
    setTarget({
      kelas: examInfo?.siakad_kelas_kuliah_id || "",
      periode: examInfo?.siakad_periode_akademik_id || "",
      rencana: examInfo?.siakad_rencana_evaluasi_id || "",
    });
  }, [examInfo]);

  const targetReady = !!(examInfo?.siakad_kelas_kuliah_id && examInfo?.siakad_periode_akademik_id && examInfo?.siakad_rencana_evaluasi_id);

  const save = async () => {
    if (!target.kelas.trim() || !target.periode.trim()) {
      return toastAlert("warning", "ID Kelas dan Periode Akademik SIAKAD wajib diisi.");
    }
    setSaving(true);
    try {
      await axiosCbt.put(`/api/siakad/exams/${examId}/target`, {
        siakad_kelas_kuliah_id: target.kelas.trim(),
        siakad_periode_akademik_id: target.periode.trim(),
        siakad_rencana_evaluasi_id: target.rencana.trim() || null,
      });
      toastAlert("success", "Target SIAKAD tersimpan.");
      await onSaved();
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal menyimpan target SIAKAD.");
    } finally {
      setSaving(false);
    }
  };

  const cariKomponen = async () => {
    if (!target.periode.trim()) {
      return toastAlert("warning", "Isi ID Periode Akademik SIAKAD dulu, baru cari komponennya.");
    }
    setLoadingRencana(true);
    try {
      const res = await axiosCbt.get("/api/siakad/rencana-evaluasi", {
        params: { kode_mk: examInfo?.kode_mk, periode_id: target.periode.trim() },
      });
      const list = res.data?.data?.rencanaEvaluasi || [];
      setRencanaOptions(list);
      if (list.length === 0) toastAlert("info", "Tidak ada komponen Rencana Evaluasi ditemukan untuk mata kuliah/periode ini.");
    } catch (err) {
      toastAlert("error", err?.response?.data?.message || "Gagal menarik daftar komponen dari SIAKAD.");
    } finally {
      setLoadingRencana(false);
    }
  };

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
          <Icon icon="mdi:school-outline" width={18} height={18} />
          Target &amp; Push Nilai ke SIAKAD (OBE)
          {targetReady && <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Target siap</span>}
        </span>
        <Icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} height={20} className="text-indigo-500" />
      </button>

      {open && (
        <div className="space-y-3 border-t border-indigo-100 px-4 py-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-indigo-400">ID Kelas Kuliah SIAKAD</label>
              <input
                type="text"
                value={target.kelas}
                onChange={(e) => setTarget((s) => ({ ...s, kelas: e.target.value }))}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-indigo-400">ID Periode Akademik SIAKAD</label>
              <input
                type="text"
                value={target.periode}
                onChange={(e) => setTarget((s) => ({ ...s, periode: e.target.value }))}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-indigo-400">ID Komponen Evaluasi (rencanaEvaluasiId)</label>
              <input
                type="text"
                value={target.rencana}
                onChange={(e) => setTarget((s) => ({ ...s, rencana: e.target.value }))}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm"
              />
              {rencanaOptions.length > 0 && (
                <select
                  onChange={(e) => e.target.value && setTarget((s) => ({ ...s, rencana: e.target.value }))}
                  defaultValue=""
                  className="mt-1.5 w-full rounded-lg border border-indigo-200 bg-white px-2 py-1.5 text-xs"
                >
                  <option value="" disabled>
                    — Pilih dari hasil pencarian SIAKAD —
                  </option>
                  {rencanaOptions.map((re) => (
                    <option key={re.id} value={re.id}>
                      {re.metodeEvaluasi} ({re.bobotEvaluasi}%){re.jenisEvaluasi ? ` — ${re.jenisEvaluasi}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={cariKomponen}
              disabled={loadingRencana}
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
            >
              {loadingRencana ? "Mencari…" : "Cari Komponen"}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Simpan Target"}
            </button>
            <button
              type="button"
              onClick={onPushAll}
              disabled={pushingAll || !hasAttempts}
              className="ml-auto rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {pushingAll ? "Mengirim…" : "Push Semua ke SIAKAD"}
            </button>
          </div>
          <p className="text-[10px] leading-relaxed text-indigo-400">
            Push hanya mengirim nilai mahasiswa berstatus Final. Pemetaan CPMK/Sub-CPMK (OBE) memakai data yang sudah dipetakan di menu CPMK &amp; Sub-CPMK CBT — tidak perlu diatur ulang di sini.
          </p>
        </div>
      )}
    </div>
  );
}
