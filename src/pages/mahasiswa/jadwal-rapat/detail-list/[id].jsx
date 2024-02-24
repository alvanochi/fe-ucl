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
import AddAbsensiRapat from "./absensi";
import EditAbsensi from "./editAbsensi";
import Card from "../../../../components/Card";
import { data } from "autoprefixer";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";


export default function DetailList() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();


  const router = useRouter();

  const DATA_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi-meeting`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/absensi-meeting/delete`;

  const id = router.query.id;

  const [dataMeet, setDataMeet] = useState({
    nm_pengundang: "",
    nm_kegiatan: "",
    ruangan: "",
    pertemuan:"",
    tanggal: "",
    waktu: "",
    notulen: "",
    bukti_foto: "",
    status_ruangan: ""
  });

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
            setDataMeet(dataMeet[0]);
         }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };
  
    fetchDetailMeet();
  }, [id]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setDataMeet((prevData) => ({
      ...prevData,
      [name]: name === "status_ruangan" ? (value !== "" ? parseInt(value) : 0) : value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.API_ENDPOINT_ABSEN}/meeting/update/${id || ""}`,
        dataMeet
      );

      const responseData = response.data;

      if(responseData){
        toastAlert("success", "Updated Successfully");
        router.push(prefix + menu.url);
      }

    } catch (error) {
      console.error("Error updating data:", error);

      if (error.name === "AxiosError") {
        toastAlert("error", error.message);
      } else {
        loadingAlert();
        MySwal.close();
        toastAlert("error", "Update failed. Please try again.");
      }
    }
  };


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

  const handleAbsensi = () => {

    refreshAbsensi();
  };

  const FILE_URL = `https://absen.ft.uika-bogor.ac.id/storage/meeting/photo/${dataMeet.bukti_foto}`;


	
	if ([user, menu, loadingAbsensi].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Detail Pertemuan dan List Absensi`} icon={menu.icon} handler={setActive} />

			<div className="my-8">
        <Form onSubmit={submitHandler}>
          <Card className="mt-4">
            <Card.Header className="text-center">Detail Pertemuan</Card.Header>
            <Card.Body className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Nama Pengundang <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="nm_pengundang"
                  value={dataMeet.nm_pengundang}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Nama Kegiatan <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="nm_kegiatan"
                  value={dataMeet.nm_kegiatan}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Ruangan <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="ruangan"
                  value={dataMeet.ruangan}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Pertemuan <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="pertemuan"
                  value={dataMeet.pertemuan}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Tanggal <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="date"
                  className="flex-1"
                  name="tanggal"
                  value={dataMeet.tanggal}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Waktu <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="time"
                  className="flex-1"
                  name="waktu"
                  value={dataMeet.waktu}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Status Ruangan <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <div className="flex gap-4">
                  <Form.Label>
                    <Form.Radio name="status_ruangan" onChange={inputHandler} value={0} checked={dataMeet.status_ruangan == 0} disabled />
                    Offline
                  </Form.Label>
                  <Form.Label>
                    <Form.Radio name="status_ruangan" onChange={inputHandler} value={1} checked={dataMeet.status_ruangan == 1} disabled />
                    Online
                  </Form.Label>
                  <Form.Label>
                    <Form.Radio name="status_ruangan" onChange={inputHandler} value={2} checked={dataMeet.status_ruangan == 2} disabled />
                    Hybird
                  </Form.Label>
                </div>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Notulen 
                </Form.Label>
                <span>:</span>
                <Form.Textarea
                  className="flex-1"
                  rows="5"
                  name="notulen"
                  value={dataMeet.notulen}
                  onChange={inputHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Dokumentasi
                </Form.Label>
                <span>:</span>
                <div className="block flex-1 space-y-2">
                  <Form.Input
                    type="file"
                    className="flex-1"
                    name="bukti_foto"
                    onChange={inputHandler}
                    disabled
                  />
                  <img
                  src={FILE_URL}
                  className="w-full h-[256px]"
                  alt="dokumentasi"
                />
              </div>
              </Form.Group>
            </Card.Body>
            {/* <div className="flex justify-center gap-4 mt-4 mb-4"> 
              <Button
                as="a"
                href={prefix + menu.url}
                variant="secondary"
                className="w-2/6 h-12"
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" className="w-2/6 h-12">
                Konfirmasi
              </Button>
            </div> */}
          </Card>
        </Form>
        
			<div className="flex items-center justify-center gap-2 mb-8 mt-12">
        {/* <AddAbsensiRapat data={{ id: id }} onAddAbsensi={handleAbsensi} /> */}
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
                NIP/NPM
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
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
                  {row.name_absen}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.code}
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
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                  <div className="flex items-stretch gap-1">
                    {/* <EditAbsensi data={{ id: row.id }} onAddAbsensi={handleAbsensi} />
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