import useMenu from "../../../../../hooks/useMenu";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useUser from "../../../../../hooks/useUser";
import _ from "underscore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../../components/Button";
import { Icon } from "@iconify-icon/react";
import { toastAlert } from "../../../../../lib/sweetalert";
import { Loading } from "../../../../../components/Loading";

export default function ListMhs() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.id) {
          const [idmatkul, kelas] = router.query.id.split("-");

          const DATA_URL = `https://absen.ft.uika-bogor.ac.id/api/pembelajaran/list-absen`;
          const response = await axios.get(DATA_URL, {
            params: {
              dataTable: true,
              id_matkul: idmatkul,
              kelas: kelas,
            },
          });
          setData(response.data.data);
          setHeader(response.data.matkul);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query]);

  const GENERATE_URL = `${process.env.API_ENDPOINT}/absensi/list-absensi/excel`;

  async function generate() {
    try {
      if (router.query.id) {
        const [idmatkul, kelas] = router.query.id.split("-");

        const response = await axios.get(GENERATE_URL, {
          params: {
            idMatkul: idmatkul,
            kelas: kelas,
          },
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
      }
    } catch (error) {
      if (error.name === "AxiosError") {
        toastAlert("warning", error.response.data);
        return;
      }
      toastAlert("error", error);
    }
  }

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`Rekap Kehadiran Mahasiswa`}
        icon={menu.icon}
        handler={setActive}
      />

      <div className="my-8">
        <div className="flex justify-end items-end mt-8">
          <Button.Icon
            className="mb-2"
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => generate()}
          />
        </div>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
          cellPadding={10}
        >
          <thead>
            <tr>
              <td
                colSpan="19"
                className="text-center text-lg font-bold bg-purple-500"
              >
                <span style={{ color: "white" }}>
                  Mata Kuliah: {header?.name}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan="19"
                className="text-center text-lg font-bold bg-purple-500"
              >
                <span style={{ color: "white" }}>
                  Kelas: {header?.class} | {header?.academic_year}
                </span>
              </td>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">No</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  nama
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
            {!loading && data && data.length < 1 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-sm border-2 border-white bg-gray-50 text-center ml-10"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
            {!loading &&
              data &&
              data.map((row, index) => (
                <tr key={index}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {index + 1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.name_mhs} <br />
                    {row.npm}
                  </td>
                  {[...Array(7)].map((_, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto"
                    >
                      <div className="flex items-stretch gap-1">
                        {row.status_absen[columnIndex] === 1 && "Y"}
                        {row.status_absen[columnIndex] === 0 && "A"}
                        {row.status_absen[columnIndex] === 2 && "S/I"}
                        {row.status_absen[columnIndex] == null && "-"}
                      </div>
                    </td>
                  ))}
                  <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                    {row.uts}
                  </td>
                  {[...Array(7)].map((_, columnIndex) => (
                    <td
                      key={columnIndex + 7}
                      className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto"
                    >
                      <div className="flex items-stretch gap-1">
                        {row.status_absen[columnIndex + 7] === 1 && "Y"}
                        {row.status_absen[columnIndex + 7] === 0 && "A"}
                        {row.status_absen[columnIndex + 7] === 2 && "S/I"}
                        {row.status_absen[columnIndex + 7] == null && "-"}
                      </div>
                    </td>
                  ))}
                  <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                    {row.uas}
                  </td>

                  <td
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      parseInt(row.persentase) > 70
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <div className="flex items-stretch gap-1 text-white">
                      {parseInt(row.persentase) > 100 ? "100%" : row.persentase}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex mt-8">
          <Button
            as="a"
            href={`${prefix + menu.url}`}
            variant="danger"
            icon={
              <Icon
                icon="material-symbols:chevron-left"
                width={20}
                height={20}
              />
            }
            iconPosition="left"
            pill
          >
            Kembali
          </Button>
        </div>
      </div>
    </Layout>
  );
}
