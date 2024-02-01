import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import _ from "underscore";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import SortIcon from "../../../components/SortIcon";
import { Icon } from "@iconify-icon/react";
import ShowQr from "./show-qr";
import ModalAbsen from "../../../components/ModalAbsen";
import useDataTableAbsensi from "../../../hooks/useDataTableAbsensi";
import axios from "axios";


export default function Absen() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/delete`;
  const {
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    filter,
    setPageAbsensi,
    setFilter,
    canPrevAbsensi,
    canNextAbsensi,
    refreshAbsensi,
    sortBy,
    getSortBy,
  } = useDataTableAbsensi(DATA_URL, {
    filter: ['nik_dosen'],
    filterValue: [user && user.nip],
  });

  const { destroy } = useCRUD(DELETE_URL);

	if ([user,  menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title="Tias Absensi" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
            <Button
              as="a"
              href={`${prefix + menu.url}/generate`}
              variant="primary"
              icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
              pill
            >
              Generate QRCODE
            </Button>
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
                  Kode
                </div>
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
                    {row.status_kelas === 1 ? "OFFLINE" : "ONLINE" }
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <div className="flex items-stretch gap-1">
                      <ShowQr
                        data={{ token: row.token, matkul: row.matkul?.name }}
                      />
                      <Button.Icon
                        as="a"
                        href={`${prefix + menu.url}/list-mhs/${row.id}`}
                        variant="primary"
                        icon={<Icon icon="bx:group" width={20} height={20} />}
                      />
                      <Button.Icon
                        as="a"
                        href={`${prefix + menu.url}/edit/${row.id}`}
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
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