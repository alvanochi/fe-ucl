import { Icon } from "@iconify-icon/react";
import useDatatable from "../../../../hooks/useDatatable";
import Filter from "./filter";
import SortIcon from "../../../../components/SortIcon";
import Button from "../../../../components/Button";
import date from "../../../../utils/date";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import axios from "axios";
import { useEffect, useState } from "react";
import Form from "../../../../components/Form";

export default function AnggotaProfesiModule({ baseURL }) {
  const approveData = async (id) => {
    const UPDATE_URL = `${process.env.API_ENDPOINT}/penunjang/approveStatusProf/${id}`;

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
    const UPDATE_URL = `${process.env.API_ENDPOINT}/penunjang/rejectStatusProf/${id}`;

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

  const [dataUrl, setDataUrl] = useState(
    `${process.env.API_ENDPOINT}/admin/anggotaProfPending`
  );

  const handleApproveClick = async () => {
    await approveData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/anggotaProfAprove`);
  };

  const handleRejectClick = async () => {
    await rejectData();
    setDataUrl(`${process.env.API_ENDPOINT}/admin/anggotaProfReject`);
  };

  const handlePendingClick = () => {
    setDataUrl(`${process.env.API_ENDPOINT}/admin/anggotaProfPending`);
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
      <div className="flex items-center justify-center gap-2 mb-8">
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
        className="w-full border-collapse rounded-2xl overflow-hidden shadow"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("prof_id")}
              >
                No
                <SortIcon sort={getSortBy("prof_id")} />
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
              <div className="flex items-center gap-2 cursor-pointer">
                Nama Organisasi
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Peran/Kedudukan
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Periode
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loading && data && data.length < 1 && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {!loading &&
            data &&
            data.map((row, index) => {
              const startNumber = (page - 1) * 10 + 1;

              const rowNumber = startNumber + index;
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {rowNumber}
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
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.nama_organisasi}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.peran}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {`${row.mulai_tahun} ${row.mulai_bulan} s.d ${row.selesai_tahun} ${row.selesai_bulan}`}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        as="a"
                        href={`${baseURL}/detail-anggota-profesi/${row.prof_id}`}
                        variant="info"
                        icon={
                          <Icon
                            icon="fluent:info-24-filled"
                            width={20}
                            height={20}
                          />
                        }
                      />
                      {row.status === 0 && (
                        <>
                          <Button.Icon
                            variant="success"
                            type="button"
                            icon={
                              <Icon icon="oi:check" width={20} height={20} />
                            }
                            onClick={() =>
                              approveData(row.prof_id).then(() => refresh())
                            }
                          />
                          <Button.Icon
                            variant="danger"
                            type="button"
                            icon={<Icon icon="oi:x" width={20} height={20} />}
                            onClick={() =>
                              rejectData(row.prof_id).then(() => refresh())
                            }
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex mt-8">
        <div className="flex gap-1 ml-auto">
          <Button.Icon
            type="button"
            variant="outline-primary"
            icon={
              <Icon
                icon="material-symbols:chevron-left"
                width={20}
                height={20}
              />
            }
            onClick={() => setPage(page - 1)}
            disabled={!canPrev || page === 1} // Tambahkan kondisi page === 1
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={
              <Icon
                icon="material-symbols:chevron-right"
                width={20}
                height={20}
              />
            }
            iconPosition="right"
            onClick={() => setPage(page + 1)}
            disabled={!canNext || page === pageCount} // Tambahkan kondisi page === pageCount
            pill
          >
            Next Page
          </Button>
        </div>
        <div className="ml-auto whitespace-nowrap flex items-center gap-2">
          <p className="">Page</p>
          <Form.Input
            type="number"
            min="1"
            max={pageCount}
            className="w-20"
            value={page}
            onChange={(event) =>
              event.target.valueAsNumber <= pageCount &&
              setPage(event.target.value)
            }
          />
          of {pageCount || 1}
        </div>
      </div>
    </>
  );
}
