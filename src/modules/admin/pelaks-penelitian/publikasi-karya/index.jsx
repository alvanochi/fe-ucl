import { Icon } from "@iconify-icon/react";
import useDatatable from "../../../../hooks/useDatatable";
import Button from "../../../../components/Button";
import Filter from "./filter";
import SortIcon from "../../../../components/SortIcon";
import Pagination from "../../../../components/Pagination";
import date from "../../../../utils/date";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PublikasiKaryaModule({ baseURL }) {
  const approveData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/penelitian/publikasi-karya/approveStatus/${id}`;

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

        return;
      }

      toastAlert("error", error.message);

    }
  };

  const rejectData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/penelitian/publikasi-karya/rejectStatus/${id}`;

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

        return;
      }

      toastAlert("error", error.message);

    }
  };

  const [dataUrl, setDataUrl] = useState(`${process.env.API_ENDPOINT}/admin/publikasiPending`);

  const handleApproveClick = async () => {
    await approveData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/publikasiAprove`);
  };

  const handleRejectClick = async () => {
    await rejectData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/publikasiReject`);
  };

  const handlePendingClick = () => {
    setDataUrl(`${process.env.API_ENDPOINT}/admin/publikasiPending`);
  };

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
  } = useDatatable(dataUrl);

  useEffect(() => {
    refresh();
  }, [dataUrl]);

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8">
        <Filter filter={filter} handler={setFilter} />
        <Button
          variant="info"
          icon={<Icon icon="oi:loop-circular" width={20} height={20} />}
          onClick={handlePendingClick}
          pill
          >
          Pending
        </Button>
        <Button
          variant="success"
          icon={<Icon icon="oi:check" width={20} height={20} />}
          onClick={handleApproveClick}
          pill
          >
          Aprove
        </Button>
        <Button
          variant="danger"
          icon={<Icon icon="oi:x" width={20} height={20} />}
          onClick={handleRejectClick}
          pill
          >
          Reject
        </Button>
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
                onClick={() => sortBy("publikasi_id")}
              >
                No
                <SortIcon sort={getSortBy("publikasi_id")} />
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
                onClick={() => sortBy("judul_artikel")}
              >
                Judul
                <SortIcon sort={getSortBy("judul_artikel")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("nama_jurnal")}
              >
                Nama Jurnal
                <SortIcon sort={getSortBy("nama_jurnal")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tgl_terbit")}
              >
                Tanggal Terbit
                <SortIcon sort={getSortBy("tgl_terbit")} />
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
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[12rem] truncate">
                  {row.judul_artikel}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nama_jurnal}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {date.formatToID(new Date(row.tgl_terbit))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/detail-publikasi-karya/${row.publikasi_id}`}
                      variant="info"
                      icon={
                        <Icon
                          icon="fluent:info-24-filled"
                          width={20}
                          height={20}
                        />
                      }
                    />
                    {
                      row.status === 0 && (
                        <>
                          <Button.Icon
                              variant="success"
                              type="button"
                              icon={<Icon icon="oi:check" width={20} height={20} />}
                              onClick={() =>
                                approveData(row.publikasi_id).then(() => refresh())
                              }
                            />

                            <Button.Icon
                              variant="danger"
                              type="button"
                              icon={<Icon icon="oi:x" width={20} height={20} />}
                              onClick={() =>
                                rejectData(row.publikasi_id).then(() => refresh())
                              }
                            />
                        </>
                      )
                    }
                    
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
