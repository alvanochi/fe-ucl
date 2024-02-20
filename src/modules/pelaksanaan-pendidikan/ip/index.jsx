import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import SortIcon from "../../../components/SortIcon";
import Form from "../../../components/Form";

export default function IPModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/ipMhs/getDataIp`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/ipMhs/delete`;

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
    totalData
  } = useDatatable(DATA_URL);
  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        {/* <Button
          as="a"
          href={`${baseURL}/ip/create`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah
        </Button> */}
        <Filter filter={filter} handler={setFilter} />
      </div>
      <div className="flex items-start">
        <span>Total Data: <b>{totalData}</b></span>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
              >
                No
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
              >
                Semester
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
              >
                Tahun
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
              >
                [IPS]
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
              >
                Point
              </div>
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
            data.map((row, index) => {
              const startNumber = (page - 1) * 10 + 1;

              const rowNumber = startNumber + index;
            return (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  <p className="truncate">{row.semester}</p>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.tahun}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[4rem] truncate mx-auto">
                  {row.ip}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[4rem] truncate mx-auto">
                  {row.point}
                </td>
              </tr>
            );
            })}
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
