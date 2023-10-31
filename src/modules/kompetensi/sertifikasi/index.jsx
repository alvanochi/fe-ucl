import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import date from "../../../utils/date";
import SortIcon from "../../../components/SortIcon";

export default function SertifikasiModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/kompetensi/getCertificate`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/kompetensi/deleteCertif`;

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
  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/sertifikasi/create`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah Sertifikat
        </Button>
        <Filter filter={filter} handler={setFilter} />
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th
              colSpan={6}
              className="text-sm border-2 border-white bg-gray-50"
            >
              Details
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("kategori_id")}
              >
                No
                <SortIcon sort={getSortBy("kategori_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("no_sk")}
              >
                No. SK
                <SortIcon sort={getSortBy("no_sk")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("nama_serti")}
              >
                Nama Sertifikasi
                <SortIcon sort={getSortBy("nama_serti")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("jenis_serti")}
              >
                Jenis Sertifikasi
                <SortIcon sort={getSortBy("jenis_serti")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("bidang_studi")}
              >
                Bidang Studi
                <SortIcon sort={getSortBy("bidang_studi")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("tgl_serti")}
              >
                Tanggal
                <SortIcon sort={getSortBy("tgl_serti")} />
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
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nomor_sk}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nama_serti}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.jenis_serti}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.bidang_studi}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {date.formatToID(new Date(row.tgl_serti))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/sertifikasi/detail/${row.sertifikat_id}`}
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
                      as="a"
                      href={`${baseURL}/sertifikasi/edit/${row.sertifikat_id}`}
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
                        destroy(row.sertifikat_id).then(() => refresh())
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
