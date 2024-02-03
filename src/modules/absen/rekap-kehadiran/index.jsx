import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Link from "next/link";

export default function RekapKehadiran({ baseURL, user }) {

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
        {/* <Button
          as="a"
          href={`${baseURL}/daftar-hadir/generate`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Generate QRCODE
        </Button> */}
      </div>
      <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
          cellPadding={10}
        >
          <thead>
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
                <div className="flex items-center gap-2 cursor-pointer">
                  Kelas
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
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Rekayasa Perangkat Lunak
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                REGULER_A
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Verifikasi dan Validasi Perangkat Lunak
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                REGULER_B
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Matematika Diskrit
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                REGULER_D
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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
                4
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Statiska Dan Probabilitas
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
              REGULER_A
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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
                5
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Proyek Perangkat Lunak
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                REGULER_C
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-blue-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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
                6
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                <Link href={`${baseURL}/rekap-kehadiran/list-mhs/jsdbfs`} className="text-blue-500">
                  Rekayasa Perangkat Lunak
                </Link>
              </td>
              <td className="text-sm border-2 border-white bg-gray-50">
                REGULER_A
              </td>
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-green-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
                </div>
              </td> 
              <td className="text-sm border-2 border-white bg-purple-400 max-w-[8rem] truncate mx-auto">
                <div className="flex items-stretch gap-1">
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

        <div className="flex mt-8">
          <div className="flex gap-1 ml-auto">
            <Button.Icon
              type="button"
              variant="outline-primary"
              icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
              // onClick={() => setPageAbsensi(pageAbsensi - 1)}
              // disabled={pageAbsensi <= 1}
              pill
            />
            <Button
              type="button"
              variant="primary"
              icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
              iconPosition="right"
              // onClick={() => setPageAbsensi(pageAbsensi + 1)}
              // disabled={pageAbsensi >= pageCountAbsensi}
              pill
            >
              Next Page
            </Button>


          </div>
          <div className="ml-auto whitespace-nowrap flex items-center gap-2">
            <p className="">Page</p>
            <Form.Input
              type="number"
              min="1"
              max={1}
              className="w-20"
              value={1}
              // onChange={(event) =>
              //   setPageAbsensi(
              //     Math.max(1, Math.min(event.target.valueAsNumber, pageCountAbsensi || 1))
              //   )
              // }
            />
            of 1
          </div>
        </div>
    </>
  );
}
