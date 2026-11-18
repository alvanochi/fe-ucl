import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import DOMPurify from "dompurify";
import { toastAlert } from "../../../../lib/sweetalert";
import {
  useMySubmission,
  useLmsSubmissions,
  submitAssignment,
  gradeSubmission,
  fetchSubmissionFileBlob,
} from "../../../../repo/lms";

/**
 * Renderer tipe Assignment (A5) — config tugas di `item.payload` (instructions, due_at,
 * max_score, allow_late, allowed_file_types). `manage` (dosen pengampu/admin) melihat
 * antrean submission + form nilai; mahasiswa melihat status submission miliknya + form
 * kumpul/kumpul-ulang. Backend tetap sumber kebenaran otorisasi & kebijakan telat.
 */

const fmt = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch (_) {
    return "";
  }
};

const sanitize = (html) => {
  if (typeof window === "undefined" || !html) return "";
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
};

async function downloadSubmissionFile(submissionId, fileName) {
  try {
    const blob = await fetchSubmissionFileBlob(submissionId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "berkas";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (_) {
    toastAlert("error", "Gagal mengunduh berkas.");
  }
}

export default function AssignmentRenderer({ item, demo = false, manage = false }) {
  const cfg = item.payload || {};

  if (demo) {
    return (
      <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
        Tugas tidak aktif di mode contoh.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <AssignmentHeader cfg={cfg} />
      {manage ? <SubmissionQueue itemId={item.id} /> : <MySubmissionPanel itemId={item.id} cfg={cfg} />}
    </div>
  );
}

function AssignmentHeader({ cfg }) {
  const html = sanitize(cfg.instructions);
  return (
    <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
      {html ? (
        <div
          className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-a:text-primary-600"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-sm text-gray-400">Tidak ada instruksi tambahan.</p>
      )}
      <div className="flex flex-wrap gap-3 text-xs font-medium text-amber-800">
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:calendar-clock" width={14} height={14} />
          {cfg.due_at ? `Tenggat: ${fmt(cfg.due_at)}` : "Tanpa tenggat"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:star-outline" width={14} height={14} />
          Skor maks: {cfg.max_score ?? "-"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:clock-alert-outline" width={14} height={14} />
          {cfg.allow_late === false ? "Pengumpulan telat ditolak" : "Pengumpulan telat diterima"}
        </span>
        {Array.isArray(cfg.allowed_file_types) && cfg.allowed_file_types.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Icon icon="mdi:file-check-outline" width={14} height={14} />
            Tipe berkas: {cfg.allowed_file_types.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Mahasiswa --------------------------------- */

function MySubmissionPanel({ itemId, cfg }) {
  const { submission, isLoading, mutate } = useMySubmission(itemId);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const accept = Array.isArray(cfg.allowed_file_types) && cfg.allowed_file_types.length > 0
    ? cfg.allowed_file_types.map((t) => `.${t}`).join(",")
    : ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.zip";

  const isPastDeadline = cfg.due_at ? Date.now() > new Date(cfg.due_at).getTime() : false;
  const closed = isPastDeadline && cfg.allow_late === false;

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return toastAlert("warning", "Isi teks dan/atau lampirkan berkas.");
    setSending(true);
    try {
      const fd = new FormData();
      if (text.trim()) fd.append("text", text.trim());
      if (file) fd.append("file", file);
      const res = await submitAssignment(itemId, fd);
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal mengumpulkan tugas.");
      toastAlert("success", "Tugas terkirim.");
      setText("");
      setFile(null);
      setFormOpen(false);
      await mutate();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal mengumpulkan tugas.");
    } finally {
      setSending(false);
    }
  };

  if (isLoading) {
    return <p className="py-6 text-center text-sm text-gray-400">Memuat status tugas…</p>;
  }

  const graded = submission && submission.graded_at;
  const showForm = !graded && (formOpen || !submission);

  return (
    <div className="space-y-3">
      {submission && (
        <div className="space-y-2 rounded-xl border border-gray-100 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
              <Icon icon="mdi:check-circle-outline" width={14} height={14} /> Terkumpul
            </span>
            {submission.is_late && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                <Icon icon="mdi:clock-alert-outline" width={14} height={14} /> Telat
              </span>
            )}
            <span className="text-xs text-gray-400">{fmt(submission.submitted_at)}</span>
          </div>

          {submission.text && <p className="whitespace-pre-wrap text-sm text-gray-700">{submission.text}</p>}

          {submission.storage_key && (
            <button
              type="button"
              onClick={() => downloadSubmissionFile(submission.id, submission.file_name)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
            >
              <Icon icon="mdi:paperclip" width={16} height={16} />
              {submission.file_name || "Unduh berkas"}
            </button>
          )}

          {graded ? (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <p className="font-semibold">
                Nilai: {submission.score} / {cfg.max_score ?? "-"}
              </p>
              {submission.feedback && <p className="mt-1 text-emerald-700">{submission.feedback}</p>}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setText(submission.text || "");
                setFormOpen((v) => !v);
              }}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              {formOpen ? "Batal kumpul ulang" : "Kumpul ulang"}
            </button>
          )}
        </div>
      )}

      {!submission && closed && (
        <p className="rounded-xl bg-gray-50 px-3 py-3 text-center text-sm text-gray-500">
          Tenggat pengumpulan sudah lewat; pengumpulan ditutup untuk tugas ini.
        </p>
      )}

      {showForm && !closed && (
        <form onSubmit={submit} className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis jawaban / catatan (opsional bila melampirkan berkas)…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="file"
            accept={accept}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-2 file:text-white"
          />
          <div className="flex justify-end gap-2">
            <button type="submit" disabled={sending} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              {sending ? "Mengirim…" : submission ? "Kirim Ulang" : "Kumpulkan Tugas"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------ Dosen ----------------------------------- */

function SubmissionQueue({ itemId }) {
  const [page, setPage] = useState(1);
  const { submissions, total, totalPage, isLoading, mutate } = useLmsSubmissions(itemId, { page, limit: 10 });

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{total} submission terkumpul.</p>

      {isLoading ? (
        <p className="py-6 text-center text-sm text-gray-400">Memuat submission…</p>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 text-center">
          <Icon icon="mdi:clipboard-text-off-outline" width={36} height={36} className="text-gray-300" />
          <p className="text-sm text-gray-400">Belum ada mahasiswa yang mengumpulkan.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {submissions.map((s) => (
            <SubmissionRow key={s.id} submission={s} onGraded={mutate} />
          ))}
        </ul>
      )}

      {totalPage > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1 text-sm text-gray-500">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-30">
            <Icon icon="mdi:chevron-left" width={18} height={18} />
          </button>
          Halaman {page}/{totalPage}
          <button type="button" disabled={page >= totalPage} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-30">
            <Icon icon="mdi:chevron-right" width={18} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function SubmissionRow({ submission: s, onGraded }) {
  const [gradeOpen, setGradeOpen] = useState(false);
  const [score, setScore] = useState(s.score ?? "");
  const [feedback, setFeedback] = useState(s.feedback || "");
  const [saving, setSaving] = useState(false);
  const graded = !!s.graded_at;

  const submitGrade = async (e) => {
    e.preventDefault();
    if (score === "" || isNaN(Number(score))) return toastAlert("warning", "Skor wajib diisi (angka).");
    setSaving(true);
    try {
      const res = await gradeSubmission(s.id, { score: Number(score), feedback: feedback.trim() || undefined });
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal menilai.");
      toastAlert("success", "Submission dinilai.");
      setGradeOpen(false);
      await onGraded();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal menilai.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="space-y-2 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800">{s.nama_mahasiswa || "Mahasiswa"}</p>
          <p className="text-xs text-gray-400">
            {s.npm ? `NPM ${s.npm} · ` : ""}
            {fmt(s.submitted_at)}
            {s.is_late && <span className="ml-1 font-semibold text-red-600">· Telat</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {graded ? (
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              Nilai: {s.score}
            </span>
          ) : (
            <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Belum dinilai</span>
          )}
          <button
            type="button"
            onClick={() => setGradeOpen((v) => !v)}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {graded ? "Ubah Nilai" : "Nilai"}
          </button>
        </div>
      </div>

      {s.text && <p className="whitespace-pre-wrap text-sm text-gray-700">{s.text}</p>}
      {s.storage_key && (
        <button
          type="button"
          onClick={() => downloadSubmissionFile(s.id, s.file_name)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
        >
          <Icon icon="mdi:paperclip" width={16} height={16} />
          {s.file_name || "Unduh berkas"}
        </button>
      )}
      {graded && s.feedback && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{s.feedback}</p>}

      {gradeOpen && (
        <form onSubmit={submitGrade} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50/60 p-2.5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Skor"
              className="w-24 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm"
            />
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Feedback (opsional)"
              className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setGradeOpen(false)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
              Batal
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              {saving ? "Menyimpan…" : "Simpan Nilai"}
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
