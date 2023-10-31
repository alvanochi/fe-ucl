import { Icon } from "@iconify-icon/react";
import useDatatable from "../../../../hooks/useDatatable";
import Filter from "./filter";
import SortIcon from "../../../../components/SortIcon";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import date from "../../../../utils/date";

import { MySwal, loadingAlert } from "../../../../lib/sweetalert";
import axios from "axios";

export default function PengabdianModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/admin/pengabdianPending`;

  const {
    data,
    loading,
    page,
    pageCount,
    filter,
    setPage,
    setFilter,
    canPrev,
    canNext,
    refresh,
    sortBy,
    getSortBy,
  } = useDatatable(DATA_URL);

  const approveData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/pengabdian/approveStatusPengabdian/${id}`;

    try {
      loadingAlert();

      const request = await axios({
        url: UPDATE_URL,
        method: "PATCH",
      });
      MySwal.close();

      const response = await request;

      toastAlert("info", response.data.message);
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }

      console.error(error.message);
    }
  };

  const rejectData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/pengabdian/rejectStatusPengabdian/${id}`;

    try {
      loadingAlert();

      const request = await axios({
        url: UPDATE_URL,
        method: "PATCH",
      });
      MySwal.close();

      const response = await request;

      toastAlert("info", response.data.message);
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }

      console.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Filter filter={filter} handler={setFilter} />
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("pengabdian_id")}
              >
                No
                <SortIcon sort={getSortBy("pengabdian_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                NPM/NIDN
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("judul_kegiatan")}
              >
                Judul
                <SortIcon sort={getSortBy("judul_kegiatan")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tgl_sk_penugasan")}
              >
                Tanggal Pelaksanaan
                <SortIcon sort={getSortBy("tgl_sk_penugasan")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("lama_kegiatan")}
              >
                Lama Kegiatan
                <SortIcon sort={getSortBy("lama_kegiatan")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan="5"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loading && data && data.length < 1 && (
            <tr>
              <td
                colSpan="5"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {!loading &&
            data &&
            data.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[12rem] truncate">
                  {row.status == 0 && (
                    <span className="text-base font-bold text-yellow-400">
                      Proses
                    </span>
                  )}
                  {row.status == 1 && (
                    <span className="text-base font-bold text-green-400">
                      Diterima
                    </span>
                  )}
                  {row.status == 2 && (
                    <span className="text-base font-bold text-red-400">
                      Ditolak
                    </span>
                  )}
                </td>

                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.nama_lengkap}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.npm ? row.npm : row.nidn}
                  <span className="block font-bold">{row.role}</span>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[20rem]">
                  <p className="truncate">{row.judul_kegiatan}</p>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {date.formatToID(new Date(row.tgl_sk_penugasan))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.lama_kegiatan} Tahun
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/detail-pengabdian/${row.pengabdian_id}`}
                      variant="info"
                      icon={
                        <Icon
                          icon="fluent:info-24-filled"
                          width={20}
                          height={20}
                        />
                      }
                    />
                    <Button.Icon
                      variant="success"
                      type="button"
                      icon={<Icon icon="oi:check" width={20} height={20} />}
                      onClick={() =>
                        approveData(row.pengabdian_id).then(() => refresh())
                      }
                    />

                    <Button.Icon
                      variant="danger"
                      type="button"
                      icon={<Icon icon="oi:x" width={20} height={20} />}
                      onClick={() =>
                        rejectData(row.pengabdian_id).then(() => refresh())
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        current={page}
        handler={setPage}
        max={pageCount}
        canPrev={canPrev()}
        canNext={canNext()}
        className="mt-8"
      />
    </>
  );
}
