import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import useNewDataTableNew from "../../../../hooks/useNewDataTableNew";
import { toastAlert, warningAlert } from "../../../../lib/sweetalert";
import { LMS_BASE, useLmsAcademicUnits } from "../../../../repo/lms";
import CreateRoleScope from "./create";
import EditRoleScope from "./edit";
import { roleKeyLabel, scopeLabel } from "./constants";

export default function RoleScopesModule() {
  const DATA_URL = `${LMS_BASE()}/role-scopes`;
  const [searchValue, setSearchValue] = useState("");
  const { units } = useLmsAcademicUnits();

  const fakultasMap = Object.fromEntries(
    units.filter((u) => u.fakultas_id).map((u) => [u.fakultas_id, u])
  );
  const prodiMap = Object.fromEntries(units.map((u) => [u.prodi_id, u]));

  const { dataNew, loadingNew, pageNew, pageCountNew, setPageNew, refreshNew } =
    useNewDataTableNew(DATA_URL, {}, searchValue);

  const handleAction = () => refreshNew();

  const toggleActive = (row) => {
    const willActivate = !row.is_active;
    warningAlert(async () => {
      try {
        if (willActivate) {
          await axios.patch(`${DATA_URL}/${row.id}`, { is_active: true });
        } else {
          await axios.delete(`${DATA_URL}/${row.id}`);
        }
        toastAlert("success", willActivate ? "Scope diaktifkan kembali." : "Scope dinonaktifkan.");
        refreshNew();
      } catch (error) {
        toastAlert("error", error?.response?.data?.responseMessage || "Gagal mengubah status scope.");
      }
    }, willActivate ? "Aktifkan kembali scope ini?" : "Nonaktifkan scope ini?");
  };

  return (
    <div className="my-8">
      <p className="mb-4 text-sm text-gray-500">
        Berikan akses "Admin LMS" terbatas per fakultas/prodi ke pengguna tertentu, tanpa
        menjadikan mereka Admin global. Admin global (role Admin) selalu punya akses penuh.
      </p>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <CreateRoleScope onAction={handleAction} />
        </div>
        <div className="flex-shrink">
          <Form.Input
            type="text"
            name="search"
            placeholder="Cari peran/cakupan"
            style={{ width: "400px" }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">No</th>
            <th className="text-sm border-2 border-white bg-gray-200">Pengguna</th>
            <th className="text-sm border-2 border-white bg-gray-200">Peran</th>
            <th className="text-sm border-2 border-white bg-gray-200">Cakupan</th>
            <th className="text-sm border-2 border-white bg-gray-200">Status</th>
            <th className="text-sm border-2 border-white bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loadingNew && dataNew && dataNew.length < 1 && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Belum ada scope Role Admin LMS.
              </td>
            </tr>
          )}
          {!loadingNew &&
            dataNew &&
            dataNew.map((row, index) => (
              <tr key={row.id}>
                <td className="text-sm border-2 border-white bg-gray-50">{index + 1}</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="font-medium">{row.user?.personal_data?.nama_lengkap || row.user?.email || row.user_id}</div>
                  <div className="text-xs text-gray-400">{row.user?.email}</div>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">{roleKeyLabel(row.role_key)}</td>
                <td className="text-sm border-2 border-white bg-gray-50">{scopeLabel(row, { fakultasMap, prodiMap })}</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <span className={row.is_active ? "text-emerald-600 font-semibold" : "text-gray-400"}>
                    {row.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <EditRoleScope scope={row} onAction={handleAction} />
                    <Button.Icon
                      variant={row.is_active ? "danger" : "secondary"}
                      icon={
                        <Icon
                          icon={row.is_active ? "solar:forbidden-circle-bold-duotone" : "solar:check-circle-bold-duotone"}
                          width={20}
                          height={20}
                        />
                      }
                      onClick={() => toggleActive(row)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex mt-8">
        <div className="flex gap-1 ml-auto">
          <Button.Icon
            type="button"
            variant="outline-primary"
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            onClick={() => setPageNew(pageNew - 1)}
            disabled={pageNew <= 1}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
            iconPosition="right"
            onClick={() => setPageNew(pageNew + 1)}
            disabled={pageNew >= pageCountNew}
            pill
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
