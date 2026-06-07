import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Modal from "../Modal";
import Form from "../Form";
import Button from "../Button";
import { toastAlert } from "../../lib/sweetalert";
import useUser from "../../hooks/useUser";

export default function DisposisiModal({ show, onClose, onSubmit }) {
  const { user } = useUser();
  const userRef = useRef(user);

  const [targetDisposisi, setTargetDisposisi] = useState("");
  const [catatanDisposisi, setCatatanDisposisi] = useState("");
  const [fileDisposisi, setFileDisposisi] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);
  const defaultUserCache = useRef([]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (show) fetchUsers("");
  }, [show]);

  const fetchUsers = useCallback(async (keyword) => {
    if (keyword === "" && defaultUserCache.current.length > 0) {
      setUserOptions(defaultUserCache.current);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: keyword, limit: 10, page: 1 },
      });

      const rows = res.data?.data?.rows || [];
      const formatted = rows
        .filter((u) => String(u.user_id) !== String(userRef.current?.user_id))
        .map((u) => ({
          label: `${u.personal_data?.nama_lengkap || u.username} — ${u.role?.toUpperCase() || "USER"}`,
          value: u.user_id,
        }));

      setUserOptions(formatted);

      if (keyword === "") {
        defaultUserCache.current = formatted;
      }
    } catch {
      toastAlert("error", "Gagal memuat daftar user.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback(
    (keyword) => {
      clearTimeout(debounceTimer.current);
      if (keyword === "") {
        fetchUsers(keyword);
      } else if (keyword.length < 3) {
        return;
      } else {
        debounceTimer.current = setTimeout(() => fetchUsers(keyword), 800);
      }
    },
    [fetchUsers],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(targetDisposisi, catatanDisposisi, fileDisposisi, resetForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTargetDisposisi("");
    setCatatanDisposisi("");
    setFileDisposisi(null);
    setUserOptions([]);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      e.target.value = null;
      return toastAlert("error", "Ukuran file lampiran maksimal 10MB!");
    }
    setFileDisposisi(file);
  };

  if (!user) return null;

  return (
    <Modal title="Disposisi Surat" show={show} handler={resetForm}>
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Form.Group>
          <Form.Label>Pilih Tujuan Disposisi</Form.Label>
          <Form.Combobox
            name="target_disposisi"
            value={targetDisposisi}
            onChange={(e) => setTargetDisposisi(e.target.value)}
            onSearch={handleSearch}
            options={userOptions}
            placeholder="Ketik nama untuk mencari penerima..."
            isLoading={isSearching}
            isDisabled={isSubmitting}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Catatan Disposisi (Opsional)</Form.Label>
          <Form.Textarea value={catatanDisposisi} onChange={(e) => setCatatanDisposisi(e.target.value)} placeholder="Tambahkan instruksi atau catatan ke pihak selanjutnya..." rows={3} disabled={isSubmitting} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Lampiran Tambahan (Max 1 File, 10MB)</Form.Label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all cursor-pointer border border-gray-200 rounded-xl disabled:opacity-60"
          />
        </Form.Group>

        <div className="flex gap-2 justify-end mt-6">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Kirim Disposisi"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
