import Head from "next/head";
import dynamic from "next/dynamic";
import { Icon } from "@iconify-icon/react";
import useMenu from "../../hooks/useMenu";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";
import useDatatable from "../../hooks/useDatatable";
import Link from "next/link";

const AreaChart = dynamic(() => import("../../components/Chart/area"), {
  ssr: false,
});

export default function Home() {
	const { user } = useUser({ redirectTo: "/login" });
  const { menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard`;
  const { data } = useDatatable(DATA_URL);

  console.log(data);

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

  if ([menu, user].some((item) => item == null))
    return <p>Loading...</p>;
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
            src={process.env.API_ENDPOINT + "/foto-profile/" + data.userData?.image}
            alt="Profile"
            className="object-cover object-top h-full w-full"
          />
        </div>
        <div className="block">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-primary-600 uppercase mb-4">
              {data.userData?.nama_lengkap || ""}
              <Icon
                icon="material-symbols:verified"
                width={36}
                height={36}
                className="ml-1 text-info-600"
              />
            </h1>
            {isUserDataIncomplete(data.userData) && (
                <Link href="/mahasiswa/profil" type="button" className="ml-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-lg uppercase">
                  <div class="mr-3">
                    <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M13.6086 3.247l8.1916 15.8c.0999.2.1998.5.1998.8 0 1-.7992 1.8-1.7982 1.8H3.7188c-.2997 0-.4995-.1-.7992-.2-.7992-.5-1.1988-1.5-.6993-2.4 5.3067-10.1184 8.0706-15.385 8.2915-15.8.3314-.6222.8681-.8886 1.4817-.897.6135-.008 1.273.2807 1.6151.897zM12 18.95c.718 0 1.3-.582 1.3-1.3 0-.718-.582-1.3-1.3-1.3-.718 0-1.3.582-1.3 1.3 0 .718.582 1.3 1.3 1.3zm-.8895-10.203v5.4c0 .5.4.9.9.9s.9-.4.9-.9v-5.3c0-.5-.4-.9-.9-.9s-.9.4-.9.8z"></path>
                    </svg>
                  </div>
                  LENGKAPI DATA PRIBADI TERLEBIH DAHULU!
                </Link>
              )}
            
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
            {/* {profile?.educations?.at(0) != null
              ? profile?.educations.at(0).jenjang_studi
              : ""}{" "}
            {profile?.educations?.at(0) != null
              ? profile?.educations.at(0).program_studi
              : ""} */}
          </span>
        </div>
      </div>
      <Card className="mb-4">
        <Card.Header className="bg-primary-600 text-white text-center text-sm">
          Summary
        </Card.Header>
        <Card.Body className="mx-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Tes</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Sertifikat</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Pembicara</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Pengabdian</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Penghargaan</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Penelitian</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total Publikasi Karya</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
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
                <p className="block text-sm">Total HKI</p>
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
      </Card>
      <div className="flex gap-4 mb-4">
        <Card className="grow">
          <Card.Header className="bg-primary-600 text-white text-center text-sm">
            Detail Publikasi per Tahun
          </Card.Header>
          <Card.Body className="-mx-4">
            <AreaChart />
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}
