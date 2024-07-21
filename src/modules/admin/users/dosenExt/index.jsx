import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../../hooks/useDatatable";
import SortIcon from "../../../../components/SortIcon";
import Form from "../../../../components/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { MySwal, toastAlert, warningAlert } from "../../../../lib/sweetalert";

export default function DosenExtModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/users/get-dosen-ext`;
  const verifyUrl = `${process.env.API_ENDPOINT}/auth/verify-dosen-ext`;

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
    totalData,
  } = useDatatable(DATA_URL);

  const verify = async (userId, isverified) => {
    let text = isverified
      ? "Akun akan di non aktifkan!"
      : "Akun akan di verifikasi!";
    return warningAlert(async () => {
      try {
        const request = await axios({
          method: "PATCH",
          url: `${verifyUrl}/${userId}`,
        });

        const response = await request.data;

        MySwal.close();
        refresh();
        return toastAlert("success", response.message, 2000);
      } catch (error) {
        if (error.name == "AxiosError" && error?.response)
          toastAlert("error", error.response.data.message);
        else toastAlert("error", "Internal Server Error!");
      }
    }, text);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8">
        <Filter filter={filter} handler={setFilter} />
      </div>
      <div className="flex items-start">
        <span>
          Total Data: <b>{totalData}</b>
        </span>
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
                onClick={() => sortBy("pangkat_id")}
              >
                No
                <SortIcon sort={getSortBy("pangkat_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                NIP/NIK
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Instansi
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Verified
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
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nip}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.instansi_ext}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {!row.isverified ? (
                      <Icon
                        icon="mingcute:close-fill"
                        className="bg-danger-600 text-white"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <Icon
                        icon="ph:check-bold"
                        className="bg-success-600 text-white"
                        width={20}
                        height={20}
                      />
                    )}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(
                            `${baseURL}/detail-dosen/${row.user_id}`,
                            "_blank"
                          )
                        }
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
                        onClick={() =>
                          window.open(
                            `${baseURL}/change-password/${row.user_id}`,
                            "_blank"
                          )
                        }
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                      {!row.isverified && (
                        <Button.Icon
                          onClick={() => verify(row.user_id, row.isverified)}
                          variant="success"
                          icon={
                            <Icon
                              icon="material-symbols:domain-verification"
                              width={20}
                              height={20}
                            />
                          }
                        />
                      )}
                      {row.isverified && (
                        <Button.Icon
                          onClick={() => verify(row.user_id, row.isverified)}
                          variant="danger"
                          icon={
                            <Icon
                              icon="flowbite:close-circle-solid"
                              width={20}
                              height={20}
                            />
                          }
                        />
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
