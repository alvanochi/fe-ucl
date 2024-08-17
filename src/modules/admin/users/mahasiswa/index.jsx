import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../../hooks/useDatatable";
import SortIcon from "../../../../components/SortIcon";
import Form from "../../../../components/Form";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MahasiswaModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/users/getMhs`;

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
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">NPM</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Email
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status MHS
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">FRS</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Departement
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

              // Tampilkan nomor urut sesuai dengan halaman aktif
              const rowNumber = startNumber + index;
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {rowNumber}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.npm}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.email}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.kode_mhs}
                  </td>
                  <td
                    className={`text-sm border-2 border-white bg-gray-50 ${
                      row.status_frs === 1
                        ? "text-green-500"
                        : row.status_frs === 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {row.status_frs === 1
                      ? "Already"
                      : row.status_frs === 0
                      ? "Not yet"
                      : "-"}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.department_code}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(
                            `${baseURL}/detail-mhs/${row.user_id}`,
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
                      <Button.Icon
                        as="a"
                        href={`${baseURL}/achievements-mhs/${row.user_id}`}
                        variant="primary"
                        icon={
                          <Icon
                            icon="bx:bar-chart-alt-2"
                            width={20}
                            height={20}
                          />
                        }
                      />
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
