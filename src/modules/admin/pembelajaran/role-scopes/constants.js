// Metadata role scope LMS — dipakai index/create/edit supaya label & mapping
// scope_type konsisten dengan lib/lms/roleScopeService.js (tias-backend).
export const ROLE_KEY_OPTIONS = [
  { value: "lms_admin_univ", label: "Admin Universitas" },
  { value: "lms_admin_fakultas", label: "Admin Fakultas" },
  { value: "lms_admin_prodi", label: "Admin Prodi" },
];

export const SCOPE_TYPE_BY_ROLE = {
  lms_admin_univ: "university",
  lms_admin_fakultas: "faculty",
  lms_admin_prodi: "study_program",
};

export const roleKeyLabel = (key) =>
  ROLE_KEY_OPTIONS.find((o) => o.value === key)?.label || key;

export const scopeLabel = (row, { fakultasMap, prodiMap }) => {
  if (row.scope_type === "university") return "Seluruh Universitas";
  if (row.scope_type === "faculty") {
    return fakultasMap[row.fakultas_id]?.nama_fakultas || row.fakultas_id || "-";
  }
  if (row.scope_type === "study_program") {
    return prodiMap[row.prodi_id]?.nama_prodi || row.prodi_id || "-";
  }
  return "-";
};
