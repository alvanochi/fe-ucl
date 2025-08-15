import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import { useState } from "react";
import SortIcon from "../../../../components/SortIcon";
import Link from "next/link";
import useNewDataTableForMainApi from "../../../../hooks/useNewDataTableForMainApi";
import moment from "moment/moment";

export default function ProgresBimbinganTa({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/progres-tugas-akhir/get-for-mhs`;
  const [searchValue, setSearchValue] = useState("");

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    sortByNew,
    getSortByNew,
    filterNew,
    setFilterNew,
  } = useNewDataTableForMainApi(DATA_URL, {}, searchValue);

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="flex items-center mr-4"></div>
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
        className="w-full border-collapse rounded-2xl  shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-xs border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("id")}
              >
                No <SortIcon sort={getSortByNew("id")} />
              </div>
            </th>
            <th className="text-xs border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("count")}
              >
                Jumlah Bimbingan
                <SortIcon sort={getSortByNew("count")} />
              </div>
            </th>
            <th className="text-xs border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("last_tgl")}
              >
                Terakhir Bimbingan
                <SortIcon sort={getSortByNew("last_tgl")} />
              </div>
            </th>
            <th className="text-xs border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew("status_kelulusan")}
              >
                Status Kelulusan
                <SortIcon sort={getSortByNew("status_kelulusan")} />
              </div>
            </th>
            <th className="text-xs border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Action
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td
                colSpan="6"
                className="text-xs border-2 border-white bg-gray-50 text-center"
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
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {row.count ? row.count : 0}
                </td>
                <td
                  className={`text-sm border-2 border-white text-center text-white ${
                    row.late_progres === "hijau"
                      ? "bg-green-500"
                      : row.late_progres === "kuning"
                      ? "bg-yellow-500"
                      : row.late_progres === "merah"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  {row.last_tgl
                    ? moment(row.last_tgl).local().format("DD-MM-YYYY")
                    : "-"}
                </td>

                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {row.status_kelulusan == 0 || !row.status_kelulusan
                    ? "BELUM"
                    : "LULUS"}
                </td>
                <td>
                  <Button.Icon
                    variant="secondary"
                    as="a"
                    href={`${baseURL}/bimbingan-ta/${row.sk_id}`}
                    icon={
                      <Icon icon="ic:twotone-info" width={20} height={20} />
                    }
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex mt-8">
        {/* <div className="flex gap-1 ml-auto">
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
        </div> */}
      </div>
    </>
  );
}
