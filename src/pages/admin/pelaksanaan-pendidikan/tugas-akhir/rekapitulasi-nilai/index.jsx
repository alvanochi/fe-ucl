import { useState } from "react";
import Layout from "../../../../../components/Layout";
import { Loading } from "../../../../../components/Loading";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import RekapitulasiNilaiKolokim from "../../../../../modules/admin/pelaksanaan-pendidikan/tugas-akhir/rekapitulasi/kolokium";
import RekapitulasiNilaiSidang from "../../../../../modules/admin/pelaksanaan-pendidikan/tugas-akhir/rekapitulasi/sidang";

export default function RekapitulasiNilai() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  const [activeTab, setActiveTab] = useState("kolokium");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`${menu.label} | Rekap Penilaian Tugas Akhir`}
        icon={menu.icon}
        handler={setActive}
      />

      <div className="sm:hidden">
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mt-8"
          onChange={(e) => handleTabClick(e.target.value)}
        >
          <option value="form">Penilaian Kolokium</option>
          <option value="link">Penilaian Sidang</option>
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 mt-8">
        <li className="w-full focus-within:z-10">
          <span
            onClick={() => handleTabClick("kolokium")}
            className={`inline-block w-full p-4 border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4  focus:outline-none cursor-pointer ${
              activeTab === "kolokium"
                ? "bg-white text-gray-700 font-bold"
                : "bg-gray-150"
            }`}
          >
            Penilaian Kolokium
          </span>
        </li>
        <li className="w-full focus-within:z-10">
          <span
            onClick={() => handleTabClick("sidang")}
            className={`inline-block w-full p-4 border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4  focus:outline-none cursor-pointer ${
              activeTab === "sidang"
                ? "bg-white text-gray-700 font-bold"
                : "bg-gray-50"
            }`}
          >
            Penilaian Sidang
          </span>
        </li>
      </ul>

      <div className="my-8">
        {activeTab === "kolokium" && (
          <RekapitulasiNilaiKolokim baseURL={prefix + menu.url} />
        )}
        {activeTab === "sidang" && (
          <RekapitulasiNilaiSidang baseURL={prefix + menu.url} />
        )}
      </div>
    </Layout>
  );
}
