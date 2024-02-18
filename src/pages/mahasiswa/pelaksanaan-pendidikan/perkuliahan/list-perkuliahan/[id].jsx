import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import useDatatableAbsensi from "../../../../../hooks/useDataTableAbsensi";
import Button from "../../../../../components/Button";
import { Icon } from "@iconify-icon/react";
import { useEffect, useState } from "react";
import useDatatable from "../../../../../hooks/useDatatable";
import UploadTugas from "../uploadTugas";


export default function ListPerkuliahan() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/absensi/get-absensi-mhs`;

  const id = router.query.id || "";
  const [idmatkul, kelas] = id.split('-');


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
  } = useDatatable(DATA_URL, {
    id_matkul: idmatkul,
    kelas: kelas,
  });

  const handleEditDok = () => {

    refresh();
  };


  if ([user, menu, loading].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={'Absensi Perkuliahan'} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center gap-2 mb-8">

      </div>
      <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer">
                  No
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Matakuliah
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Pertemuan
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Status Kelas
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Status Absen
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Tugas
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
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.pembelajaran.matkul?.name}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.pembelajaran?.pertemuan}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.pembelajaran?.status_kelas === 1 ? "ONLINE" : (row.pembelajaran?.status_kelas === 0 ? "OFFLINE" : "HYBRID")}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.status_absen === 1
                      ? "MASUK"
                      : row.status_absen === 2
                      ? "SAKIT"
                      : row.status_absen === 0
                      ? "ALFA"
                      : ""}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <div className="flex items-stretch gap-1">
                      <UploadTugas data={{ id: row.id }} onEditAbsensi={handleEditDok} />
                     
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
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            iconPosition="left"
            pill
          >
            Kembali
          </Button>
        </div>
    </Layout>
  );
}
