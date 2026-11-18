import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Form from '../../../../components/Form'
import useCRUD from '../../../../hooks/useCRUD'
import useNewDataTableNew from '../../../../hooks/useNewDataTableNew'
import { useState } from 'react'
import SortIcon from '../../../../components/SortIcon'
import date from '../../../../utils/date'

export default function LaporanModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/laporan`
  const [searchValue, setSearchValue] = useState('')

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTableNew(DATA_URL, {}, searchValue)

  const { destroy } = useCRUD(DATA_URL)

  const handleAction = () => {
    refreshNew()
  }

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">{/* <CreateKategoriLaporan onAction={handleAction} /> */}</div>
        <div className="flex-shrink">
          <Form.Input
            type="text"
            name="search"
            placeholder="Search"
            style={{ width: '400px' }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
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
                onClick={() => sortByNew('id')}
              >
                No <SortIcon sort={getSortByNew('id')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('code')}
              >
                NPM
                <SortIcon sort={getSortByNew('code')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Kontak</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('created_at')}
              >
                Tanggal
                <SortIcon sort={getSortByNew('created_at')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('deskripsi')}
              >
                Deskripsi
                <SortIcon sort={getSortByNew('deskripsi')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('status')}
              >
                Status
                <SortIcon sort={getSortByNew('status')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Foto</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loadingNew && dataNew && dataNew.length < 1 && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingNew &&
            dataNew &&
            dataNew.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">{index + 1}</td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.nama}
                  <span className="block font-bold">{row.code}</span>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.user?.email}
                  <span className="block font-bold">{row.user?.personal_data?.no_hp}</span>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {date.formatIdWithTime(new Date(row.created_at))}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {`${row.deskripsi.split(' ').slice(0, 6).join(' ')}${
                    row.deskripsi.split(' ').length > 6 ? '...' : ''
                  }`}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.status == 0 ? 'MULAI' : 'SELESAI'}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  <img src={row.foto} alt="dokumentasi" width={80} height={80} />
                </td>

                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/${row.id}`}
                      variant="info"
                      icon={
                        <Icon icon="icon-park-outline:view-grid-detail" width={20} height={20} />
                      }
                    />

                    <Button.Icon
                      variant="danger"
                      icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                      onClick={() => destroy(row.id).then(() => refreshNew())}
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
            onClick={() => setPageNew(pageNew - 1)}
            disabled={pageNew <= 1}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
            iconPosition="right"
            onClick={() => setPageNew(pageNew + 1)}
            disabled={pageNew >= pageCountNew}
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
            max={pageCountNew || 1}
            className="w-20"
            value={pageNew}
            onChange={event =>
              setPageNew(Math.max(1, Math.min(event.target.valueAsNumber, pageCountNew || 1)))
            }
          />
          of {pageCountNew || 1}
        </div>
      </div>
    </>
  )
}
