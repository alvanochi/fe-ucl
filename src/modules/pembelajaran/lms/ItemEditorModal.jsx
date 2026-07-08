import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import { toastAlert } from "../../../lib/sweetalert";
import { typeMeta } from "./typeMeta";
import { createItem, uploadItem, replaceUploadItem, updateItem } from "../../../repo/lms";

// Tipe yang punya editor di langkah ini. assignment & exam (CBT) menyusul.
const EDITOR_TYPES = ["page", "url", "video", "pdf", "ppt", "forum"];
const FILE_TYPES = ["pdf", "ppt"];
const ACCEPT = { pdf: "application/pdf,.pdf", ppt: ".ppt,.pptx" };

const emptyForm = {
  title: "",
  description: "",
  is_published: false,
  html: "",
  url: "",
  label: "",
  open_in_new_tab: true,
  youtube_url: "",
  videoTitle: "",
};

/**
 * Editor Item dinamis (sisi dosen). Pilih tipe → form sesuai payload tipe (SPEC v6 §5).
 * - page/url/video/forum: JSON ke createItem/updateItem (backend validasi+sanitasi payload).
 * - pdf/ppt: multipart ke uploadItem (file diverifikasi magic-bytes server-side). Saat EDIT
 *   tipe file, berkas tidak bisa diganti via JSON → hanya judul/terbit yang diubah.
 */
export default function ItemEditorModal({ open, onClose, sectionId, item, onSaved, demo = false }) {
  const isEdit = !!item;
  const [type, setType] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      const p = item.payload || {};
      setType(item.type);
      setForm({
        title: item.title || "",
        description: item.description || "",
        is_published: !!item.is_published,
        html: p.html || "",
        url: p.url || "",
        label: p.label || "",
        open_in_new_tab: p.open_in_new_tab !== undefined ? p.open_in_new_tab : true,
        youtube_url: p.youtube_url || "",
        videoTitle: p.title || "",
      });
    } else {
      setType("");
      setForm(emptyForm);
    }
    setFile(null);
  }, [open, item]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const buildPayload = () => {
    switch (type) {
      case "page":
        return { html: form.html || "" };
      case "url":
        return { url: form.url.trim(), label: form.label || null, open_in_new_tab: form.open_in_new_tab };
      case "video":
        return { youtube_url: form.youtube_url.trim(), title: form.videoTitle || null };
      default:
        // forum: payload kosong. assignment/exam: editor ini belum punya form-nya (menyusul) —
        // JANGAN kirim `null`, backend menolak payload assignment yang bukan object valid.
        // `undefined` membuat axios/JSON.stringify membuang field ini dari body sepenuhnya,
        // sehingga backend melewati payload (nilai lama tetap dipakai, bukan ditimpa).
        return undefined;
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Judul item wajib diisi.";
    if (type === "page" && !form.html.trim()) return "Isi halaman tidak boleh kosong.";
    if (type === "url" && !form.url.trim()) return "URL wajib diisi.";
    if (type === "video" && !form.youtube_url.trim()) return "URL YouTube wajib diisi.";
    if (!isEdit && FILE_TYPES.includes(type) && !file) return "Pilih berkas untuk diunggah.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (demo) return toastAlert("info", "Penyimpanan nonaktif di mode contoh.");
    const err = validate();
    if (err) return toastAlert("warning", err);

    setSaving(true);
    try {
      let res;
      if (!isEdit && FILE_TYPES.includes(type)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", type);
        fd.append("title", form.title.trim());
        fd.append("description", form.description.trim());
        fd.append("is_published", String(form.is_published));
        res = await uploadItem(sectionId, fd);
      } else if (!isEdit) {
        res = await createItem(sectionId, {
          type,
          title: form.title.trim(),
          description: form.description.trim() || null,
          is_published: form.is_published,
          payload: buildPayload(),
        });
      } else if (FILE_TYPES.includes(type) && file) {
        // Berkas baru dipilih saat edit → ganti berkas lewat endpoint upload (multipart);
        // title/description/is_published ikut disertakan agar tidak perlu 2 request.
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", form.title.trim());
        fd.append("description", form.description.trim());
        fd.append("is_published", String(form.is_published));
        res = await replaceUploadItem(item.id, fd);
      } else if (FILE_TYPES.includes(type)) {
        // Tidak ada berkas baru dipilih → tetap pakai berkas lama, cuma metadata yang berubah.
        res = await updateItem(item.id, {
          title: form.title.trim(),
          description: form.description.trim() || null,
          is_published: form.is_published,
        });
      } else {
        res = await updateItem(item.id, {
          title: form.title.trim(),
          description: form.description.trim() || null,
          is_published: form.is_published,
          payload: buildPayload(),
        });
      }

      if (res?.isSuccess === false) {
        toastAlert("error", res.responseMessage || "Gagal menyimpan item.");
        return;
      }
      toastAlert("success", isEdit ? "Item diperbarui." : "Item dibuat.");
      onSaved && onSaved();
      onClose && onClose();
    } catch (err2) {
      toastAlert("error", err2?.response?.data?.responseMessage || "Gagal menyimpan item.");
    } finally {
      setSaving(false);
    }
  };

  // Saat baru dibuka utk edit, `type` state belum sempat disinkronkan dari `item` (efek di
  // atas baru jalan SETELAH render pertama) — fallback ke `item.type` mencegah `meta` null
  // pada render pertama itu (dulu meledak "Cannot read properties of null (reading 'bg')"
  // setiap kali modal edit dibuka, apapun tipe aktivitasnya).
  const meta = type ? typeMeta(type) : item ? typeMeta(item.type) : null;

  return (
    <Modal
      show={open}
      handler={() => !saving && onClose()}
      title={isEdit ? "Edit Item" : type ? `Tambah ${meta.label}` : "Tambah Aktivitas / Sumber"}
      size="lg"
    >
      {/* Pemilih tipe (hanya saat buat & belum pilih) */}
      {!isEdit && !type ? (
        <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
          {EDITOR_TYPES.map((t) => {
            const m = typeMeta(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <span className={classNames("flex h-12 w-12 items-center justify-center rounded-xl", m.bg, m.color)}>
                  <Icon icon={m.icon} width={28} height={28} />
                </span>
                <span className="text-sm font-medium text-gray-700">{m.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 text-left">
          {/* Header tipe */}
          <div className="flex items-center gap-2">
            <span className={classNames("flex h-9 w-9 items-center justify-center rounded-lg", meta.bg, meta.color)}>
              <Icon icon={meta.icon} width={22} height={22} />
            </span>
            <span className="font-semibold text-gray-700">{meta.label}</span>
            {!isEdit && (
              <button type="button" onClick={() => setType("")} className="ml-auto text-sm text-primary-600 hover:underline">
                Ganti tipe
              </button>
            )}
          </div>

          <Form.Group>
            <Form.Label>Judul</Form.Label>
            <Form.Input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-1 w-full" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Deskripsi (opsional)</Form.Label>
            <Form.Textarea
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="mt-1 w-full"
              placeholder="Penjelasan singkat aktivitas ini untuk mahasiswa…"
            />
          </Form.Group>

          {/* Field per tipe */}
          {type === "page" && (
            <Form.Group>
              <Form.Label>Isi Halaman (HTML)</Form.Label>
              <Form.Textarea rows={8} value={form.html} onChange={(e) => set("html", e.target.value)} className="mt-1 w-full font-mono text-sm" placeholder="<h2>Judul</h2><p>Teks materi…</p>" />
              <p className="mt-1 text-xs text-gray-400">HTML akan disanitasi server & klien sebelum ditampilkan.</p>
            </Form.Group>
          )}

          {type === "url" && (
            <>
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Input type="url" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" className="mt-1 w-full" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Label (opsional)</Form.Label>
                <Form.Input type="text" value={form.label} onChange={(e) => set("label", e.target.value)} className="mt-1 w-full" />
              </Form.Group>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Form.Checkbox checked={form.open_in_new_tab} onChange={(e) => set("open_in_new_tab", e.target.checked)} />
                Buka di tab baru
              </label>
            </>
          )}

          {type === "video" && (
            <>
              <Form.Group>
                <Form.Label>URL YouTube</Form.Label>
                <Form.Input type="url" value={form.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/watch?v=…" className="mt-1 w-full" />
                <p className="mt-1 text-xs text-gray-400">ID video diturunkan otomatis oleh server.</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Judul video (opsional)</Form.Label>
                <Form.Input type="text" value={form.videoTitle} onChange={(e) => set("videoTitle", e.target.value)} className="mt-1 w-full" />
              </Form.Group>
            </>
          )}

          {FILE_TYPES.includes(type) && (
            <Form.Group>
              <Form.Label>Berkas {type.toUpperCase()}</Form.Label>
              {isEdit && (
                <p className="mt-1 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500">
                  Berkas saat ini: <b>{item.payload?.file_name || "-"}</b>
                </p>
              )}
              <input
                type="file"
                accept={ACCEPT[type]}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-2 file:text-white"
              />
              {isEdit && (
                <p className="mt-1 text-xs text-gray-400">
                  {file ? `Berkas baru "${file.name}" akan menggantikan berkas lama saat disimpan.` : "Kosongkan untuk tetap memakai berkas saat ini."}
                </p>
              )}
            </Form.Group>
          )}

          {type === "forum" && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Forum dibuat dengan judul di atas. Diskusi (thread) & balasan dikelola langsung di
              halaman aktivitas setelah forum ini disimpan.
            </p>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Form.Checkbox checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
            Terbitkan (terlihat mahasiswa)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => !saving && onClose()} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60">
              {saving && <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />}
              {isEdit ? "Simpan" : "Simpan Item"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
