import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import useDatatable from "../../../../hooks/useDatatable";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function TugasAkhirModule({ baseURL }) {
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

  const DATA_URL = `${process.env.API_ENDPOINT}/tugas-akhir/get-by-mhs`;

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
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/tugas-akhir/pengajuan_sk`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Pengajuan SK
        </Button>
      </div>

      <table
        className="w-full border-collapse rounded-2xl shadow table-auto relative" // tambahkan relative pada tabel
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Semester
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Judul Skripsi
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Action
              </div>
            </th>
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
                    {row.status}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.semester}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.judul_skripsi}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 relative">
                    <div className="relative">
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
                          className="absolute right-14 mt-10 w-52 bg-white rounded-md shadow-lg z-50"
                          ref={dropdownRef}
                        >
                          <div className="py-1">
                            <button
                              onClick={closeDropdown}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                              <Link
                                href={`${baseURL}/tugas-akhir/action/pengajuan_sk/${row.id}`}
                              >
                                Pengajuan SK
                              </Link>
                            </button>
                            <button
                              onClick={closeDropdown}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                              Pengajuan Kolokium
                            </button>
                            <button
                              onClick={closeDropdown}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                              Pelaksanaan Kolokium
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
              );
            })}
        </tbody>
      </table>
    </>
  );
}
