import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import { toastAlert } from "../../../lib/sweetalert";
import { typeMeta } from "./typeMeta";
import { createItem, uploadItem, replaceUploadItem, updateItem } from "../../../repo/lms";
import axiosCbt from "../../../lib/axiosCbt";
import { bootstrapCbtToken } from "../../../lib/cbtAuth";

const EDITOR_TYPES = ["page", "url", "video", "pdf", "ppt", "forum", "assignment", "exam"];
const FILE_TYPES = ["pdf", "ppt"];
const ACCEPT = { pdf: "application/pdf,.pdf", ppt: ".ppt,.pptx" };
// Sinkron dengan SUBMISSION_FILE_TYPES di lib/lms/payloadValidators.js (tias-backend).
const SUBMISSION_FILE_TYPES = ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "png", "zip"];

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
  cbt_exam_id: "",
  cbt_nama_ujian: "",
  instructions: "",
  due_at: "",
  max_score: "",
  allow_late: true,
  allowed_file_types: [],
};

// ISO datetime → value untuk <input type="datetime-local"> (jam lokal browser).
function isoToDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
  const [cbtExams, setCbtExams] = useState([]);
  const [cbtExamsState, setCbtExamsState] = useState("idle"); // idle | loading | ready | error
  const [openingCbt, setOpeningCbt] = useState(false);

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
        cbt_exam_id: p.cbt_exam_id || "",
        cbt_nama_ujian: p.cbt_nama_ujian || "",
        instructions: p.instructions || "",
        due_at: isoToDatetimeLocal(p.due_at),
        max_score: p.max_score != null ? String(p.max_score) : "",
        allow_late: p.allow_late !== undefined ? p.allow_late : true,
        allowed_file_types: Array.isArray(p.allowed_file_types) ? p.allowed_file_types : [],
      });
    } else {
      setType("");
      setForm(emptyForm);
    }
    setFile(null);
    setCbtExams([]);
    setCbtExamsState("idle");
  }, [open, item]);

  // Daftar ujian CBT milik dosen ybs (cbt-api sudah scope by kode_dosen === req.user.id)
  // — diambil langsung (native) begitu tipe "exam" dipilih.
  useEffect(() => {
    if (type !== "exam" || cbtExamsState !== "idle") return;
    setCbtExamsState("loading");
    axiosCbt
      .get("/api/exams")
      .then((res) => {
        setCbtExams(res.data?.data || []);
        setCbtExamsState("ready");
      })
      .catch(() => setCbtExamsState("error"));
  }, [type, cbtExamsState]);

  // Bridge, bukan link mentah — dosen sudah login di LMS, jangan disuruh login/daftar
  // ulang manual di CBT. Sama seperti tombol "Ikuti Ujian" di ExamRenderer.
  const openCbtToCreateExam = async () => {
    setOpeningCbt(true);
    try {
      const cbtToken = await bootstrapCbtToken();
      const url = `${process.env.NEXT_PUBLIC_CBT_WEB_URL}/sso?token=${encodeURIComponent(cbtToken)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (_) {
      toastAlert("error", "Gagal membuka Sistem CBT. Coba lagi.");
    } finally {
      setOpeningCbt(false);
    }
  };

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const buildPayload = () => {
    switch (type) {
      case "page":
        return { html: form.html || "" };
      case "url":
        return { url: form.url.trim(), label: form.label || null, open_in_new_tab: form.open_in_new_tab };
      case "video":
        return { youtube_url: form.youtube_url.trim(), title: form.videoTitle || null };
      case "exam":
        return { cbt_exam_id: form.cbt_exam_id, cbt_nama_ujian: form.cbt_nama_ujian || null };
      case "assignment":
        return {
          instructions: form.instructions.trim() || null,
          due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
          max_score: Number(form.max_score),
          allow_late: form.allow_late,
          allowed_file_types: form.allowed_file_types.length ? form.allowed_file_types : null,
        };
      default:
        // forum: payload kosong. JANGAN kirim `null` untuk tipe berpayload — backend menolak
        // payload yang bukan object valid. `undefined` membuat axios/JSON.stringify membuang
        // field ini dari body sepenuhnya, sehingga backend melewati payload (nilai lama tetap
        // dipakai, bukan ditimpa).
        return undefined;
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Judul item wajib diisi.";
    if (type === "page" && !form.html.trim()) return "Isi halaman tidak boleh kosong.";
    if (type === "url" && !form.url.trim()) return "URL wajib diisi.";
    if (type === "video" && !form.youtube_url.trim()) return "URL YouTube wajib diisi.";
    if (type === "exam" && !form.cbt_exam_id) return "Pilih ujian CBT terlebih dahulu.";
    if (type === "assignment") {
      const score = Number(form.max_score);
      if (!form.max_score || !Number.isFinite(score) || score <= 0) {
        return "Skor maksimum wajib diisi (angka > 0).";
      }
    }
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

          {type === "exam" && (
            <Form.Group>
              <Form.Label>Ujian CBT</Form.Label>
              {cbtExamsState === "loading" && (
                <p className="mt-1 text-sm text-gray-500">Memuat daftar ujian…</p>
              )}
              {cbtExamsState === "error" && (
                <p className="mt-1 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  Gagal memuat daftar ujian dari sistem CBT. Pastikan akun Anda sudah terdaftar di sana, lalu coba lagi.
                </p>
              )}
              {cbtExamsState === "ready" && cbtExams.length === 0 && (
                <div className="mt-1 space-y-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  <p>Anda belum punya ujian CBT. Buat dulu di Sistem CBT, lalu kembali ke sini.</p>
                  <button
                    type="button"
                    onClick={openCbtToCreateExam}
                    disabled={openingCbt}
                    className="font-semibold underline disabled:opacity-60"
                  >
                    {openingCbt ? "Membuka…" : "Buat ujian di Sistem CBT"}
                  </button>
                </div>
              )}
              {cbtExamsState === "ready" && cbtExams.length > 0 && (
                <select
                  value={form.cbt_exam_id}
                  onChange={(e) => {
                    const selected = cbtExams.find((x) => String(x.id) === e.target.value);
                    set("cbt_exam_id", selected ? selected.id : "");
                    set("cbt_nama_ujian", selected ? selected.nama_ujian : "");
                  }}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">— Pilih ujian —</option>
                  {cbtExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.nama_ujian} ({exam.mata_kuliah?.nama_mk || exam.kode_mk})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Mahasiswa akan diarahkan ke Sistem CBT untuk mengerjakan ujian ini & memasukkan token yang Anda umumkan di kelas.
              </p>
            </Form.Group>
          )}

          {type === "assignment" && (
            <>
              <Form.Group>
                <Form.Label>Instruksi (opsional)</Form.Label>
                <Form.Textarea
                  rows={5}
                  value={form.instructions}
                  onChange={(e) => set("instructions", e.target.value)}
                  className="mt-1 w-full"
                  placeholder="Jelaskan apa yang harus dikerjakan mahasiswa…"
                />
              </Form.Group>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Form.Group>
                  <Form.Label>Tenggat (opsional)</Form.Label>
                  <Form.Input
                    type="datetime-local"
                    value={form.due_at}
                    onChange={(e) => set("due_at", e.target.value)}
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-gray-400">Kosongkan = selalu terbuka, tanpa batas waktu.</p>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Skor Maksimum</Form.Label>
                  <Form.Input
                    type="number"
                    min="1"
                    value={form.max_score}
                    onChange={(e) => set("max_score", e.target.value)}
                    className="mt-1 w-full"
                    placeholder="100"
                  />
                </Form.Group>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Form.Checkbox checked={form.allow_late} onChange={(e) => set("allow_late", e.target.checked)} />
                Terima pengumpulan telat (ditandai &ldquo;Telat&rdquo;, tetap bisa dikirim setelah tenggat)
              </label>
              <Form.Group>
                <Form.Label>Tipe berkas yang diizinkan (opsional)</Form.Label>
                <div className="mt-1 flex flex-wrap gap-3">
                  {SUBMISSION_FILE_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Form.Checkbox
                        checked={form.allowed_file_types.includes(t)}
                        onChange={(e) =>
                          set(
                            "allowed_file_types",
                            e.target.checked
                              ? [...form.allowed_file_types, t]
                              : form.allowed_file_types.filter((x) => x !== t)
                          )
                        }
                      />
                      {t}
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">Tidak dicentang sama sekali = semua tipe di atas diizinkan.</p>
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
