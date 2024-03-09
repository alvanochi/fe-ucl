import useMenu from "../../../../../hooks/useMenu";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useUser from "../../../../../hooks/useUser";
import _ from "underscore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../../components/Button";
import { Icon } from "@iconify-icon/react";


export default function ListMhs() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.id) {
          const [idmatkul, kelas] = router.query.id.split('-');
  
          const DATA_URL = `https://absen.ft.uika-bogor.ac.id/api/pembelajaran/list-absen`;
          const response = await axios.get(DATA_URL, {
            params: {
              dataTable: true,
              id_matkul: idmatkul,
              kelas: kelas,
            },
          });
          setData(response.data.data);
          setHeader(response.data.matkul);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [router.query]);

  console.log(data);
	
	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={`Rekap Mahasiswa`} icon={menu.icon} handler={setActive} />

			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
        
      </div>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
          cellPadding={10}
        >
          <thead>
          <tr>
            <td colSpan="19" className="text-center text-lg font-bold bg-purple-500">
              <span style={{ color: 'white' }}>Mata Kuliah: {header?.name}</span>
            </td>
              </tr>
              <tr>
              <td colSpan="19" className="text-center text-lg font-bold bg-purple-500">
              <span style={{ color: 'white' }}>Kelas: {header?.class} | {header?.academic_year}</span>
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
                  nama
                </div>
              </th>
              {[...Array(7)].map((_, index) => (
                <th key={index} className="text-sm border-2 border-white bg-gray-200">
                  {index + 1}
                </th>
              ))}
              <th className="text-sm border-2 border-white bg-gray-200">UTS</th>
              {[...Array(7)].map((_, index) => (
                <th key={index + 7} className="text-sm border-2 border-white bg-gray-200">
                  {index + 8}
                </th>
              ))}
              <th className="text-sm border-2 border-white bg-gray-200">UAS</th>
              <th className="text-sm border-2 border-white bg-gray-200">%</th>
            </tr>
          </thead>
          <tbody>
          {loading && (
              <tr>
                <td colSpan="20" className="text-sm border-2 border-white bg-gray-50 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && data && data.length < 1 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-sm border-2 border-white bg-gray-50 text-center ml-10"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
            {!loading &&
              data &&
              data.map((row, index) => (
                <tr key={index}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {index + 1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.name_mhs} <br />
                    {row.npm}
                  </td>
                  {[...Array(7)].map((_, columnIndex) => (
                    <td key={columnIndex} className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                      <div className="flex items-stretch gap-1">
                        {row.status_absen[columnIndex] === 1 && 'Y'}
                        {row.status_absen[columnIndex] === 0 && 'A'}
                        {row.status_absen[columnIndex] === 2 && 'S/I'}
                        {row.status_absen[columnIndex] == null && '-'}
                      </div>
                    </td>
                  ))}
                  <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                    {row.uts} 
                  </td>
                  {[...Array(7)].map((_, columnIndex) => (
                    <td key={columnIndex + 7} className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                      <div className="flex items-stretch gap-1">
                        {row.status_absen[columnIndex + 7] === 1 && 'Y'}
                        {row.status_absen[columnIndex + 7] === 0 && 'A'}
                        {row.status_absen[columnIndex + 7] === 2 && 'S/I'}
                        {row.status_absen[columnIndex + 7] == null && '-'}
                      </div>
                    </td>
                  ))}
                  <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                    {row.uas}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <div className="flex items-stretch gap-1">
                      {row.persentase}
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex mt-8">
          <Button
            as="a"
            href={`${prefix + menu.url}`}
            variant="danger"
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            iconPosition="left"
            pill
          >
            Kembali
          </Button>
        </div>
       
			</div>
			
		</Layout>
	);
}