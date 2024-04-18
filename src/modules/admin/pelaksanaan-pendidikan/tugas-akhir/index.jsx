import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import date from "../../../../utils/date";
import Form from "../../../../components/Form";
import useCRUD from "../../../../hooks/useCRUD";
import useNewDataTable from "../../../../hooks/useNewDataTable";
import { useEffect, useRef, useState } from "react";
import SortIcon from "../../../../components/SortIcon";
import Link from "next/link";

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
  } = useNewDataTable(DATA_URL, {}, searchValue);

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

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <Button
            as="a"
            href={`${baseURL}/skripsi/nota-dinas/create`}
            icon={<Icon icon="oi:book" width={20} height={20} />}
            variant="info"
            pill
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
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
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
            dataNew.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
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
                  <div className="flex items-stretch gap-1">
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
                        className="absolute right-14 mt-10 w-56 bg-white rounded-md shadow-lg z-50"
                        ref={dropdownRef}
                      >
                        <div className="py-1">
                          <button
                            onClick={closeDropdown}
                            className={`w-full px-4 py-2 text-sm ${
                              row.status === "pengajuan-sk" &&
                              row.status_approved === false
                                ? "text-black font-bold"
                                : row.status === "menuju-kolokium" &&
                                  row.status_approved === true
                                ? "text-black font-semibold"
                                : "text-gray-500"
                            } hover:bg-gray-200`}
                          >
                            <Link
                              href={`${baseURL}/tugas-akhir/pengajuan_sk/${row.id}`}
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
                                : row.status === "menuju-kolokium" &&
                                  row.status_approved_kolo === true
                                ? "text-black font-semibold"
                                : "text-gray-500"
                            } hover:bg-gray-200`}
                          >
                            <span>
                              {row.status === "menuju-kolokium" ? (
                                <Link
                                  href={`${baseURL}/tugas-akhir/pengajuan_kolo/${row.id}`}
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
                              checked={row.status_approved_kolo ? true : false}
                            />
                          </button>
                          <button
                            onClick={closeDropdown}
                            className={`w-full px-4 py-2 text-sm ${
                              row.status_approved_kolo === true
                                ? "text-black font-bold"
                                : "text-gray-500"
                            } hover:bg-gray-200`}
                          >
                            <Link href="#">Pelaksanaan Kolokium</Link>
                            <input type="checkbox" className="ml-2" />
                          </button>
                          <button
                            onClick={closeDropdown}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          >
                            Pengajuan Pendaftaran dan Pelaksanaan Sidang
                          </button>
                          <button
                            onClick={closeDropdown}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          >
                            Pelaksanaan Sidang
                          </button>
                          <button
                            onClick={closeDropdown}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          >
                            Pengumpulan Revisi
                          </button>
                        </div>
                      </div>
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
