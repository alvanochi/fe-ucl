import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import useUser from "../../../../hooks/useUser";
import useMenu from "../../../../hooks/useMenu";
import PageHeader from "../../../../components/PageHeader";
import { toastAlert } from "../../../../lib/sweetalert";
import { Loading } from "../../../../components/Loading";
import UploadSk from "./upload-sk";

export default function RekapKehadiran() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const [dataGasal, setDataGasal] = useState(null);
  const [dataGenap, setDataGenap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [academicYear, setAcademicYear] = useState("2024/2025");

  useEffect(() => {
    if (router.isReady === false || !user) return;
    if (router.query.nip) {
      const fetchDataGasal = async () => {
        try {
          const DATA_URL = `${process.env.API_ENDPOINT}/absensi/rekap-perkuliahan`;
          const response = await axios.get(DATA_URL, {
            params: {
              dataTable: true,
              filter: ["semester"],
              filterValue: ["gasal"],
              code: router.query.nip,
              academic_year: academicYear,
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
          const DATA_URL = `${process.env.API_ENDPOINT}/absensi/rekap-perkuliahan`;
          const response = await axios.get(DATA_URL, {
            params: {
              dataTable: true,
              filter: ["semester"],
              filterValue: ["genap"],
              code: router.query.nip,
              academic_year: academicYear,
            },
          });
          setDataGenap(response.data.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDataGasal();
      fetchDataGenap();
    }
  }, [router, user, academicYear]);

  const handleYearChange = (event) => {
    setAcademicYear(event.target.value);
  };

  const GENERATE_URL = `${process.env.API_ENDPOINT}/absensi/list-pertemuan/excel`;
  const GENERATE_URL_REKAP = `${process.env.API_ENDPOINT}/absensi/rekap-pertemuan/excel`;

  async function generate(semester) {
    try {
      if (router.query.nip) {
        const response = await axios.get(GENERATE_URL, {
          params: {
            semester: semester,
            nip: router.query.nip,
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
  async function generateRekap(id_matkul, kelas) {
    try {
      if (id_matkul && kelas) {
        const response = await axios.get(GENERATE_URL_REKAP, {
          params: {
            id_matkul: id_matkul,
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
        toastAlert("warning", error.response.statusText);
        return;
      }
      toastAlert("error", error);
    }
  }

  if ([user, menu].some((item) => item == null)) return <Loading />;

  return (
    <Layout>
      <PageHeader
        title={"Rekap Perkuliahan"}
        icon={menu.icon}
        handler={setActive}
      />
      <div className="flex justify-center mt-4"></div>

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

      <div className="flex flex-col w-1/3">
        <Form.Label className="mb-4">Tahun Ajaran</Form.Label>
        <Form.Select
          value={academicYear}
          onChange={handleYearChange}
          options={[
            { value: "2024/2025", label: "2024/2025" },
            { value: "2023/2024", label: "2023/2024" },
            { value: "2022/2023", label: "2022/2023" },
            { value: "2021/2022", label: "2021/2022" },
            { value: "2020/2021", label: "2020/2021" },
            { value: "2018/2019", label: "2018/2019" },
            { value: "2017/2018", label: "2017/2018" },
          ]}
        />
      </div>

      <div className="flex justify-between items-start">
        <span className="mt-6">Semester: GASAL</span>
        <div className="flex space-x-2">
          <UploadSk
            nip={router.query.nip}
            academic_year={academicYear}
            semester={"GASAL"}
          />
          <Button.Icon
            className="mb-2"
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => generate("gasal")}
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
                Export
              </div>
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
                  <i className="cursor-pointer">
                    <Icon
                      icon="ri:file-excel-2-line"
                      width={20}
                      height={20}
                      onClick={() => generateRekap(row.course_code, row.class)}
                    />
                  </i>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.curr_code}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Link
                    href={`${prefix + menu.url}/rekap-kehadiran/${
                      row.course_code
                    }-${row.class}`}
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

      <div className="flex justify-between items-start mt-8">
        <span className="mt-6">Semester: GENAP</span>
        <div className="flex space-x-2">
          <UploadSk
            nip={router.query.nip}
            academic_year={academicYear}
            semester={"GENAP"}
          />
          <Button.Icon
            className="mb-2"
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => generate("genap")}
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
                Export
              </div>
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
                  <i className="cursor-pointer">
                    <Icon
                      icon="ri:file-excel-2-line"
                      width={20}
                      height={20}
                      onClick={() => generateRekap(row.course_code, row.class)}
                    />
                  </i>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.curr_code}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Link
                    href={`${prefix + menu.url}/rekap-kehadiran/${
                      row.course_code
                    }-${row.class}`}
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
            <Icon icon="material-symbols:chevron-left" width={20} height={20} />
          }
          iconPosition="left"
          pill
        >
          Kembali
        </Button>
      </div>
    </Layout>
  );
}
