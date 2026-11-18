import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Pagination from '../../../../components/Pagination'
import useDatatable from '../../../../hooks/useDatatable'
import SortIcon from '../../../../components/SortIcon'
import Form from '../../../../components/Form'
import useCRUD from '../../../../hooks/useCRUD'

export default function RekomendasiGamifyModule({ baseURL }) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/rekomendasi`

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
  } = useDatatable(API_URL)
  const { destroy } = useCRUD(API_URL)

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/rekomendasi/create`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah Point Rekomendasi
        </Button>
      </div>
      <table className="w-full border-collapse rounded-2xl overflow-hidden shadow" cellPadding={10}>
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy('kategori_id')}
              >
                No
                <SortIcon sort={getSortBy('kategori_id')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Kode</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Point</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Status</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loading && data && data.length < 1 && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada data
              </td>
            </tr>
          )}
          {!loading &&
            data &&
            data.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">{index + 1}</td>
                <td className="text-sm border-2 border-white bg-gray-50 ">{row.kode}</td>
                <td className="text-sm border-2 border-white bg-gray-50">{row.point}</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.status === 1 ? (
                    <button
                      className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 bg-green-500 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-full"
                      type="button"
                    >
                      DIGUNAKAN
                    </button>
                  ) : (
                    <button
                      className="select-none border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none rounded-full"
                      type="button"
                    >
                      TIDAK DIGUNAKAN
                    </button>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/rekomendasi/edit/${row.id}`}
                      variant="secondary"
                      icon={<Icon icon="bx:edit" width={20} height={20} />}
                    />
                    <Button.Icon
                      variant="danger"
                      icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
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
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            onClick={() => setPage(page - 1)}
            disabled={!canPrev}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
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
            onChange={event =>
              event.target.valueAsNumber <= pageCount && setPage(event.target.value)
            }
          />
          of {pageCount || 1}
        </div>
      </div>
    </>
  )
}
