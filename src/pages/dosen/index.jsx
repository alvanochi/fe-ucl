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
import { useEffect, useState } from "react";
import axios from "axios";

const AreaChart = dynamic(() => import("../../components/Chart/area"), {
  ssr: false,
});

export default function Home() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard`;
  const { data } = useDatatable(DATA_URL);

  const [dataJabatan, setDataJabatan] = useState(null);

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

  const dataCardPembelajaran = [
    {
      id: 1,
      title: "SKS yang diajar",
      icon: "solar:bill-bold",
      data: data?.sks,
    },
    {
      id: 8,
      title: "Buku Ajar (Jumlah Buku Ajar)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 14,
      title: "Total Pertemuan Perkuliahan",
      icon: "solar:bill-bold",
      data: data?.pertemuanPerkuliahan,
    },
    {
      id: 2,
      title: "Presentase kehadiran (gasal dan genap)",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

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

  const dataCardBimbingan = [
    {
      id: 18,
      title: "Jumlah Mahasiswa Kp Sudah Selesai",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 18,
      title: "Jumlah Mahasiswa Bimbingan Kademik",
      icon: "solar:bill-bold",
      data: data?.bimbingan_akademik,
    },
    {
      id: 11,
      title: "Membimbing kegiatan mahasiswa, (jumlah kegiatan mahasiswa)",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

  const dataCardPengembanganDiri = [
    {
      id: 9,
      title: "Diktat/ Modul Praktikum (jumlah diktat/modul praktikum)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 10,
      title: "Orasi Ilmiah (Jumlah Orasi Ilmiah)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 12,
      title: "Jabatan Struktural ",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 13,
      title: "Melakukan kegiatan pengembangan diri (jam)",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

  const dataCardPenelitian = [
    {
      id: 1,
      title: "Penelitian",
      icon: "solar:bill-bold",
      data: data?.penelitian,
    },
    {
      id: 2,
      title: "Seminar",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 3,
      title: "Publikasi Koran/Majalah",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Menyadur Buku Ilmiah",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Paten Nasional",
      icon: "solar:bill-bold",
      data: data?.hki,
    },
    {
      id: 4,
      title: "Karya Monumental Lokal",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Karya Monumental Nasional",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Karya Monumental Internasional",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

  const dataCardPengabdian = [
    {
      id: 1,
      title: "Publikasi",
      icon: "solar:bill-bold",
      data: data?.publikasi,
    },
    {
      id: 2,
      title: "Pembicara/Penyuluhan",
      icon: "solar:bill-bold",
      data: data?.pembicara,
    },
    {
      id: 3,
      title: "Editor Jurnal Nasional",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Editor Jurnal Internasional",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 5,
      title: "Pelayanan Masyarakat",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

  const dataCardPenunjangTugasDosen = [
    {
      id: 1,
      title:
        "Ketua/Wakil Panitia Kegiatan (PT/Pemerintah Pusat/Pemerintah Daerah)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 2,
      title: "Anggota Panitia Kegiatan (PT/Pemerintah Pusat/Pemerintah Daerah)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 3,
      title: "Pengurus (Nasional/Internasional)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 4,
      title: "Anggota Atas Permintaan (Nasional/Internasional)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 5,
      title: "Anggota (Nasional/Internasional)",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 6,
      title: "Mewakili PT/Lembaga Pemerintah",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 7,
      title: "Ketua Delegasi Pertemuan Internsional",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 8,
      title: "Anggota Delegasi Pertemuan Internasional",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 9,
      title: "Penghargaan",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 10,
      title: "Menulis Buku SLTA kebawah",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 11,
      title: "Prestasi Olahraga",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
    {
      id: 12,
      title: "Asesor PAK, BKD, Hibah dan Pengabdian",
      icon: "icon-park-outline:certificate",
      data: 0,
    },
  ];

  // useEffect(() => {
  //   async function fetchJabatanStruktural(user) {
  //     try {
  //       const DATA_URL = `${process.env.API_ENDPOINT}/users/user-jabatan`;
  //       const response = await axios.get(DATA_URL);

  //       setDataJabatan(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchJabatanStruktural();
  // }, [user]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
              </div>

              <span className="block text-base text-gray-500 font-normal">
                <Icon icon="el:user" width={16} height={16} className="mr-1" />
                NIDN : {data.userData?.nidn}
              </span>
              <span className="block text-base text-gray-500 font-normal">
                <Icon
                  icon="ri:briefcase-fill"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                STATUS : {data.userData?.kode_mhs}
              </span>
              <span className="block text-base text-gray-500 font-normal">
                <Icon
                  icon="material-symbols:account-box-outline-sharp"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                SINGKATAN : {data.userData?.singkat_name}
              </span>
            </div>

            {/* <div>
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-4 mt-4">
                {dataJabatan
                  ? dataJabatan.map((jabatan, index) => {
                      return (
                        <Card
                          key={index}
                          className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <span className="font-bold text-gray-700 text-center">
                            {jabatan.jabatan.nama_jabatan} / {jabatan.unit.code}
                          </span>
                        </Card>
                      );
                    })
                  : ""}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div></div>
      <hr />
      <div className="mt-8 mb-4 w-full sm:w-3/4 lg:w-2/4">
        <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              name="Semester"
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
                <h2 className="text-lg font-semibold mb-2">Pembelajaran</h2>
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardPembelajaran.map((row, index) => {
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
                <h2 className="text-lg font-semibold mb-2 mt-8">Bimbingan</h2>
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardBimbingan.map((row, index) => {
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
                <h2 className="text-lg font-semibold mb-2 mt-8">
                  Pengembangan Diri
                </h2>
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardPengembanganDiri.map((row, index) => {
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

      {/* Penelitian */}
      <div className="flex-1 block">
        <div className="space-y-2 mt-2">
          <Accordion title="Pelaksanaan Penelitian">
            <Card>
              <Card.Body className="mx-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardPenelitian.map((row, index) => {
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

      {/* Pengabdian */}
      <div className="flex-1 block">
        <div className="space-y-2 mt-2">
          <Accordion title="Pelaksanaan Pengabdian">
            <Card>
              <Card.Body className="mx-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardPengabdian.map((row, index) => {
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

      {/* Penunjangg Tugas Dosen */}
      <div className="flex-1 block">
        <div className="space-y-2 mt-2">
          <Accordion title="Penunjang Tugas Dosen">
            <Card>
              <Card.Body className="mx-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardPenunjangTugasDosen.map((row, index) => {
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
