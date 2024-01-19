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

export default function PembicaraModule({ baseURL }) {
  const approveData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/pengabdian/pembicara/approveStatusPembicara/${id}`;

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
    const UPDATE_URL = `${process.env.API_ENDPOINT}/pengabdian/pembicara/rejectStatusPembicara/${id}`;

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

  const [dataUrl, setDataUrl] = useState(`${process.env.API_ENDPOINT}/admin/pembicaraPending`)


  const handleApproveClick = async () => {
    await approveData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/pembicaraAprove`);
  };

  const handleRejectClick = async () => {
    await rejectData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/pembicaraReject`);
  };

  const handlePendingClick = () => {
    setDataUrl(`${process.env.API_ENDPOINT}/admin/pembicaraPending`);
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
                onClick={() => sortBy("pembicara_id")}
              >
                No
                <SortIcon sort={getSortBy("pembicara_id")} />
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
                onClick={() => sortBy("judul_makalah")}
              >
                Judul Makalah
                <SortIcon sort={getSortBy("judul_makalah")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("penyelenggara")}
              >
                Penyelenggara
                <SortIcon sort={getSortBy("penyelenggara")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tgl_pelaksanaan")}
              >
                Tanggal Pelaksanaan
                <SortIcon sort={getSortBy("tgl_pelaksanaan")} />
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
                  <p className="truncate">{row.judul_makalah}</p>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.penyelenggara}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {date.formatToID(new Date(row.tgl_pelaksanaan))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/detail-pembicara/${row.pembicara_id}`}
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
                              approveData(row.pembicara_id).then(() => refresh())
                            }
                          />
                          <Button.Icon
                            variant="danger"
                            type="button"
                            icon={<Icon icon="oi:x" width={20} height={20} />}
                            onClick={() =>
                              rejectData(row.pembicara_id).then(() => refresh())
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
