import useMenu from "../../../../../hooks/useMenu";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useUser from "../../../../../hooks/useUser";
import _ from "underscore";


export default function ListMhs() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();
	
	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Rekap Mahasiswa`} icon={menu.icon} handler={setActive} />

			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
        {/* <TambahMhs data={{ id: id }} onTambahMhs={handleTambahMhs} /> */}
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
        <tr>
          <td colSpan="19" className="text-center text-lg font-bold bg-purple-500">
            <span style={{ color: 'white' }}>Mata Kuliah: Sistem Penunjang Keputusan</span>
          </td>
            </tr>
            <tr>
            <td colSpan="19" className="text-center text-lg font-bold bg-purple-500">
            <span style={{ color: 'white' }}>Kelas: Reguler B | Genap 2024-2025</span>
              </td>
            </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer">
                No
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Matakuliah
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              1
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              2
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              3
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              4
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              5
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              6
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              7
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              UTS
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              8
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              9
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              10
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              11
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              12
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              13
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              14
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              UAS
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              1
            </td>
            <td className="text-sm border-2 border-white bg-gray-50">
              M Ajis Pratama
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
              Y
                
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> 

            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                90%
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              2
            </td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Tamam Mulya
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
              Y
                
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> 

            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                90%
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              3
            </td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Wahyu
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
              Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                Y
              </div>
            </td> 

            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                
                90%
              </div>
            </td>
          </tr>
        </tbody>
        
      </table>

			</div>
			
		</Layout>
	);
}