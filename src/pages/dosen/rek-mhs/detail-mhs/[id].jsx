import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";

export default function DetailMhs() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  
  if ([user, menu].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title='Rekomendasi Mahasiswa' icon={menu.icon} handler={setActive} />
      <div className="my-8">
        <div className="px-4 md:px-8 lg:px-16">
          <div className="p-4 md:pt-24 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center justify-between mt-20 md:mt-0 md:justify-center">
                <div className="pl-4">
                  <p className="font-bold text-gray-700 text-xl">500</p>
                  <p className="text-gray-400">Point Penelitian</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">789</p>
                  <p className="text-gray-400">Point Pendidikan</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">201</p>
                  <p className="text-gray-400">Point Pengabdian</p>
                </div>
              </div>
              <div className="relative">
                <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute md:relative inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                  <img src="/img/azis.jpg" alt="" width={200} height={200} className="rounded-full" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center justify-between mt-20 md:mt-0 md:justify-center">
                <div>
                  <p className="font-bold text-gray-700 text-xl">500</p>
                  <p className="text-gray-400">Point Kompetensi</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">789</p>
                  <p className="text-gray-400">Point Penunjang</p>
                </div>
                <div className="pr-10">
                  <p className="font-bold text-gray-700 text-xl">201</p>
                  <p className="text-gray-400">Point Rekomendasi</p>
                </div>
              </div>
            </div>
            <div className="mt-20 text-center border-b pb-12">
              <h1 className="text-2xl md:text-4xl font-medium text-gray-700">M Ajis Pratama | <span className="font-light text-gray-500">201106040468</span></h1>
              <p className="font-light text-gray-600 mt-3">IPK, 3.89</p>
              <p className="mt-4 font-bold text-gray-500">TOTAL POINT: 5065 - Qualified</p>
            </div>
          </div>
        </div>


        <div className="px-4 md:px-8 lg:px-16 pt-6">
          <div className="p-4 md:pt-4 bg-white rounded-xl shadow-xl overflow-hidden">  
            <div className="my-4">
              <textarea placeholder="Rekomendasi*" className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div className="my-2 w-1/2 lg:w-1/4 pb-4">
              <button className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full 
                          focus:outline-none focus:shadow-outline">
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
