import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import date from "../../../utils/date";
import SortIcon from "../../../components/SortIcon";
import CreateDokumen from "./create-dokumen";
import Form from "../../../components/Form";

export default function HKIModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/penelitian/hki/getDataHki`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/penelitian/hki/deleteHki`;

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
  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div>
        <div className="flex justify-center gap-2 mb-8">
          <Button
            onClick={() => window.open(`${`${baseURL}/hki/create`}`,'_blank')}
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Tambah HKI
          </Button>
          <Filter filter={filter} handler={setFilter} />
        </div>
        <div className="flex justify-between items-start">
          <span className="mt-6">
            Total Data: <b>{totalData}</b>
          </span>
        </div>
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
                onClick={() => sortBy("hki_id")}
              >
                No
                <SortIcon sort={getSortBy("hki_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("status")}
              >
                Status
                <SortIcon sort={getSortBy("status")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("judul_hki")}
              >
                Judul
                <SortIcon sort={getSortBy("judul_hki")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("jenis_hki")}
              >
                Jenis Publikasi
                <SortIcon sort={getSortBy("jenis_hki")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tgl_terbit_hki")}
              >
                Tanggal Terbit
                <SortIcon sort={getSortBy("tgl_terbit_hki")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Action
            </th>
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
                  {(page - 1) * 10 + index + 1}
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
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.judul_hki}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.jenis_hki}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {date.formatToID(new Date(row.tgl_terbit_hki))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      onClick={() => window.open(`${`${baseURL}/hki/detail/${row.hki_id}`}`,'_blank')}
                      variant="info"
                      icon={
                        <Icon
                          icon="fluent:info-24-filled"
                          width={20}
                          height={20}
                        />
                      }
                    />
                    {(row.status === 0 || row.status === 2) && (
                      <>
                        <CreateDokumen id={{ hki_id: row.hki_id }} />

                        <Button.Icon
                          onClick={() => window.open(`${baseURL}/hki/edit/${row.hki_id}`,'_blank')}
                          variant="secondary"
                          icon={<Icon icon="bx:edit" width={20} height={20} />}
                        />
                        <Button.Icon
                          variant="danger"
                          icon={
                            <Icon
                              icon="solar:trash-bin-2-bold-duotone"
                              width={20}
                              height={20}
                            />
                          }
                          onClick={() =>
                            destroy(row.hki_id).then(() => refresh())
                          }
                        />
                      </>
                    )}
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
