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
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    setPageAbsensi,
    refreshAbsensi,
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

      refreshAbsensi();

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
            as="a"
            href={`${baseURL}/daftar-hadir/generate`}
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
              <div className="flex items-center gap-2 cursor-pointer">
                Matakuliah
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Kode</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Pertemuan
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kelas
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingAbsensi && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loadingAbsensi && dataAbsensi && dataAbsensi.length < 1 && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingAbsensi &&
            dataAbsensi &&
            dataAbsensi.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.matkul?.name}
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
                      icon={<Icon icon="bx:group" width={20} height={20} />}
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
                      <Icon icon="ph:power-fill" width={30} height={30} />
                    </i>
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
                        destroy(row.id).then(() => refreshAbsensi())
                      }
                    />
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
            onClick={() => setPageAbsensi(pageAbsensi - 1)}
            disabled={pageAbsensi <= 1}
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
            onClick={() => setPageAbsensi(pageAbsensi + 1)}
            disabled={pageAbsensi >= pageCountAbsensi}
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
            max={pageCountAbsensi || 1}
            className="w-20"
            value={pageAbsensi}
            onChange={(event) =>
              setPageAbsensi(
                Math.max(
                  1,
                  Math.min(event.target.valueAsNumber, pageCountAbsensi || 1)
                )
              )
            }
          />
          of {pageCountAbsensi || 1}
        </div>
      </div>
    </>
  );
}
