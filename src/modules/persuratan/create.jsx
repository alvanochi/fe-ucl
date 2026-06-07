import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import Card from "../../components/Card";
import Form from "../../components/Form";
import Layout from "../../components/Layout";
import useCRUD from "../../hooks/useCRUD";
import useUser from "../../hooks/useUser";
import { toastAlert } from "../../lib/sweetalert";

const FIELD_CONFIG = {
  "surat pengajuan cuti": [
    { name: "lama_cuti", label: "Durasi Cuti", placeholder: "Contoh: 1 Semester" },
    { name: "alasan", label: "Alasan Cuti", placeholder: "Contoh: Urusan Keluarga" },
  ],
  "surat pengunduran diri": [{ name: "alasan_keluar", label: "Alasan", placeholder: "Masukkan alasan formal" }],
  "surat pengajuan kegiatan": [
    { name: "nama_kegiatan", label: "Nama Kegiatan", placeholder: "Contoh: Seminar IT" },
    { name: "lokasi", label: "Lokasi", placeholder: "Contoh: Aula Kampus" },
  ],
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function PersuratanCreate({ onBack }) {
  const { user } = useUser({ redirectTo: "/login" });
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/surat`;

  const userRef = useRef(user);
  const penerimaListRef = useRef([]);
  const selectedFilesRef = useRef([]);
  const debounceTimerPenerima = useRef(null);
  const defaultPenerimaCache = useRef([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [penerimaOptions, setPenerimaOptions] = useState([]);
  const [isSearchingPenerima, setIsSearchingPenerima] = useState(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);
  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  const fetchPenerima = useCallback(async (keyword) => {
    if (keyword === "" && defaultPenerimaCache.current.length > 0) {
      setPenerimaOptions(defaultPenerimaCache.current);
      penerimaListRef.current = defaultPenerimaCache.current;
      return;
    }

    setIsSearchingPenerima(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: keyword, limit: 10, page: 1 },
      });

      const rows = res.data?.data?.rows || [];
      const formatted = rows
        .filter((u) => u.user_id !== userRef.current?.user_id)
        .map((u) => ({
          label: `${u.personal_data?.nama_lengkap || u.username} — ${u.role?.toUpperCase() || "USER"}`,
          value: u.user_id,
        }));

      setPenerimaOptions(formatted);
      penerimaListRef.current = formatted;

      if (keyword === "") {
        defaultPenerimaCache.current = formatted;
      }
    } catch {
      toastAlert("error", "Gagal memuat daftar penerima.");
    } finally {
      setIsSearchingPenerima(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchPenerima("");
  }, [user, fetchPenerima]);

  const handleSearchPenerima = useCallback(
    (keyword) => {
      clearTimeout(debounceTimerPenerima.current);

      if (keyword === "") {
        fetchPenerima(keyword);
      } else {
        debounceTimerPenerima.current = setTimeout(() => fetchPenerima(keyword), 800);
      }
    },
    [fetchPenerima],
  );

  const { formdata, submitHandler, isSubmit } = useCRUD(
    API_URL,
    { jenis_surat: "", penerima_id: "", perihal: "", catatan_surat: "" },
    {
      rules: [
        { field: "jenis_surat", label: "Jenis Surat" },
        { field: "penerima_id", label: "Penerima" },
        { field: "perihal", label: "Perihal" },
      ],
      transformData: (data) => {
        const currentUser = userRef.current;
        const currentFiles = selectedFilesRef.current;
        const currentPenerimaList = penerimaListRef.current;

        const fd = new FormData();
        fd.append("jenis_surat", data.jenis_surat || "");
        fd.append("penerima_id", data.penerima_id || "");

        const actorName = currentUser?.personal_data?.nama_lengkap || currentUser?.username || "Sistem";
        const actorRole = currentUser?.role ? currentUser.role.toUpperCase() : "USER";
        fd.append("nama_aktor", `${actorName} (${actorRole})`);

        const penerimaItem = currentPenerimaList.find((p) => String(p.value) === String(data.penerima_id));
        if (penerimaItem) fd.append("nama_penerima", penerimaItem.label);

        const { jenis_surat, penerima_id, perihal, catatan_surat, ...dynamicFields } = data;
        const jsonPayload = { perihal, catatan_surat, ...dynamicFields };

        try {
          fd.append("form_data", JSON.stringify(jsonPayload));
        } catch (e) {
          console.error("Failed to stringify form_data", e);
        }

        currentFiles.forEach((file) => fd.append("lampiran", file));
        return fd;
      },
      success: () => {
        toastAlert("success", "Pengajuan berhasil dikirim!");
        onBack();
      },
    },
  );

  const { form, inputHandler } = formdata;

  const handleFileChange = (e) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);

    if (selectedFiles.length + newFiles.length > MAX_FILES) {
      toastAlert("warning", `Maksimal mengunggah ${MAX_FILES} lampiran.`);
      e.target.value = null;
      return;
    }
    const oversizedFiles = newFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toastAlert("warning", `File "${oversizedFiles[0].name}" melebihi batas 10MB.`);
      e.target.value = null;
      return;
    }
    const existingNames = selectedFiles.map((f) => f.name);
    const uniqueNew = newFiles.filter((f) => !existingNames.includes(f.name));
    if (uniqueNew.length < newFiles.length) toastAlert("info", "Beberapa file duplikat diabaikan.");
    setSelectedFiles((prev) => [...prev, ...uniqueNew]);
    e.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  if (!user) return null;

  const hasDynamicFields = FIELD_CONFIG[form.jenis_surat]?.length > 0;

  return (
    <Layout>
      <>
        <Head>
          <title>Buat Pengajuan | UCL</title>
        </Head>

        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-full border border-gray-200 bg-white shadow-sm transition-all active:scale-95 text-gray-600 outline-none focus:ring-2 focus:ring-primary-500">
            <Icon icon="mdi:arrow-left" width={24} />
          </button>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-800 tracking-tight">Pengajuan Baru</h1>
        </div>

        <Form onSubmit={submitHandler} type="formdata">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden h-full">
                <Card.Header className="bg-primary-600 text-white text-[11px] font-black uppercase py-3.5 text-center tracking-widest border-none">Langkah 1: Kategori</Card.Header>
                <Card.Body className="p-6">
                  <Form.Group className="space-y-3">
                    <Form.Label className="font-bold text-gray-700">Pilih Jenis Surat</Form.Label>
                    <Form.Select
                      name="jenis_surat"
                      value={form.jenis_surat}
                      onChange={inputHandler}
                      emptyStateLabel="-- Pilih Jenis Surat --"
                      options={[
                        { label: "Surat Pengajuan Cuti", value: "surat pengajuan cuti" },
                        { label: "Surat Pengunduran Diri", value: "surat pengunduran diri" },
                        ...(user?.role?.toLowerCase() === "dosen" ? [{ label: "Surat Pengajuan Kegiatan", value: "surat pengajuan kegiatan" }] : []),
                      ]}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>

            <div className="xl:col-span-2">
              {!form.jenis_surat ? (
                <div className="h-full min-h-[350px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 p-6 text-center animate-in fade-in">
                  <Icon icon="mdi:file-document-edit-outline" width={64} className="mb-4 opacity-30 text-primary-500" />
                  <p className="font-bold text-base text-gray-600">Formulir Belum Tersedia</p>
                  <p className="text-sm mt-1">Silakan pilih jenis surat di sebelah kiri terlebih dahulu.</p>
                </div>
              ) : (
                <Card className="animate-in fade-in slide-in-from-right-4 shadow-md border border-gray-200 rounded-2xl overflow-hidden">
                  <Card.Header className="bg-primary-600 text-white text-[11px] font-black uppercase py-3.5 text-center tracking-widest border-none">Langkah 2: Lengkapi Data</Card.Header>
                  <Card.Body className="space-y-6 p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Form.Group className="space-y-2">
                        <Form.Label className="font-bold text-gray-700 flex justify-between">
                          <span>Penerima Tujuan</span>
                          {isSearchingPenerima && <Icon icon="mdi:loading" className="animate-spin text-primary-500" width={16} />}
                        </Form.Label>
                        <Form.Combobox
                          name="penerima_id"
                          value={form.penerima_id}
                          onChange={inputHandler}
                          onSearch={handleSearchPenerima}
                          options={penerimaOptions}
                          placeholder="Ketik nama untuk mencari..."
                          isLoading={isSearchingPenerima}
                          isDisabled={isSearchingPenerima}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="space-y-2">
                        <Form.Label className="font-bold text-gray-700">Perihal / Topik Surat</Form.Label>
                        <Form.Input name="perihal" value={form.perihal || ""} onChange={inputHandler} placeholder="Contoh: Permohonan Izin" required />
                      </Form.Group>
                    </div>

                    {hasDynamicFields && (
                      <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
                        {FIELD_CONFIG[form.jenis_surat].map((field, idx) => (
                          <Form.Group key={idx} className="space-y-2">
                            <Form.Label className="font-bold text-gray-700">{field.label}</Form.Label>
                            <Form.Input name={field.name} value={form[field.name] || ""} onChange={inputHandler} placeholder={field.placeholder} required />
                          </Form.Group>
                        ))}
                      </div>
                    )}

                    <Form.Group className="space-y-2">
                      <Form.Label className="font-bold text-gray-700">Catatan Surat</Form.Label>
                      <Form.Textarea name="catatan_surat" value={form.catatan_surat || ""} onChange={inputHandler} placeholder="Tambahkan catatan khusus terkait surat ini..." rows={3} />
                    </Form.Group>

                    <Form.Group className="space-y-4 border-t border-gray-100 pt-6">
                      <Form.Label className="font-black text-[11px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Icon icon="mdi:paperclip" width={16} /> Lampiran Dokumen Tambahan (Max 5 File)
                      </Form.Label>

                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-primary-500 hover:bg-primary-50/30 bg-gray-50/50 text-center group transition-all">
                        <input type="file" onChange={handleFileChange} accept=".pdf, .jpg, .jpeg, .png" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="" />
                        <Icon icon="mdi:cloud-upload-outline" width={48} className="mx-auto text-gray-400 group-hover:text-primary-600 transition-colors" />
                        <p className="mt-3 text-sm font-bold text-gray-600 group-hover:text-primary-700">Klik atau seret file dokumen ke sini</p>
                        <p className="mt-1 text-[11px] text-gray-400 font-medium">Mendukung PDF, JPG, PNG (Max 10MB/file)</p>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-5 space-y-2 animate-in fade-in">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Daftar File</p>
                            <p className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                              {selectedFiles.length} / {MAX_FILES}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:border-primary-300 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Icon icon={file.type === "application/pdf" ? "mdi:file-pdf-box" : "mdi:image"} className={file.type === "application/pdf" ? "text-red-500 shrink-0" : "text-blue-500 shrink-0"} width={28} />
                                  <div className="truncate text-xs">
                                    <p className="font-bold text-gray-700 truncate max-w-[150px]">{file.name}</p>
                                    <p className="text-gray-400 font-mono mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => removeFile(index)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors active:scale-95 outline-none">
                                  <Icon icon="mdi:close" width={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Form.Group>

                    <div className="pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isSubmit}
                        className="w-full h-12 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        {isSubmit ? (
                          <>
                            <Icon icon="mdi:loading" className="animate-spin" width={20} />
                            <span>Memproses Data...</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:send-outline" width={18} />
                            <span>Kirim Pengajuan Surat</span>
                          </>
                        )}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </Form>
      </>
    </Layout>
  );
}
