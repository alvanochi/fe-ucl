import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import { LMS_BASE, useLmsAcademicUnits } from "../../../../repo/lms";
import { ROLE_KEY_OPTIONS, SCOPE_TYPE_BY_ROLE } from "./constants";

const CreateRoleScope = ({ onAction }) => {
  const { show, toggle, close } = useModal();
  const { units } = useLmsAcademicUnits();

  const fakultasOptions = Array.from(
    new Map(units.filter((u) => u.fakultas_id).map((u) => [u.fakultas_id, u])).values()
  ).map((u) => ({ value: u.fakultas_id, label: u.nama_fakultas || u.fakultas_id }));

  const prodiOptions = units.map((u) => ({
    value: u.prodi_id,
    label: `${u.nama_prodi || u.kode_prodi} (${u.nama_fakultas || "-"})`,
  }));

  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleKey, setRoleKey] = useState("");
  const [fakultasId, setFakultasId] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [manageContent, setManageContent] = useState(false);
  const [siakSync, setSiakSync] = useState(false);
  const [saving, setSaving] = useState(false);

  const scopeType = SCOPE_TYPE_BY_ROLE[roleKey];

  const searchUsers = async (term) => {
    if (!term || term.trim().length < 2) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/list-users`, {
        params: { search: term, limit: 10 },
      });
      const rows = res.data?.data?.rows || [];
      setUserOptions(
        rows.map((u) => ({
          value: u.user_id,
          label: `${u.personal_data?.nama_lengkap || u.email} — ${u.role}`,
        }))
      );
    } catch (_) {
      // biarkan dropdown kosong, form tetap bisa dicoba ulang
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setUserOptions([]);
    setRoleKey("");
    setFakultasId("");
    setProdiId("");
    setManageContent(false);
    setSiakSync(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!selectedUser?.value) return toastAlert("error", "Pilih pengguna terlebih dahulu.");
    if (!roleKey) return toastAlert("error", "Pilih peran terlebih dahulu.");
    if (scopeType === "faculty" && !fakultasId) return toastAlert("error", "Pilih fakultas terlebih dahulu.");
    if (scopeType === "study_program" && !prodiId) return toastAlert("error", "Pilih prodi terlebih dahulu.");

    setSaving(true);
    try {
      await axios.post(`${LMS_BASE()}/role-scopes`, {
        user_id: selectedUser.value,
        role_key: roleKey,
        scope_type: scopeType,
        fakultas_id: scopeType === "faculty" ? fakultasId : undefined,
        prodi_id: scopeType === "study_program" ? prodiId : undefined,
        permissions: { lms_manage_content: manageContent, siak_sync: siakSync },
      });
      toastAlert("success", "Scope LMS berhasil dibuat.");
      resetForm();
      close();
      onAction();
    } catch (error) {
      if (error.name === "AxiosError" && error?.response) {
        toastAlert("error", error.response.data.responseMessage || "Gagal membuat scope LMS.");
      } else {
        loadingAlert();
        MySwal.close();
        toastAlert("error", error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Tambah Scope
      </Button>
      <Modal title="Tambah Role Admin LMS" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Pengguna <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <div className="flex-1">
              <Select
                placeholder="Ketik nama/email untuk cari…"
                value={selectedUser}
                options={userOptions}
                onChange={(option) => setSelectedUser(option)}
                onInputChange={(term, meta) => {
                  if (meta.action === "input-change") searchUsers(term);
                }}
                isClearable
              />
            </div>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Peran <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
              name="role_key"
              className="flex-1"
              options={ROLE_KEY_OPTIONS}
              value={roleKey}
              onChange={(e) => {
                setRoleKey(e.target.value);
                setFakultasId("");
                setProdiId("");
              }}
              required
            />
          </Form.Group>
          {scopeType === "faculty" && (
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[8rem]">
                Fakultas <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                name="fakultas_id"
                className="flex-1"
                options={fakultasOptions}
                value={fakultasId}
                onChange={(e) => setFakultasId(e.target.value)}
                required
              />
            </Form.Group>
          )}
          {scopeType === "study_program" && (
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[8rem]">
                Prodi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                name="prodi_id"
                className="flex-1"
                options={prodiOptions}
                value={prodiId}
                onChange={(e) => setProdiId(e.target.value)}
                required
              />
            </Form.Group>
          )}
          {roleKey && (
            <Form.Group className="space-y-2">
              <Form.Label>Izin Tambahan</Form.Label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Form.Checkbox
                  checked={manageContent}
                  onChange={(e) => setManageContent(e.target.checked)}
                />
                Bisa kelola konten LMS (bukan cuma lihat & lapor)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Form.Checkbox
                  checked={siakSync}
                  onChange={(e) => setSiakSync(e.target.checked)}
                />
                Bisa jalankan sinkronisasi SIAK
              </label>
            </Form.Group>
          )}

          <div className="flex gap-4 mt-12">
            <Button type="button" variant="secondary" onClick={close}>
              Tutup
            </Button>
            <Button type="submit" variant="primary" className="w-full h-12" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateRoleScope;
