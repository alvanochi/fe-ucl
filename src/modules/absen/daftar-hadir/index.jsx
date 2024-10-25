import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import date from "../../../utils/date";
import SortIcon from "../../../components/SortIcon";
import Form from "../../../components/Form";
import ShowQr from "./show-qr";
import axios from "axios";
import { toastAlert } from "../../../lib/sweetalert";
import { useState } from "react";
import useNewDataTable from "../../../hooks/useNewDataTable";

export default function DaftarHadirModule({ baseURL, user }) {
  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/delete`;
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
  } = useNewDataTable(
    DATA_URL,
    {
      filter: ["nik_dosen"],
      filterValue: [user && user.nip],
    },
    searchValue
  );

  const { destroy } = useCRUD(DELETE_URL);

  const updateLearningDone = async (id) => {
    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await axios.post(
        `https://absen.ft.uika-bogor.ac.id/api/pembelajaran/update/${id}`,
        {
          learning_done: currentDate,
        }
      );

      refreshNew();

      toastAlert("success", "Non Active!");
    } catch (error) {
      toastAlert("error", error);

      console.error("Error updating learning done:", error);
    }
  };

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <Button
            onClick={() =>
              window.open(`${baseURL}/daftar-hadir/generate`, "_blank")
            }
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Generate QRCODE
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
      <div className="overflow-x-auto">
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
                  No
                  <SortIcon sort={getSortByNew("id")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("id_matkul")}
                >
                  Matakuliah
                  <SortIcon sort={getSortByNew("id_matkul")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("id_matkul")}
                >
                  Kode <SortIcon sort={getSortByNew("id_matkul")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("pertemuan")}
                >
                  Pertemuan
                  <SortIcon sort={getSortByNew("pertemuan")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("kelas")}
                >
                  Kelas
                  <SortIcon sort={getSortByNew("kelas")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("status_kelas")}
                >
                  Status
                  <SortIcon sort={getSortByNew("status_kelas")} />
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

                const rowNumber = startNumber + index;
                return (
                  <tr key={`row-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {rowNumber}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.matkul?.name &&
                        row.matkul.name
                          .split(" ")
                          .slice(0, 3)
                          .concat("...")
                          .join(" ")}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.id_matkul}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.pertemuan}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.kelas}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.status_kelas === 1
                        ? "ONLINE"
                        : row.status_kelas === 0
                        ? "OFFLINE"
                        : "HYBRID"}
                    </td>

                    <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                      <div className="flex items-stretch gap-1">
                        <ShowQr
                          data={{
                            token: row.token,
                            matkul: row.matkul?.name,
                            kelas: row.kelas,
                            pertemuan: row.pertemuan,
                          }}
                        />
                        <Button.Icon
                          as="a"
                          href={`${baseURL}/daftar-hadir/list-mhs/${row.id}`}
                          variant="primary"
                          icon={<Icon icon="bx:group" width={18} height={18} />}
                        />
                        <i
                          className={
                            row.learning_done == null || row.learning_done == ""
                              ? " text-sky-600 cursor-pointer transition duration-300 hover:text-blue-500"
                              : "text-gray-500"
                          }
                          onClick={() => {
                            if (!row.learning_done) {
                              updateLearningDone(row.id);
                            }
                          }}
                        >
                          <Icon icon="ph:power-fill" width={28} height={28} />
                        </i>
                        <Button.Icon
                          variant="danger"
                          icon={
                            <Icon
                              icon="solar:trash-bin-2-bold-duotone"
                              width={18}
                              height={18}
                            />
                          }
                          onClick={() =>
                            destroy(row.id).then(() => refreshNew())
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

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
