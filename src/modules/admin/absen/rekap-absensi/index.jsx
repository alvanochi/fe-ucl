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

export default function RekapAbsensi({ baseURL }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state untuk loading

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_ENDPOINT}/absensi/list-dosen`
        );

        const res = response.data.data;

        setData(res);
        setLoading(false); // Set loading menjadi false setelah data berhasil diambil
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
        setLoading(false); // Set loading menjadi false jika terjadi error
      }
    };

    fetchTotalData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8"></div>

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
                  {row.nidn}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  <Link
                    href={`${baseURL}/rekap-absensi/${row.nip}`}
                    className="text-blue-500"
                  >
                    {row.nama_lengkap}
                  </Link>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.gasal}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.genap}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </>
  );
}
