import Head from "next/head";
import dynamic from "next/dynamic";
import { Icon } from "@iconify-icon/react";
import useMenu from "../../hooks/useMenu";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import useUser from "../../hooks/useUser";
import useDatatable from "../../hooks/useDatatable";
import Link from "next/link";
import { Loading } from "../../components/Loading";
import Accordion from "../../components/Accordion";
import Form from "../../components/Form";

const AreaChart = dynamic(() => import("../../components/Chart/area"), {
  ssr: false,
});

export default function Home() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard`;
  const { data } = useDatatable(DATA_URL);
  function isUserDataIncomplete(userData) {
    return (
      userData?.nik == null ||
      userData?.jenkel == null ||
      userData?.tanggal_lahir == null ||
      userData?.tempat_lahir == null ||
      userData?.agama == null ||
      userData?.warga_negara == null ||
      userData?.email == null ||
      userData?.alamat == null ||
      userData?.rt == null ||
      userData?.rw == null ||
      userData?.desa_kelurahan == null ||
      userData?.kota_kabupaten == null ||
      userData?.provinsi == null ||
      userData?.kode_pos == null ||
      userData?.no_hp == null
    );
  }

  const dataCardBimbinganTugasAkhir = [
    {
      id: 3,
      title: "ketua pembimbing (Pembimbing 1)",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.pembimbing1Count,
    },
    {
      id: 4,
      title: "Pembimbing Pendamping (Pembimbing 2)",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.pembimbing2Count,
    },
    {
      id: 6,
      title: "Ketua Penguji (Penguji 1)",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.penguji1Count,
    },
    {
      id: 7,
      title: "Anggota Penguji (Penguji 2)",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.penguji2Count,
    },
    {
      id: 15,
      title: "Jumlah Mahasiswa Mengajukan SK",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.pengajuan_sk,
    },
    {
      id: 16,
      title: "Jumlah Mahasiswa Menuju Kolokium",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.menuju_kolokium,
    },
    {
      id: 17,
      title: "Jumlah Mahasiswa Menuju Sidang",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.menuju_sidang,
    },
    {
      id: 18,
      title: "Jumlah Menyelesaikan Revisi",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.menyelesaikan_revisi,
    },
    {
      id: 19,
      title: "Jumlah Mahasiswa Selesai Tugas Akhir",
      icon: "solar:bill-bold",
      data: data?.tugas_akhir?.selesai,
    },
  ];

  if ([menu, user].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <Head>
        <title>
          {menu.label ?? ""} - {process.env.APP_NAME ?? ""}
        </title>
      </Head>
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-200 mb-4 rounded-2xl">
        <div className="w-full sm:w-28 h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white">
          <img
            src={
              process.env.API_ENDPOINT + "/foto-profile/" + data.userData?.image
            }
            alt="Profile"
            className="object-cover object-top w-full h-auto"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center flex-col sm:flex-row">
            <h1 className="text-xl sm:text-2xl font-semibold text-primary-600 uppercase mb-2 sm:mb-4">
              {data.userData?.nama_lengkap || ""}
              <Icon
                icon="material-symbols:verified"
                width={36}
                height={36}
                className="ml-0 sm:ml-1 text-info-600"
              />
            </h1>
            {!isUserDataIncomplete(data.userData) && (
              <Link
                href="/dosen/profil"
                type="button"
                className="mt-2 mb-2 sm:mt-0 ml-0 sm:ml-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-sm sm:text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto uppercase"
              >
                <div className="mr-2">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M13.6086 3.247l8.1916 15.8c.0999.2.1998.5.1998.8 0 1-.7992 1.8-1.7982 1.8H3.7188c-.2997 0-.4995-.1-.7992-.2-.7992-.5-1.1988-1.5-.6993-2.4 5.3067-10.1184 8.0706-15.385 8.2915-15.8.3314-.6222.8681-.8886 1.4817-.897.6135-.008 1.273.2807 1.6151.897zM12 18.95c.718 0 1.3-.582 1.3-1.3 0-.718-.582-1.3-1.3-1.3-.718 0-1.3.582-1.3 1.3 0 .718.582 1.3 1.3 1.3zm-.8895-10.203v5.4c0 .5.4.9.9.9s.9-.4.9-.9v-5.3c0-.5-.4-.9-.9-.9s-.9.4-.9.8z"></path>
                  </svg>
                </div>
                LENGKAPI DATA PRIBADI TERLEBIH DAHULU!
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 w-2/4">
        <Form className="grid grid-cols-2 gap-4">
          <Form.Group>
            <Form.Label className="pb-2">Tahun Akademik :</Form.Label>
            <Form.Select
              name="Tahu_akademik"
              options={[
                { value: "2023/2024", label: "2023/2024" },
                { value: "2022/2023", label: "2022/2023" },
                { value: "2021/2022", label: "2021/2022" },
                { value: "2020/2021", label: "2020/2021" },
                { value: "2018/2019", label: "2018/2019" },
                { value: "2017/2018", label: "2017/2018" },
              ]}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="pb-2">Semester :</Form.Label>
            <Form.Select
              name="Tahu_akademik"
              options={[
                { value: "GASAL", label: "GASAL" },
                { value: "GENAP", label: "GENAP" },
              ]}
            />
          </Form.Group>
        </Form>
      </div>

      {/* Pendidikan */}
      <div className="flex-1 block">
        <div className="space-y-2 mt-2">
          <Accordion title="Pelaksanaan Pendidikan">
            <Card>
              <Card.Body className="mx-6">
                <h2 className="text-lg font-semibold mb-2 mt-8">Tugas AKhir</h2>
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardBimbinganTugasAkhir.map((row, index) => {
                    return (
                      <>
                        <Card key={`row-${index}`}>
                          <Card.Body>
                            <Link href="#">
                              <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                                <Icon
                                  icon={row.icon}
                                  width={24}
                                  height={24}
                                  className="text-white"
                                />
                              </div>
                              <p className="block text-2xl font-bold leading-relaxed">
                                {row.data}
                              </p>
                              <p className="block text-sm">{row.title}</p>
                            </Link>
                          </Card.Body>
                        </Card>
                      </>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
