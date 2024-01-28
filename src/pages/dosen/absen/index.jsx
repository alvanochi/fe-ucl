import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import _ from "underscore";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import SortIcon from "../../../components/SortIcon";
import { Icon } from "@iconify-icon/react";


export default function Absen() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();
	
	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title="Tias Absensi" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
					<Button
						as="a"
						href={`${prefix + menu.url}/generate`}
						variant="primary"
						icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
						pill
					>
						Generate QRCODE
					</Button>
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
                Pertemuan
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kelas
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Hari/Jam
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Ruangan
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              1
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Verifikasi dan Validasi Perangkat Lunak
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              1
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              REGULER_D
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Offline
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Kamis/13.00-14.40
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              307
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                <Button.Icon
                  as="a"
                  variant="primary"
                  icon={<Icon icon="bx:group" width={20} height={20} />}
                />
                <Button.Icon
                  as="a"
                  variant="secondary"
                  icon={<Icon icon="bx:edit" width={20} height={20} />}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              2
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Interaksi Manusia dan Komputer
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              1
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              REGULER_B
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Offline
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Jumat/09.40-11.20
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              301
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                <Button.Icon
                  as="a"
                  variant="primary"
                  icon={<Icon icon="bx:group" width={20} height={20} />}
                />
                <Button.Icon
                  as="a"
                  variant="secondary"
                  icon={<Icon icon="bx:edit" width={20} height={20} />}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              3
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Verifikasi dan Validasi Perangkat Lunak
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              2
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              REGULER_D
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Offline
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Kamis/13.00-14.40
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              307
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              <div className="flex items-stretch gap-1">
                <Button.Icon
                  as="a"
                  variant="primary"
                  icon={<Icon icon="bx:group" width={20} height={20} />}
                />
                <Button.Icon
                  as="a"
                  variant="secondary"
                  icon={<Icon icon="bx:edit" width={20} height={20} />}
                />
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
            icon={
              <Icon
                icon="material-symbols:chevron-left"
                width={20}
                height={20}
              />
            }
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={
              <Icon
                icon="material-symbols:chevron-right"
                width={20}
                height={20}
              />
            }
            iconPosition="right"
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
            className="w-20"
            value="1"
          />
          1
        </div>
      </div>
			</div>
			
		</Layout>
	);
}