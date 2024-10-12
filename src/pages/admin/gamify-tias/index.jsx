import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import useForm from "../../../hooks/useForm";
import { toastAlert } from "../../../lib/sweetalert";
import { useRouter } from "next/router";
import axios from "axios";
import _ from "underscore";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import SortIcon from "../../../components/SortIcon";
import { Icon } from "@iconify-icon/react";
import { Loading } from "../../../components/Loading";

export default function GamifyTias() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/achievments`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/achievments`;
  const FILE_URL = `${process.env.API_ENDPOINT}/gamify`;
  const FILE_URL_LENCANA = `${process.env.API_ENDPOINT}/gamify/lencana`;

  const {
    data,
    loading,
    page,
    pageCount,
    filter,
    setPage,
    setFilter,
    canPrev,
    canNext,
    refresh,
    sortBy,
    getSortBy,
  } = useDatatable(DATA_URL);
  const { destroy } = useCRUD(DELETE_URL);

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title="UCL Gamify"
        icon={menu.icon}
        items={menu.submenus}
        handler={setActive}
      />
      <div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
          <Button
            as="a"
            href={`${prefix + menu.url}/create`}
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Tambah Gamify
          </Button>
        </div>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">No</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Kode
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Name
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Gamify
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Point
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Lencana
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Image
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="6"
                  className="text-sm border-2 border-white bg-gray-50 text-center"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && data && data.length < 1 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-sm border-2 border-white bg-gray-50 text-center"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
            {!loading &&
              data &&
              data.map((row, index) => (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {index + 1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    {row.kode}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    {row.name}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    {row.gamify}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    {row.points}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <img
                      src={`${FILE_URL_LENCANA}/${row.lencana}`}
                      alt="gamify"
                      width={80}
                      height={80}
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <img
                      src={`${FILE_URL}/${row.image}`}
                      alt="gamify"
                      width={80}
                      height={80}
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        as="a"
                        href={`${prefix + menu.url}/edit/${row.id}`}
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                      {/* <Button.Icon
											variant="danger"
											icon={
												<Icon
													icon="solar:trash-bin-2-bold-duotone"
													width={20}
													height={20}
												/>
											}
											onClick={() => destroy(row.id).then(() => refresh())}
										/> */}
                    </div>
                  </td>
                </tr>
              ))}
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
              onClick={() => setPage(page - 1)}
              disabled={!canPrev}
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
              onClick={() => setPage(page + 1)}
              disabled={!canNext}
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
              max={pageCount}
              className="w-20"
              value={page}
              onChange={(event) =>
                event.target.valueAsNumber <= pageCount &&
                setPage(event.target.value)
              }
            />
            of {pageCount || 1}
          </div>
        </div>
      </div>
    </Layout>
  );
}
