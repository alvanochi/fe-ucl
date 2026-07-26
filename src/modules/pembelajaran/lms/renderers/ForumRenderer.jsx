import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import useUser from "../../../../hooks/useUser";
import { toastAlert, warningAlert } from "../../../../lib/sweetalert";
import {
  useLmsThreads,
  useLmsThread,
  createThread,
  updateThreadFlags,
  deleteThread,
  createPost,
  deletePost,
} from "../../../../repo/lms";

const fmt = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch (_) {
    return "";
  }
};

/**
 * Renderer tipe Forum (SPEC v6 §5.6) — thread + balasan 1-level. `manage` = afordansi
 * moderator (pin/lock/hapus thread orang lain) diaktifkan dosen pengampu/admin di UI;
 * backend tetap sumber kebenaran otorisasi (forumModerator middleware).
 */
export default function ForumRenderer({ item, demo = false, manage = false }) {
  const [activeThreadId, setActiveThreadId] = useState(null);

  if (demo) {
    return (
      <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
        Forum diskusi tidak aktif di mode contoh.
      </p>
    );
  }

  return activeThreadId ? (
    <ThreadDetail
      threadId={activeThreadId}
      manage={manage}
      onBack={() => setActiveThreadId(null)}
      onDeleted={() => setActiveThreadId(null)}
    />
  ) : (
    <ThreadList itemId={item.id} onOpenThread={setActiveThreadId} />
  );
}

function ThreadList({ itemId, onOpenThread }) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const { threads, totalPage, isLoading, mutate } = useLmsThreads(itemId, { page, limit: 10 });

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toastAlert("warning", "Judul diskusi wajib diisi.");
    setSaving(true);
    try {
      const res = await createThread(itemId, { title: title.trim(), body: body.trim() || undefined });
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal membuat diskusi.");
      setTitle("");
      setBody("");
      setShowForm(false);
      await mutate();
      toastAlert("success", "Diskusi dibuat.");
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal membuat diskusi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{threads.length > 0 ? "Pilih diskusi untuk membuka." : "Belum ada diskusi."}</p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          <Icon icon="mdi:plus" width={18} height={18} />
          Diskusi Baru
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul diskusi"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Isi diskusi (opsional)…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
              Batal
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              {saving ? "Menyimpan…" : "Buat Diskusi"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="py-6 text-center text-sm text-gray-400">Memuat diskusi…</p>
      ) : threads.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 text-center">
          <Icon icon="mdi:forum-outline" width={36} height={36} className="text-gray-300" />
          <p className="text-sm text-gray-400">Mulai diskusi pertama di forum ini.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onOpenThread(t.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 text-left transition hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Icon icon="mdi:forum-outline" width={20} height={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    {t.is_pinned && <Icon icon="mdi:pin" className="text-amber-500" width={15} height={15} title="Disematkan" />}
                    {t.is_locked && <Icon icon="mdi:lock-outline" className="text-gray-400" width={15} height={15} title="Terkunci" />}
                    <span className="truncate font-medium text-gray-800">{t.title}</span>
                  </span>
                  <span className="block text-xs text-gray-400">{fmt(t.created_at)}</span>
                </span>
                <Icon icon="mdi:chevron-right" width={20} height={20} className="shrink-0 text-gray-300" />
              </button>
            </li>
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

function ThreadDetail({ threadId, manage, onBack, onDeleted }) {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const { thread, posts, totalPage, isLoading, mutate } = useLmsThread(threadId, { page, limit: 20 });

  const isOwnerPost = (p) => user && p.author_id === user.user_id;

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return toastAlert("warning", "Balasan tidak boleh kosong.");
    setSending(true);
    try {
      const res = await createPost(threadId, { body: reply.trim() });
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal mengirim balasan.");
      setReply("");
      await mutate();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal mengirim balasan.");
    } finally {
      setSending(false);
    }
  };

  const toggleFlag = async (key) => {
    try {
      const res = await updateThreadFlags(threadId, { [key]: !thread[key] });
      if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal memperbarui thread.");
      await mutate();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal memperbarui thread.");
    }
  };

  const removeThread = () =>
    warningAlert(async () => {
      try {
        const res = await deleteThread(threadId);
        if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal menghapus thread.");
        toastAlert("success", "Diskusi dihapus.");
        onDeleted && onDeleted();
      } catch (err) {
        toastAlert("error", err?.response?.data?.responseMessage || "Gagal menghapus thread.");
      }
    }, "Diskusi beserta seluruh balasannya akan dihapus.");

  const removePost = (post) =>
    warningAlert(async () => {
      try {
        const res = await deletePost(post.id);
        if (res?.isSuccess === false) return toastAlert("error", res.responseMessage || "Gagal menghapus balasan.");
        await mutate();
      } catch (err) {
        toastAlert("error", err?.response?.data?.responseMessage || "Gagal menghapus balasan.");
      }
    }, "Balasan ini akan dihapus.");

  return (
    <div className="space-y-3">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
        <Icon icon="mdi:chevron-left" width={18} height={18} />
        Kembali ke daftar diskusi
      </button>

      {isLoading || !thread ? (
        <p className="py-6 text-center text-sm text-gray-400">Memuat diskusi…</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {thread.is_pinned && <Icon icon="mdi:pin" className="text-amber-500" width={16} height={16} title="Disematkan" />}
              {thread.is_locked && <Icon icon="mdi:lock-outline" className="text-gray-400" width={16} height={16} title="Terkunci" />}
              <span className="font-semibold text-gray-800">{thread.title}</span>
            </div>
            {manage && (
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => toggleFlag("is_pinned")} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" title={thread.is_pinned ? "Lepas sematan" : "Sematkan"}>
                  <Icon icon={thread.is_pinned ? "mdi:pin-off" : "mdi:pin"} width={17} height={17} />
                </button>
                <button type="button" onClick={() => toggleFlag("is_locked")} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" title={thread.is_locked ? "Buka kunci" : "Kunci diskusi"}>
                  <Icon icon={thread.is_locked ? "mdi:lock-open-outline" : "mdi:lock-outline"} width={17} height={17} />
                </button>
                <button type="button" onClick={removeThread} className="rounded-lg p-1.5 text-gray-500 hover:bg-danger-100 hover:text-danger-700" title="Hapus diskusi">
                  <Icon icon="mdi:trash-can-outline" width={17} height={17} />
                </button>
              </div>
            )}
          </div>

          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.id} className={classNames("rounded-xl border px-3 py-2.5", isOwnerPost(p) ? "border-primary-100 bg-primary-50/40" : "border-gray-100 bg-white")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{p.body}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {isOwnerPost(p) ? "Anda" : "Peserta diskusi"} · {fmt(p.created_at)}
                      {p.edited && " · diedit"}
                    </p>
                  </div>
                  {(isOwnerPost(p) || manage) && (
                    <button type="button" onClick={() => removePost(p)} className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-danger-100 hover:text-danger-700" title="Hapus balasan">
                      <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
            {posts.length === 0 && <p className="py-4 text-center text-sm text-gray-400">Belum ada balasan.</p>}
          </ul>

          {totalPage > 1 && (
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-30">
                <Icon icon="mdi:chevron-left" width={18} height={18} />
              </button>
              Halaman {page}/{totalPage}
              <button type="button" disabled={page >= totalPage} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-gray-200 px-2 py-1 disabled:opacity-30">
                <Icon icon="mdi:chevron-right" width={18} height={18} />
              </button>
            </div>
          )}

          {thread.is_locked && !manage ? (
            <p className="rounded-xl bg-gray-50 px-3 py-2 text-center text-sm text-gray-500">Diskusi ini dikunci; tidak menerima balasan baru.</p>
          ) : (
            <form onSubmit={sendReply} className="flex items-end gap-2">
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Tulis balasan…"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button type="submit" disabled={sending} className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
                {sending ? "…" : "Kirim"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
