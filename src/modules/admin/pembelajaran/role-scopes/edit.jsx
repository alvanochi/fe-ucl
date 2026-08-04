import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import Form from "../../../../components/Form";
import { LMS_BASE, useLmsAcademicUnits } from "../../../../repo/lms";
import { ROLE_KEY_OPTIONS, SCOPE_TYPE_BY_ROLE } from "./constants";

// Tidak ada GET /role-scopes/:id di backend — baris tabel (dari list yang sudah
// di-load) dipakai langsung sebagai sumber data awal, tidak perlu fetch ulang.
const EditRoleScope = ({ scope, onAction }) => {
  const { show, toggle, close } = useModal();
  const { units } = useLmsAcademicUnits();

  const fakultasOptions = Array.from(
    new Map(units.filter((u) => u.fakultas_id).map((u) => [u.fakultas_id, u])).values()
  ).map((u) => ({ value: u.fakultas_id, label: u.nama_fakultas || u.fakultas_id }));

  const prodiOptions = units.map((u) => ({
    value: u.prodi_id,
    label: `${u.nama_prodi || u.kode_prodi} (${u.nama_fakultas || "-"})`,
  }));

  const [roleKey, setRoleKey] = useState(scope.role_key);
  const [fakultasId, setFakultasId] = useState(scope.fakultas_id || "");
  const [prodiId, setProdiId] = useState(scope.prodi_id || "");
  const [manageContent, setManageContent] = useState(!!scope.permissions?.lms_manage_content);
  const [siakSync, setSiakSync] = useState(!!scope.permissions?.siak_sync);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    setRoleKey(scope.role_key);
    setFakultasId(scope.fakultas_id || "");
    setProdiId(scope.prodi_id || "");
    setManageContent(!!scope.permissions?.lms_manage_content);
    setSiakSync(!!scope.permissions?.siak_sync);
  }, [show, scope]);

  const scopeType = SCOPE_TYPE_BY_ROLE[roleKey];

  const submitHandler = async (event) => {
    event.preventDefault();
    if (scopeType === "faculty" && !fakultasId) return toastAlert("error", "Pilih fakultas terlebih dahulu.");
    if (scopeType === "study_program" && !prodiId) return toastAlert("error", "Pilih prodi terlebih dahulu.");

    setSaving(true);
    try {
      await axios.patch(`${LMS_BASE()}/role-scopes/${scope.id}`, {
        role_key: roleKey,
        scope_type: scopeType,
        fakultas_id: scopeType === "faculty" ? fakultasId : null,
        prodi_id: scopeType === "study_program" ? prodiId : null,
        permissions: { lms_manage_content: manageContent, siak_sync: siakSync },
      });
      toastAlert("success", "Scope LMS berhasil diperbarui.");
      close();
      onAction();
    } catch (error) {
      if (error.name === "AxiosError" && error?.response) {
        toastAlert("error", error.response.data.responseMessage || "Gagal memperbarui scope LMS.");
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
      <Button.Icon
        variant="secondary"
        icon={<Icon icon="bx:edit" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Edit Role Admin LMS" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
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

export default EditRoleScope;
