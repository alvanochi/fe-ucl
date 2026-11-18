import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import { toastAlert } from "../../../lib/sweetalert";
import { createSection, updateSection } from "../../../repo/lms";

/**
 * Editor Topik (section) — buat/edit. SPEC v6 §4. Identitas dosen & kelas TIDAK dikirim
 * dari sini selain kelasKuliahId (backend mengisi id_lecture dari JWT).
 */
export default function TopicEditorModal({ open, onClose, kelasKuliahId, section, onSaved, demo = false }) {
  const isEdit = !!section;
  const [form, setForm] = useState({ title: "", pertemuan: "", description: "", is_published: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      section
        ? {
            title: section.title || "",
            pertemuan: section.pertemuan ?? "",
            description: section.description || "",
            is_published: !!section.is_published,
          }
        : { title: "", pertemuan: "", description: "", is_published: false }
    );
  }, [open, section]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (demo) return toastAlert("info", "Penyimpanan nonaktif di mode contoh.");
    if (!form.title.trim()) return toastAlert("warning", "Judul topik wajib diisi.");
    if (form.pertemuan === "" || Number.isNaN(parseInt(form.pertemuan, 10)))
      return toastAlert("warning", "Pertemuan wajib berupa angka.");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        pertemuan: parseInt(form.pertemuan, 10),
        description: form.description || null,
        is_published: form.is_published,
      };
      const res = isEdit
        ? await updateSection(section.id, payload)
        : await createSection({ kelasKuliahId, ...payload });

      if (res?.isSuccess === false) {
        toastAlert("error", res.responseMessage || "Gagal menyimpan topik.");
        return;
      }
      toastAlert("success", isEdit ? "Topik diperbarui." : "Topik dibuat.");
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      toastAlert("error", err?.response?.data?.responseMessage || "Gagal menyimpan topik.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={open} handler={() => !saving && onClose()} title={isEdit ? "Edit Topik" : "Tambah Topik"} size="base">
      <form onSubmit={submit} className="space-y-4 text-left">
        <Form.Group>
          <Form.Label>Judul Topik</Form.Label>
          <Form.Input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="mis. Pertemuan 1 — Pengantar"
            className="mt-1 w-full"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Pertemuan ke-</Form.Label>
          <Form.Input
            type="number"
            min="1"
            value={form.pertemuan}
            onChange={(e) => set("pertemuan", e.target.value)}
            className="mt-1 w-full"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Deskripsi (opsional)</Form.Label>
          <Form.Textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="mt-1 w-full"
          />
        </Form.Group>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <Form.Checkbox checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Terbitkan topik (terlihat mahasiswa)
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => !saving && onClose()} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-60">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />}
            {isEdit ? "Simpan" : "Buat Topik"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
