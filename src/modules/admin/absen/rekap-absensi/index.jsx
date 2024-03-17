import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../../hooks/useDatatable";
import SortIcon from "../../../../components/SortIcon";
import Form from "../../../../components/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toastAlert } from "../../../../lib/sweetalert";

export default function RekapAbsensi({ baseURL }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/list-dosen-pertemuan`
        );

        const res = response.data.data;

        setData(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
        setLoading(false);
      }
    };

    fetchTotalData();
  }, []);

  const GENERATE_URL = `${process.env.API_ENDPOINT}/absensi/persentase-dosen/excel`;

  async function generate() {
    try {
      const response = await axios.get(GENERATE_URL, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        .split("filename=")[1]
        .replace(/"/g, "");

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toastAlert("success", "Exported!");
    } catch (error) {
      if (error.name === "AxiosError") {
        toastAlert("warning", error.response.data);
        return;
      }
      toastAlert("error", error);
    }
  }

  return (
    <>
      <div className="mb-2">
        <div className="flex justify-end items-end">
          <Button.Icon
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => generate()}
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
              <div className="flex items-center gap-2 cursor-pointer">NIDN</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                GASAL
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                GENAP
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
            data.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.nik}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  <Link
                    href={`${baseURL}/rekap-absensi/${row.code_lecturer}`}
                    className="text-blue-500"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.persentase_gasal}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.persentase_genap}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
