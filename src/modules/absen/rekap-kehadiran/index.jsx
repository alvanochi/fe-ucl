import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RekapKehadiran({ baseURL, user }) {
  const [dataGasal, setDataGasal] = useState(null);
  const [dataGenap, setDataGenap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataGasal = async () => {
      try {
        const DATA_URL = `https://absen.ft.uika-bogor.ac.id/api/pembelajaran/list-pertemuan`;
        const response = await axios.get(DATA_URL, {
          params: {
            dataTable: true,
            filter: ["semester", "curr_code"],
              filterValue: ["gasal", "TIF2021"],
            code: user && user.nip,
          },
        });
        setDataGasal(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDataGenap = async () => {
      try {
        const DATA_URL = `https://absen.ft.uika-bogor.ac.id/api/pembelajaran/list-pertemuan`;
        const response = await axios.get(DATA_URL, {
          params: {
            dataTable: true,
            filter: ["semester", "curr_code"],
              filterValue: ["genap", "TIF2021"],
            code: user && user.nip,
          },
        });
        setDataGenap(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataGenap();
    fetchDataGasal();
  }, [user]);

  return (
    <>
      <div className="flex justify-center gap-2 mb-12">
        <ul className="flex items-center gap-4 list-none p-0">
          <li className="w-6 h-6 mr-4 inline-block">
            <div className="w-full h-full rounded-full bg-blue-400"></div>
            <span className="text-xs text-blue-400">ONLINE</span>
          </li>

          <li className="w-6 h-6 mr-4 inline-block">
            <div className="w-full h-full rounded-full bg-green-400"></div>
            <span className="text-xs text-green-400">OFFLINE</span>
          </li>

          <li className="w-6 h-6 mr-4 inline-block">
            <div className="w-full h-full rounded-full bg-purple-400"></div>
            <span className="text-xs text-purple-400">HYBIRD</span>
          </li>

          <li className="w-6 h-6 mr-4 inline-block">
            <div className="w-full h-full rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-400">BELUM</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center">
        <Button
          type="button"
          variant="primary"
          className="cursor-default"
          iconPosition="right"
          pill
        >
          GASAL
        </Button>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kurikulum
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Matakuliah
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kelas
              </div>
            </th>
            {[...Array(7)].map((_, index) => (
              <th
                key={index}
                className="text-sm border-2 border-white bg-gray-200"
              >
                {index + 1}
              </th>
            ))}
            <th className="text-sm border-2 border-white bg-gray-200">UTS</th>
            {[...Array(7)].map((_, index) => (
              <th
                key={index + 7}
                className="text-sm border-2 border-white bg-gray-200"
              >
                {index + 8}
              </th>
            ))}
            <th className="text-sm border-2 border-white bg-gray-200">UAS</th>
            <th className="text-sm border-2 border-white bg-gray-200">%</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan="20"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loading &&
            dataGasal &&
            dataGasal.map((row, index) => (
              <tr key={index}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.curr_code}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Link
                    href={`${baseURL}/rekap-kehadiran/list-mhs/${row.course_code}-${row.class}`}
                    className="text-blue-500"
                  >
                    {row.name_matkul}
                  </Link>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.class}
                </td>
                {[...Array(7)].map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      row.pertemuan_statusKelas[columnIndex] === "Offline"
                        ? "bg-green-400"
                        : row.pertemuan_statusKelas[columnIndex] === "Online"
                        ? "bg-blue-400"
                        : row.pertemuan_statusKelas[columnIndex] === "Hybrid"
                        ? "bg-purple-400"
                        : "bg-gray-400"
                    }`}
                  >
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                ))}
                <td className="text-sm border-2 border-white bg-gray-400 max-w-[8rem] truncate mx-auto">
                  {row.uts}
                </td>
                {[...Array(7)].map((_, columnIndex) => (
                  <td
                    key={columnIndex + 7}
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      row.pertemuan_statusKelas[columnIndex + 7] === "Offline"
                        ? "bg-green-400"
                        : row.pertemuan_statusKelas[columnIndex + 7] ===
                          "Online"
                        ? "bg-blue-400"
                        : row.pertemuan_statusKelas[columnIndex + 7] ===
                          "Hybrid"
                        ? "bg-purple-400"
                        : "bg-gray-400"
                    }`}
                  >
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                ))}
                <td className="text-sm border-2 border-white bg-gray-400 max-w-[8rem] truncate mx-auto">
                  {row.uas}
                </td>
                <td className="text-sm border-2 border-white bg-gray-200 max-w-[8rem] truncate mx-auto">
                  <div className="flex items-stretch gap-1">
                    {row.persentase}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center">
        <Button
          type="button"
          variant="primary"
          className="mt-8 cursor-default"
          iconPosition="right"
          pill
        >
          GENAP
        </Button>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kurikulum
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Matakuliah
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kelas
              </div>
            </th>
            {[...Array(7)].map((_, index) => (
              <th
                key={index}
                className="text-sm border-2 border-white bg-gray-200"
              >
                {index + 1}
              </th>
            ))}
            <th className="text-sm border-2 border-white bg-gray-200">UTS</th>
            {[...Array(7)].map((_, index) => (
              <th
                key={index + 7}
                className="text-sm border-2 border-white bg-gray-200"
              >
                {index + 8}
              </th>
            ))}
            <th className="text-sm border-2 border-white bg-gray-200">UAS</th>
            <th className="text-sm border-2 border-white bg-gray-200">%</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan="20"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loading &&
            dataGenap &&
            dataGenap.map((row, index) => (
              <tr key={index}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.curr_code}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Link
                    href={`${baseURL}/rekap-kehadiran/list-mhs/${row.course_code}-${row.class}`}
                    className="text-blue-500"
                  >
                    {row.name_matkul}
                  </Link>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.class}
                </td>
                {[...Array(7)].map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      row.pertemuan_statusKelas[columnIndex] === "Offline"
                        ? "bg-green-400"
                        : row.pertemuan_statusKelas[columnIndex] === "Online"
                        ? "bg-blue-400"
                        : row.pertemuan_statusKelas[columnIndex] === "Hybrid"
                        ? "bg-purple-400"
                        : "bg-gray-400"
                    }`}
                  >
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                ))}
                <td className="text-sm border-2 border-white bg-gray-400 max-w-[8rem] truncate mx-auto">
                  {row.uts}
                </td>
                {[...Array(7)].map((_, columnIndex) => (
                  <td
                    key={columnIndex + 7}
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      row.pertemuan_statusKelas[columnIndex + 7] === "Offline"
                        ? "bg-green-400"
                        : row.pertemuan_statusKelas[columnIndex + 7] ===
                          "Online"
                        ? "bg-blue-400"
                        : row.pertemuan_statusKelas[columnIndex + 7] ===
                          "Hybrid"
                        ? "bg-purple-400"
                        : "bg-gray-400"
                    }`}
                  >
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                ))}
                <td className="text-sm border-2 border-white bg-gray-400 max-w-[8rem] truncate mx-auto">
                  {row.uas}
                </td>
                <td className="text-sm border-2 border-white bg-gray-200 max-w-[8rem] truncate mx-auto">
                  <div className="flex items-stretch gap-1">
                    {row.persentase}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex mt-8">
        <Button
          as="a"
          href={baseURL}
          variant="danger"
          icon={
            <Icon icon="material-symbols:chevron-left" width={20} height={20} />
          }
          iconPosition="left"
          pill
        >
          Kembali
        </Button>
      </div>
    </>
  );
}
