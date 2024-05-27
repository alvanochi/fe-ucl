import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import useCRUD from "../../../../hooks/useCRUD";
import { useEffect, useRef, useState } from "react";
import SortIcon from "../../../../components/SortIcon";
import Link from "next/link";
import useNewDataTableForMainApi from "../../../../hooks/useNewDataTableForMainApi";
import Filter from "./filter";

export default function TugasAkhirModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/tugas-akhir/get-for-admin`;
  const [searchValue, setSearchValue] = useState("");

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    sortByNew,
    getSortByNew,
    refreshNew,
    filterNew,
    setFilterNew,
  } = useNewDataTableForMainApi(DATA_URL, {}, searchValue);

  const [openedDropdownId, setOpenedDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (rowId) => {
    if (openedDropdownId === rowId) {
      setOpenedDropdownId(null);
    } else {
      setOpenedDropdownId(rowId);
    }
  };

  const closeDropdown = () => {
    setOpenedDropdownId(null);
  };

  const DELETE_URL = `${process.env.API_ENDPOINT}/tugas-akhir`;

  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="flex items-center mr-4">
          <Filter filter={filterNew} handler={setFilterNew} />
          <Button
            onClick={() =>
              window.open(`${baseURL}/tugas-akhir/nota-dinas/create`, "_blank")
            }
            icon={<Icon icon="oi:book" width={20} height={20} />}
            variant="info"
            pill
            className="ml-4"
          >
            Cetak Nota Dinas
          </Button>
        </div>

        <div className="flex-shrink">
          <Form.Input
            type="text"
            name="search"
            placeholder="Search"
            style={{ width: "400px" }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <table
        className="w-full border-collapse rounded-2xl shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("id")}
              >
                No <SortIcon sort={getSortByNew("id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("npm")}
              >
                Nama
                <SortIcon sort={getSortByNew("npm")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("status")}
              >
                status
                <SortIcon sort={getSortByNew("status")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("semester")}
              >
                Semester
                <SortIcon sort={getSortByNew("semester")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("judul_skripsi")}
              >
                Judul Skripsi
                <SortIcon sort={getSortByNew("judul_skripsi")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status Dospem
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loadingNew && dataNew && dataNew.length < 1 && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingNew &&
            dataNew &&
            dataNew.map((row, index) => {
              const startNumber = (pageNew - 1) * 10 + 1;

              // Tampilkan nomor urut sesuai dengan halaman aktif
              const rowNumber = startNumber + index;
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {rowNumber}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nama_lengkap}
                    <span className="block font-bold">{row.npm}</span>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.status}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.semester}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {`${row.judul_skripsi.split(" ").slice(0, 6).join(" ")}${
                      row.judul_skripsi.split(" ").length > 6 ? "..." : ""
                    }`}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.statusDospem}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="relative flex items-stretch gap-1">
                      <button
                        onClick={() => toggleDropdown(row.id)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md focus:outline-none z-10"
                      >
                        <Icon
                          icon="fluent:settings-24-filled"
                          width={20}
                          height={20}
                        />
                      </button>
                      {openedDropdownId === row.id && (
                        <div
                          className="absolute right-0 mt-10 w-56 bg-white rounded-md shadow-lg z-[1000]"
                          ref={dropdownRef}
                        >
                          <div className="py-1">
                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "pengajuan-sk" &&
                                row.status_approved === false
                                  ? "text-black font-bold"
                                  : (row.status === "menuju-kolokium" ||
                                      row.status === "menuju-sidang" ||
                                      row.status === "menyelesaikan-revisi" ||
                                      row.status === "selesai") &&
                                    row.status_approved === true
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <Link
                                href={`${baseURL}/tugas-akhir/pengajuan_sk/${row.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Pengajuan SK
                              </Link>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={row.status_approved ? true : false}
                              />
                            </button>

                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "menuju-kolokium" &&
                                row.status_approved_kolo === false
                                  ? "text-black font-bold"
                                  : (row.status === "menuju-kolokium" ||
                                      row.status === "menuju-sidang" ||
                                      row.status === "menyelesaikan-revisi" ||
                                      row.status === "selesai") &&
                                    row.status_approved_kolo === true
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <span>
                                {row.status === "menuju-kolokium" ||
                                row.status === "menuju-sidang" ||
                                row.status === "menyelesaikan-revisi" ||
                                row.status === "selesai" ? (
                                  <Link
                                    href={`${baseURL}/tugas-akhir/pengajuan_kolo/${row.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Pengajuan Kolokium
                                  </Link>
                                ) : (
                                  <span>Pengajuan Kolokium</span>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={
                                  row.status_approved_kolo ? true : false
                                }
                              />
                            </button>

                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "menuju-kolokium" &&
                                row.status_penilaian === false &&
                                row.status_approved_kolo === true
                                  ? "text-black font-bold"
                                  : (row.status === "menuju-kolokium" ||
                                      row.status === "menuju-sidang" ||
                                      row.status === "menyelesaikan-revisi" ||
                                      row.status === "selesai") &&
                                    row.status_penilaian === true
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <span>
                                {(row.status === "menuju-kolokium" ||
                                  row.status === "menuju-sidang" ||
                                  row.status === "menyelesaikan-revisi" ||
                                  row.status === "selesai") &&
                                row.status_approved_kolo === true ? (
                                  <Link
                                    href={`${baseURL}/tugas-akhir/pelaks_kolo/${row.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Pelaksanaan Kolokium
                                  </Link>
                                ) : (
                                  <span>Pelaksanaan Kolokium</span>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={row.status_penilaian ? true : false}
                              />
                            </button>

                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "menuju-sidang" &&
                                row.status_approved_sidang === false
                                  ? "text-black font-bold"
                                  : (row.status === "menuju-kolokium" ||
                                      row.status === "menuju-sidang" ||
                                      row.status === "menyelesaikan-revisi" ||
                                      row.status === "selesai") &&
                                    row.status_approved_sidang === true
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <span>
                                {(row.status === "menuju-sidang" ||
                                  row.status === "menyelesaikan-revisi" ||
                                  row.status === "selesai") &&
                                row.status_penilaian === true ? (
                                  <Link
                                    href={`${baseURL}/tugas-akhir/pengajuan_sidang/${row.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Pendaftaran Sidang
                                  </Link>
                                ) : (
                                  <span>Pendaftaran Sidang</span>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={
                                  row.status_approved_sidang ? true : false
                                }
                              />
                            </button>

                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "menuju-sidang" &&
                                row.status_penilaian_sidang === false &&
                                row.status_approved_sidang === true
                                  ? "text-black font-bold"
                                  : (row.status === "menuju-kolokium" ||
                                      row.status === "menuju-sidang" ||
                                      row.status === "menyelesaikan-revisi" ||
                                      row.status === "selesai") &&
                                    row.status_penilaian_sidang === true
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <span>
                                {(row.status === "menuju-sidang" ||
                                  row.status === "menyelesaikan-revisi" ||
                                  row.status === "selesai") &&
                                row.status_approved_sidang === true ? (
                                  <Link
                                    href={`${baseURL}/tugas-akhir/pelaks_sidang/${row.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Pelaksanaan Sidang
                                  </Link>
                                ) : (
                                  <span>Pelaksanaan Sidang</span>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={
                                  row.status_penilaian_sidang ? true : false
                                }
                              />
                            </button>

                            <button
                              onClick={closeDropdown}
                              className={`w-full px-4 py-2 text-sm ${
                                row.status === "menyelesaikan-revisi"
                                  ? "text-black font-bold"
                                  : row.status === "selesai"
                                  ? "text-black font-semibold"
                                  : "text-gray-500"
                              } hover:bg-gray-200`}
                            >
                              <span>
                                {row.status === "menyelesaikan-revisi" ||
                                row.status === "selesai" ? (
                                  <Link
                                    href={`${baseURL}/tugas-akhir/pengumpulan_revisi/${row.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Pengumpulan Revisi
                                  </Link>
                                ) : (
                                  <span>Pengumpulan Revisi</span>
                                )}
                              </span>
                              <input
                                type="checkbox"
                                className="ml-2"
                                disabled
                                checked={
                                  row.status === "selesai" ? true : false
                                }
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      <Button.Icon
                        variant="danger"
                        icon={
                          <Icon
                            icon="solar:trash-bin-2-bold-duotone"
                            width={20}
                            height={20}
                          />
                        }
                        onClick={() => destroy(row.id).then(() => refreshNew())}
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
            onClick={() => setPageNew(pageNew - 1)}
            disabled={pageNew <= 1}
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
            onClick={() => setPageNew(pageNew + 1)}
            disabled={pageNew >= pageCountNew}
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
            max={pageCountNew || 1}
            className="w-20"
            value={pageNew}
            onChange={(event) =>
              setPageNew(
                Math.max(
                  1,
                  Math.min(event.target.valueAsNumber, pageCountNew || 1)
                )
              )
            }
          />
          of {pageCountNew || 1}
        </div>
      </div>
    </>
  );
}
