import useMenu from "../../../../../hooks/useMenu";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import useUser from "../../../../../hooks/useUser";
import _ from "underscore";
import { Icon } from "@iconify-icon/react";
import TambahMhs from "../tambah-mhs";
import { useRouter } from "next/router";
import useDatatableAbsensi from "../../../../../hooks/useDataTableAbsensi";
import useCRUD from "../../../../../hooks/useCRUD";
import EditAbsensi from "../edit-absensi";
import { useEffect, useState } from "react";
import axios from "axios";
import UploadTugas from "../uploadTugas";
import useNewDataTable from "../../../../../hooks/useNewDataTable";
import { Loading } from "../../../../../components/Loading";
import SortIcon from "../../../../../components/SortIcon";

export default function ListMhs() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();
  const id = router.query.id;

  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi/delete`;

  const [matkulData, setMatkulData] = useState({});

  useEffect(() => {
    const fetchDataMatkul = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${process.env.API_ENDPOINT_ABSEN}/pembelajaran`,
            {
              params: {
                filter: ["id"],
                filterValue: [id],
              },
            }
          );

          const dataMatkul = response.data.data;

          setMatkulData(dataMatkul);
        }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };

    if (id) {
      fetchDataMatkul();
    }
  }, [id]);

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
      filter: ["id_pembelajaran"],
      filterValue: [id],
    },
    searchValue
  );

  const { destroy } = useCRUD(DELETE_URL);

  const handleTambahMhs = () => {
    if (refreshNew) {
      refreshNew();
    }
  };

  if ([user, menu, loadingNew].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`${matkulData[0]?.matkul.name} | Pertemuan ke-${matkulData[0]?.pertemuan}`}
        icon={menu.icon}
        handler={setActive}
      />

      <div className="my-8">
        <div className="flex mb-8 justify-end items-center">
          <div className="mr-4">
            <TambahMhs data={{ id: id }} onTambahMhs={handleTambahMhs} />
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
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("id")}
                >
                  No <SortIcon sort={getSortByNew("id")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Nama
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("npm")}
                >
                  NPM
                  <SortIcon sort={getSortByNew("npm")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew("status_absen")}
                >
                  Status
                  <SortIcon sort={getSortByNew("status_absen")} />
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Tugas
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Nilai
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
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
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.mahasiswa?.name}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.npm}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.status_absen === 1
                      ? "MASUK"
                      : row.status_absen === 2
                      ? "SAKIT/IZIN"
                      : row.status_absen === 0
                      ? "ALFA"
                      : ""}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <UploadTugas
                      data={{ id: row.id }}
                      onTambahMhs={handleTambahMhs}
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.nilai ? row.nilai : "-"}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <div className="flex items-stretch gap-1">
                      <EditAbsensi
                        data={{ id: row.id }}
                        onTambahMhs={handleTambahMhs}
                      />
                      <Button.Icon
                        variant="danger"
                        icon={
                          <Icon
                            icon="solar:trash-bin-2-bold-duotone"
                            width={20}
                            height={20}
                          />
                        }
                        onClick={() => destroy(row.id).then(() => refreshNew())}
                      />
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
      </div>
    </Layout>
  );
}
