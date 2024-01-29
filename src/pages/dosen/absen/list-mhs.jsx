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
import ShowQr from "./show-qr";
import ModalAbsen from "../../../components/ModalAbsen";
import TambahMhs from "./tambah-mhs";


export default function ListMhs() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();
	
	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title="Interaksi Manusia dan Komputer" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<div className="my-8">
			<div className="flex items-center justify-center gap-2 mb-8 mt-8">
          <TambahMhs />
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
                Nama
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                NPM
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              1
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              M Ajis Pratama
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              201106040469
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              2
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Tamam Mulya
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              201106040488
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              3
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Wahyu ramdhan
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              201106040477
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              4
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Kurniawan
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              201106040499
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">
              5
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              Vina Oktaviani
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
              201106040487
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex mt-8">
        <Button
            as="a"
            href={`${prefix + menu.url}`}
            variant="danger"
            icon={
              <Icon
                icon="material-symbols:chevron-left"
                width={20}
                height={20}
              />
            }
            iconPosition="left"
            pill
          >
            Kembali
          </Button>
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