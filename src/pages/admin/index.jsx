import Head from "next/head";
import { Icon } from "@iconify-icon/react";
import useMenu from "../../hooks/useMenu";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import useUser from "../../hooks/useUser";
import useDatatable from "../../hooks/useDatatable";
import Link from "next/link";
import { Loading } from "../../components/Loading";

export default function Home() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/dashboard/admin`;
  const { data } = useDatatable(DATA_URL);

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
          {/* <span className="block text-base text-gray-500 font-normal">
            <Icon icon="el:user" width={16} height={16} className="mr-1" />
            NPM : {data.userData?.npm}
          </span>
          <span className="block text-base text-gray-500 font-normal">
            <Icon icon="ep:rank" width={16} height={16} className="mr-1" />
            POINT : {data.userData?.total_point}
          </span> */}
          {/* <span className="block text-base text-gray-500 font-normal">
            <Icon
              icon="ri:briefcase-fill"
              width={16}
              height={16}
              className="mr-1"
            />
            {profile?.educations?.at(0) != null
              ? profile?.educations.at(0).jenjang_studi
              : ""}{" "}
            {profile?.educations?.at(0) != null
              ? profile?.educations.at(0).program_studi
              : ""}
          </span> */}
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
                  <p className="block text-sm">Total Pengajuan Pengajuan Tes</p>
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
                  <p className="block text-sm">
                    Total Pengajuan Publikasi Karya
                  </p>
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
    </Layout>
  );
}
