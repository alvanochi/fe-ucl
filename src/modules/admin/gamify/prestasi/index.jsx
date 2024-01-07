import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import Filter from "./filter";
import useDatatable from "../../../../hooks/useDatatable";
import SortIcon from "../../../../components/SortIcon";
import Form from "../../../../components/Form";
import useCRUD from "../../../../hooks/useCRUD";

export default function PrestasiGamifyModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/kategori/prestasi`;

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
  const { destroy } = useCRUD(DATA_URL);

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
      <Button
          as="a"
          href={`${baseURL}/prestasi/create`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah Kategori Prestasi
        </Button>
        <Filter filter={filter} handler={setFilter} />
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy("kategori_id")}
              >
                No
                <SortIcon sort={getSortBy("kategori_id")} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Kode
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Nama Kategori
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Juara
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Point
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
                  {row.kode}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.nama_kategori}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.juara}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.point}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                      <Button.Icon
                        as="a"
                        href={`${baseURL}/prestasi/edit/${row.id}`}
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
                        onClick={() =>
                          destroy(row.id).then(() => refresh())
                        }
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
