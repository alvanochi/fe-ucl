import { Icon } from "@iconify-icon/react";
import Filter from "./filter";

import axios from "axios";
import SortIcon from "../../../../components/SortIcon";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import useDatatable from "../../../../hooks/useDatatable";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import { useEffect, useState } from "react";

export default function IPModule({ baseURL }) {
  const dataUrl = `${process.env.API_ENDPOINT}/admin/all-ip`;

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
                onClick={() => sortBy("ip_id")}
              >
                No
                <SortIcon sort={getSortBy("ip_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">NPM</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("semester")}
              >
                Semester
                <SortIcon sort={getSortBy("semester")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tahun")}
              >
                Tahun
                <SortIcon sort={getSortBy("tahun")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("ip")}
              >
                IPS
                <SortIcon sort={getSortBy("ip")} />
              </div>
            </th>

            <th className="text-sm border-2 border-white bg-gray-200">Kode IP</th>
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
            data.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.nama_lengkap}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.npm}
                  <span className="block font-bold">{row.role}</span>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  <p className="truncate">{row.semester}</p>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.tahun}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.ip}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.kode_ip}
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
