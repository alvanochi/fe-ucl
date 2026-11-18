import { Icon } from '@iconify-icon/react'
import Button from '../../../components/Button'
import Pagination from '../../../components/Pagination'
import Filter from './filter'
import useDatatable from '../../../hooks/useDatatable'
import useCRUD from '../../../hooks/useCRUD'
import SortIcon from '../../../components/SortIcon'

export default function BimbinganModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/pendidikan/bimbingan/get`
  const DELETE_URL = `${process.env.NEXT_PUBLIC_API_URL}/pendidikan/bimbingan/delete`

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
  } = useDatatable(DATA_URL)
  const { destroy } = useCRUD(DELETE_URL)

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button
          onClick={() => window.open(`${`${baseURL}/bimbingan/create`}`, '_blank')}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Tambah Bimbingan
        </Button>
        <Filter filter={filter} handler={setFilter} />
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
                onClick={() => sortBy('bimbingan_id')}
              >
                No
                <SortIcon sort={getSortBy('bimbingan_id')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Status</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy('semester')}
              >
                Semester
                <SortIcon sort={getSortBy('semester')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy('judul_bimbingan')}
              >
                Judul Kegiatan
                <SortIcon sort={getSortBy('judul_bimbingan')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy('jenis_bimbingan')}
              >
                Jenis Bimbingan
                <SortIcon sort={getSortBy('jenis_bimbingan')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortBy('program_studi')}
              >
                Program Studi
                <SortIcon sort={getSortBy('program_studi')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">Action</th>
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
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[12rem] truncate">
                  {row.status == 0 && (
                    <span className="text-base font-bold text-yellow-400">Proses</span>
                  )}
                  {row.status == 1 && (
                    <span className="text-base font-bold text-green-400">Diterima</span>
                  )}
                  {row.status == 2 && (
                    <span className="text-base font-bold text-red-400">Ditolak</span>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  <p className="truncate">{row.semester}</p>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.judul_bimbingan}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.jenis_bimbingan}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate">
                  {row.program_studi}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.status == 1 ? (
                    ''
                  ) : (
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/bimbingan/detail/${row.bimbingan_id}`, '_blank')
                        }
                        variant="info"
                        icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
                      />
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/bimbingan/edit/${row.bimbingan_id}`, '_blank')
                        }
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                      <Button.Icon
                        variant="danger"
                        icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                        onClick={() => destroy(row.bimbingan_id).then(() => refresh())}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        current={page}
        handler={setPage}
        max={pageCount}
        canPrev={canPrev()}
        canNext={canNext()}
        className="mt-8"
      />
    </>
  )
}
