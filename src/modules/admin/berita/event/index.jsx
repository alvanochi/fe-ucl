import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Filter from "./filter";
import useDatatable from "../../../../hooks/useDatatable";
import SortIcon from "../../../../components/SortIcon";
import Form from "../../../../components/Form";
import ChangeStatus from "../changeStatus";
import useCRUD from "../../../../hooks/useCRUD";

export default function EventModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/berita/event`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/berita`;
  const FILE_URL = `${process.env.API_ENDPOINT}/berita/pamflet`;

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

  const handleStatusChange = () => {
    refresh();
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8">
        <Button
          onClick={() => window.open(`${`${baseURL}/event/create`}`,'_blank')}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah Event
        </Button>
        <Filter />
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
                Title
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Deskripsi
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Pamflet
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
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
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.title}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {`${row.deskripsi.split(" ").slice(0, 5).join(" ")}${
                    row.deskripsi.split(" ").length > 5 ? "..." : ""
                  }`}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.status === 0 ? (
                    <h5 className="text-green-500 font-bold">ACTIVE</h5>
                  ) : (
                    <h5 className="text-red-500 font-bold">NON ACTIVE</h5>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  <img
                    src={`${FILE_URL}/${row.pamflet}`}
                    alt="pamflet"
                    className="w-2/3 h-[140px]"
                  />
                </td>

                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <ChangeStatus
                      id={{ id: row.id }}
                      status={{ status: row.status }}
                      onStatusChange={handleStatusChange}
                    />
                    <Button.Icon
                      onClick={() => window.open(`${`${baseURL}/${row.id}`}`,'_blank')}
                      variant="secondary"
                      icon={<Icon icon="bx:edit" width={20} height={20} />}
                    />
                    <Button.Icon
                      variant="danger"
                      icon={
                        <Icon
                          icon="solar:trash-bin-2-bold-duotone"
                          width={20}
                          height={20}
                        />
                      }
                      onClick={() => destroy(row.id).then(() => refresh())}
                    />
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
    </>
  );
}
