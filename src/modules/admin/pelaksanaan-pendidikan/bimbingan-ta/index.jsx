import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import useNewDataTableNew from "../../../../hooks/useNewDataTableNew";
import { useState } from "react";
import SortIcon from "../../../../components/SortIcon";
import Link from "next/link";

export default function ProgresTaAdmin({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/progres-tugas-akhir/get-for-admin`;
  const [searchValue, setSearchValue] = useState("");

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTableNew(DATA_URL, {}, searchValue, "user_id");

  getSortByNew("user_id");

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4"></div>
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
                onClick={() => sortByNew("code")}
              >
                No <SortIcon sort={getSortByNew("code")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("name")}
              >
                name
                <SortIcon sort={getSortByNew("name")} />
              </div>
            </th>

            <th className="text-sm border-2 border-white bg-gray-200"></th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
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
                  <Link
                    href={`${baseURL}/bimbingan-ta/${row.user_id}`}
                    className="cursor-pointer text-blue-700"
                  >
                    {row.name}
                    <span className="block font-bold">{row.nip}</span>
                  </Link>
                </td>
                <td className="text-sm border-2 border-white bg-green-400 text-white text-center">
                  {row?.status_counts?.hijau}
                </td>
                <td className="text-sm border-2 border-white bg-yellow-400 text-white text-center">
                  {row?.status_counts?.kuning}
                </td>
                <td className="text-sm border-2 border-white bg-red-600 text-white text-center">
                  {row?.status_counts?.merah}
                </td>
                <td className="text-sm border-2 border-white bg-gray-500 text-white text-center">
                  {row?.status_counts?.abuabu}
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
