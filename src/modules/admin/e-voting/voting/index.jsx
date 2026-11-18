import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import date from '../../../../utils/date'
import Form from '../../../../components/Form'
import useCRUD from '../../../../hooks/useCRUD'
import { useState } from 'react'
import SortIcon from '../../../../components/SortIcon'
import useNewDataTableNew from '../../../../hooks/useNewDataTableNew'

export default function VotingModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/voting/question-all`
  const DELETE_URL = `${process.env.NEXT_PUBLIC_API_URL}/voting/question`
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

  const { destroy } = useCRUD(DELETE_URL)

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <Button
            onClick={() => window.open(`${`${baseURL}/create`}`, '_blank')}
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Create Vote
          </Button>
        </div>
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
                onClick={() => sortByNew('deskripsi')}
              >
                deskripsi
                <SortIcon sort={getSortByNew('deskripsi')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('status_pertanyaan')}
              >
                status
                <SortIcon sort={getSortByNew('status_pertanyaan')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('created_at')}
              >
                Tanggal Dibuat
                <SortIcon sort={getSortByNew('created_at')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
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
                  {`${row.deskripsi.split(' ').slice(0, 5).join(' ')}${
                    row.deskripsi.split(' ').length > 5 ? '...' : ''
                  }`}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.status_pertanyaan === 1 ? (
                    <h5 className="text-green-500 font-bold">ACTIVE</h5>
                  ) : (
                    <h5 className="text-red-500 font-bold">NON ACTIVE</h5>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {date.formatToID(new Date(row.created_at))}
                </td>

                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/detail-question/${row.id}`}
                      variant="info"
                      icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
                    />
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/edit-question/${row.id}`}
                      variant="secondary"
                      icon={<Icon icon="bx:edit" width={20} height={20} />}
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
