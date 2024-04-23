import Head from "next/head";
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

export default function Home() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard/admin`;
  const { data } = useDatatable(DATA_URL);

  const dataCardPembelajaran = [
    {
      id: 1,
      title: "SKS yang diajar",
      icon: "solar:bill-bold",
      data: 0,
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
      data: 0,
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
      data: 0,
    },
    {
      id: 4,
      title: "Pembimbing Pendamping (Pembimbing 2)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 6,
      title: "Ketua Penguji (Penguji 1)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 7,
      title: "Anggota Penguji (Penguji 2)",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 15,
      title: "Jumlah Mahasiswa Mengajukan SK",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 16,
      title: "Jumlah Mahasiswa Menuju Kolokium",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 17,
      title: "Jumlah Menyelesaikan Revisi",
      icon: "solar:bill-bold",
      data: 0,
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
      data: 0,
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
      title: "Jabatan Struktural",
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
      title: "Publikasi",
      icon: "solar:bill-bold",
      data: 0,
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
      data: 0,
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
      data: 0,
    },
    {
      id: 2,
      title: "Pembicara?Penyuluhan",
      icon: "solar:bill-bold",
      data: 0,
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
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 6,
      title: "Mewakili PT/Lembaga Pemerintah",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 7,
      title: "Ketua Delegasi Pertemuan Internsional",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 8,
      title: "Anggota Delegasi Pertemuan Internasional",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 9,
      title: "Penghargaan",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 10,
      title: "Menulis Buku SLTA kebawah",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 11,
      title: "Prestasi Olahraga",
      icon: "solar:bill-bold",
      data: 0,
    },
    {
      id: 12,
      title: "Asesor PAK, BKD, Hibah dan Pengabdian",
      icon: "solar:bill-bold",
      data: 0,
    },
  ];

  const dataCardSummary = [
    {
      id: 1,
      title: "Total Pengajuan Tes",
      icon: "solar:bill-bold",
      data: data?.tes,
    },
    {
      id: 2,
      title: "Total Pengajuan Sertifikasi",
      icon: "solar:bill-bold",
      data: data?.sertifikasi,
    },
    {
      id: 3,
      title: "Total Pengajuan Pembicara",
      icon: "solar:bill-bold",
      data: data?.pembicara,
    },
    {
      id: 4,
      title: "Total Pengajuan Pengabdian",
      icon: "solar:bill-bold",
      data: data?.pengabdian,
    },
    {
      id: 5,
      title: "Total Pengajuan Penghargaan",
      icon: "solar:bill-bold",
      data: data?.penghargaan,
    },
    {
      id: 6,
      title: "Total Pengajuan Penelitian",
      icon: "solar:bill-bold",
      data: data?.penelitian,
    },
    {
      id: 7,
      title: "Total Pengajuan Publikasi Karya",
      icon: "solar:bill-bold",
      data: data?.publikasi,
    },
    {
      id: 7,
      title: "Total Pengajuan HKI",
      icon: "solar:bill-bold",
      data: data?.hki,
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
      <div className="flex gap-4 p-4 bg-gray-200 mb-4 rounded-2xl">
        <div className="w-28 h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white">
          <img
            src={
              process.env.API_ENDPOINT + "/foto-profile/" + data.userData?.image
            }
            alt="Profile"
            className="object-cover object-top h-full w-full"
          />
        </div>
        <div className="block">
          <h1 className="flex items-center text-2xl font-semibold text-primary-600 uppercase mb-4">
            {data.userData?.nama_lengkap || ""}
            <Icon
              icon="material-symbols:verified"
              width={36}
              height={36}
              className="ml-1 text-info-600"
            />
          </h1>
        </div>
      </div>

      {/* Summary */}
      <div className="flex-1 block">
        <div className="space-y-2 mt-2">
          <Accordion title="Summary">
            <Card>
              <Card.Body className="mx-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {dataCardSummary.map((row, index) => {
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
