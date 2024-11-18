import { useRouter } from "next/router";
import useUser from "../../../../../hooks/useUser";
import useMenu from "../../../../../hooks/useMenu";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import { Loading } from "../../../../../components/Loading";
import { use, useEffect, useState } from "react";
import axios from "axios";
import Card from "../../../../../components/Card";
import Link from "next/link";

export default function DetailUjian({ baseURL }) {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const [data, setData] = useState([]);

  const fetchData = async (currCode, courseCode) => {
    try {
      const API_URL = `${process.env.API_ENDPOINT}/ujian`;
      const res = await axios.get(API_URL, {
        params: {
          filter: ["curr_code", "course_code"],
          filterValue: [currCode, courseCode],
        },
      });

      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!router.isReady || !user) return;
    fetchData(router.query.curr_code, router.query.course_code);
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <Loading />;

  return (
    <Layout>
      <PageHeader
        title={`List ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {data &&
          data.map((row, index) => (
            <Link
              href={`${process.env.BASE_URL}/mahasiswa/ujian/soal/${row.id}`}
              key={`${index}-row`}
            >
              <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 transition-transform duration-300 hover:shadow-lg hover:scale-105">
                <div
                  className={`relative m-2.5 overflow-hidden text-white rounded-md shadow-md ${
                    index % 4 === 0
                      ? "bg-blue-500"
                      : index % 4 === 1
                      ? "bg-green-500"
                      : index % 4 === 2
                      ? "bg-yellow-500"
                      : "bg-purple-500"
                  }`}
                >
                  <h3 className="text-center text-xl font-bold">
                    {row.type_ujian}
                  </h3>
                </div>

                <div className="p-4">
                  <h6 className="mb-2 text-slate-600 text-xl font-semibold">
                    {row?.matkul?.name}
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6">
                    <div className="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-28 text-center">
                      {row?.kelas}
                    </div>
                    <div className="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-28 text-center">
                      {row?.jenis_ujian}
                    </div>
                    <div className="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-28 text-center">
                      {row?.pengerjaan_ujian}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold">09:00 - 12:00</h4>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="flex flex-col ml-3 text-sm">
                      <span className="text-slate-800 font-semibold">
                        {row?.lecturer?.name}
                      </span>
                      <span className="text-slate-600">10 Januari, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </Layout>
  );
}
