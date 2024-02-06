import Head from "next/head";
import dynamic from "next/dynamic";
import { Icon } from "@iconify-icon/react";
import useMenu from "../../hooks/useMenu";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";
import useDatatable from "../../hooks/useDatatable";
import Link from "next/link";
import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../../../tailwind.config.js";

const AreaChart = dynamic(() => import("../../components/Chart/area"), {
  ssr: false,
});

export default function Home() {
	const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard`;
  const { data } = useDatatable(DATA_URL);


  function isUserDataComplete(userData) {
    return (
      userData?.nik !== null &&
      userData?.jenkel !== null &&
      userData?.tanggal_lahir !== null &&
      userData?.tempat_lahir !== null &&
      userData?.agama !== null &&
      userData?.warga_negara !== null &&
      userData?.email !== null &&
      userData?.alamat !== null &&
      userData?.rt !== null &&
      userData?.rw !== null &&
      userData?.desa_kelurahan !== null &&
      userData?.kota_kabupaten !== null &&
      userData?.provinsi !== null &&
      userData?.kode_pos !== null &&
      userData?.no_hp !== null
    );
  }

  const [valueChart, setValueChart] = useState([]);
  const [labelsChart, setLabelsChart] = useState([]);

const config = resolveConfig(twConfig);


  const {
    theme: { colors },
  } = config;

  const dataUse = {
    labels: labelsChart,
    datasets: [
      {
        fill: true,
        label: "IPS",
        data: valueChart,
        borderColor: colors.primary[600],
        backgroundColor: (context) => {
          const bgColor = [colors.primary[400], "rgba(255, 255, 255, 0.1)"];
  
          if (!context.chart.chartArea) return;
  
          const {
            ctx,
            chartArea: { top, bottom },
          } = context.chart;
          const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
          gradientBg.addColorStop(0, bgColor[0]);
          gradientBg.addColorStop(1, bgColor[1]);
  
          return gradientBg;
        },
      },
    ],
  };

  useEffect(() => {
    if(data && data.dataChart){
      const datas = data.dataChart.data;
      const labels = data.dataChart.label;

      setValueChart(datas);
      setLabelsChart(labels)
    }
  }, [data])


  if ([menu, user,].some((item) => item == null))
    return <p>Loading...</p>;
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
            src={process.env.API_ENDPOINT + "/foto-profile/" + data.userData?.image}
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
            {!isUserDataComplete(data.userData) && (
              <Link
                href="/mahasiswa/profil"
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
          <span className="block text-sm sm:text-base text-gray-500 font-normal">
            <Icon icon="el:user" width={16} height={16} className="mr-1" />
            NPM : {data.userData?.npm}
          </span>
          <span className="block text-sm sm:text-base text-gray-500 font-normal">
            <Icon icon="ri:briefcase-fill" width={16} height={16} className="mr-1" />
            STATUS : {data.userData?.kode_mhs}
          </span>
          <span className="block text-sm sm:text-base text-gray-500 font-normal">
            <Icon icon="ep:rank" width={16} height={16} className="mr-1" />
            POINT : {data.userData?.total_point}
          </span>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header className="bg-primary-600 text-white text-center text-sm">
          Summary
        </Card.Header>
        <Card.Body className="mx-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            <Card>
              <Card.Body>
                <Link href={`${prefix}/kompetensi`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="icon-park-outline:certificate"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.tes}
                  </p>
                  <p className="block text-sm">Total Pengajuan Tes</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/kompetensi`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="icon-park-outline:certificate"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.sertifikasi}
                  </p>
                  <p className="block text-sm">Total Pengajuan Sertifikasi</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/pelaksanaan-pengabdian`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="fa6-solid:hand-holding-hand"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.pembicara}
                  </p>
                  <p className="block text-sm">Total Pengajuan Pembicara</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/pelaksanaan-pengabdian`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="fa6-solid:hand-holding-hand"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.pengabdian}
                  </p>
                  <p className="block text-sm">Total Pengajuan Pengabdian</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/penunjang`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="solar:users-group-two-rounded-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.penghargaan}
                  </p>
                  <p className="block text-sm">Total Pengajuan Penghargaan</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/pelaksanaan-penelitian`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="fa:flask"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.penelitian}
                  </p>
                  <p className="block text-sm">Total Pengajuan Penelitian</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/pelaksanaan-penelitian`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="fa:flask"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.publikasi}
                  </p>
                  <p className="block text-sm">Total Pengajuan Publikasi Karya</p>
                </Link>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Link href={`${prefix}/pelaksanaan-penelitian`}>
                  <div className="inline-flex p-2 rounded-full bg-primary-600 mb-2">
                    <Icon
                      icon="fa:flask"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <p className="block text-2xl font-bold leading-relaxed">
                    {data.hki}
                  </p>
                  <p className="block text-sm">Total Pengajuan HKI</p>
                </Link>
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
      </Card>

         <Card className="col-span-2 sm:col-span-8 lg:col-span-8">
          <Card.Header className="bg-primary-600 text-white text-center text-sm">
            Detail Grafik IPS
          </Card.Header>
          <Card.Body className="">
            <AreaChart data={dataUse} />
          </Card.Body>
        </Card>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
        
        <Card className="col-span-2 sm:col-span-4 lg:col-span-4">
          <Card.Header className="bg-primary-600 text-white text-center text-sm">
            Cetak Dokumen Riwayat Hidup
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="grow space-y-2">
                <Button
                  className="w-full"
                  icon={
                    <Icon
                      icon="ant-design:setting-filled"
                      width={24}
                      height={24}
                    />
                  }
                  pill
                >
                  Atur Format CV
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<Icon icon="bxs:file" width={24} height={24} />}
                  pill
                >
                  Print CV
                </Button>
              </div>
              <div className="shrink-0">
                <img
                  src="/icon/print_cv.png"
                  alt="Print Illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div> */}
    </Layout>
  );
}
