import useMenu from "../../../../hooks/useMenu";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import useUser from "../../../../hooks/useUser";
import _ from "underscore";
import { Icon } from "@iconify-icon/react";
import { useRouter } from "next/router";
import useDatatableAbsensi from "../../../../hooks/useDataTableAbsensi";
import useCRUD from "../../../../hooks/useCRUD";
import { useEffect, useState } from "react";
import axios from "axios";
import InvitePesertaDosen from "./invite";
import InvitePesertaMhs from "./inviteMhs";


export default function Invite() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();


  const router = useRouter();

  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/meeting-invite`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/meeting-invite/delete`
  const id = router.query.id;

  const [dataMeet, setDataMeet] = useState({});

  useEffect(() => {
    const fetchDetailMeet = async () => {
      try {
          if (id) {
            const response = await axios.get(
              `${process.env.API_ENDPOINT_ABSEN}/meeting`,
              {
                params: {
                  filter: ['id'],
                  filterValue: [id]
                }
              }
            );
  
            const dataMeet = response.data.data; 
            setDataMeet(dataMeet);
         }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };
  
    fetchDetailMeet();
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
    filter: ["id_meeting"],
    filterValue: [id],
  });

  const { destroy } = useCRUD(DELETE_URL);

  const handleInvite = () => {

    refreshAbsensi();
  };

	
	if ([user, menu, loadingAbsensi].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Peserta Kegiatan yang Diundang`} icon={menu.icon} handler={setActive} />

			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
        {/* <InvitePesertaDosen data={{ id: id }} onInvite={handleInvite} /> */}
        {/* <InvitePesertaMhs data={{ id: id }} onInvite={handleInvite} /> */}
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
                NPM/NIK
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
                  {row.nip_dosen ? row.dosen?.nama : row.mahasiswa?.name}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nip_dosen ? row.nip_dosen : row.npm}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                  <div className="flex items-stretch gap-1">
                    {/* <Button.Icon
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
                    /> */}
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