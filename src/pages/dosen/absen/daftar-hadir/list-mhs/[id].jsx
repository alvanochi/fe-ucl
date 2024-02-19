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


export default function ListMhs() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();


  const router = useRouter();

  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi/delete`
  const id = router.query.id;

  const [matkulData, setMatkulData] = useState({});




  useEffect(() => {
    const fetchDataMatkul = async () => {
      try {
          if (id) {
            const response = await axios.get(
              `${process.env.API_ENDPOINT_ABSEN}/pembelajaran`,
              {
                params: {
                  filter: ['id'],
                  filterValue: [id]
                }
              }
            );
  
            const dataMatkul = response.data.data; 

            setMatkulData(dataMatkul);
         }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };
  
    fetchDataMatkul();
  }, [id]);



  const {
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    filter,
    setPageAbsensi,
    refreshAbsensi,
  } = useDatatableAbsensi(DATA_URL, {
    filter: ["id_pembelajaran"],
    filterValue: [id],
  });

  const { destroy } = useCRUD(DELETE_URL);

  const handleTambahMhs = () => {

    refreshAbsensi();
  };

	
	if ([user, menu, loadingAbsensi].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`${matkulData[0]?.matkul.name} | Pertemuan ke-${matkulData[0]?.pertemuan}`} icon={menu.icon} handler={setActive} />

			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
        <TambahMhs data={{ id: id }} onTambahMhs={handleTambahMhs} />
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
                Nama
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                NPM
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
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
                  <UploadTugas data={{ id: row.id }} onTambahMhs={handleTambahMhs} />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nilai ? row.nilai : "-"}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                  <div className="flex items-stretch gap-1">
                    <EditAbsensi data={{ id: row.id }} onTambahMhs={handleTambahMhs} />
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
          <div className="flex gap-1 ml-auto">
            <Button.Icon
              type="button"
              variant="outline-primary"
              icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
              onClick={() => setPageAbsensi(pageAbsensi - 1)}
              disabled={pageAbsensi <= 1}
              pill
            />
            <Button
              type="button"
              variant="primary"
              icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
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
                  Math.max(1, Math.min(event.target.valueAsNumber, pageCountAbsensi || 1))
                )
              }
            />
            of {pageCountAbsensi || 1}
          </div>
        </div>
			</div>
			
		</Layout>
	);
}