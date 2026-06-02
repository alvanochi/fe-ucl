import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Pagination from '../../../../components/Pagination'
import Filter from './filter'
import useDatatable from '../../../../hooks/useDatatable'
import SortIcon from '../../../../components/SortIcon'
import Form from '../../../../components/Form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useNewDataTableNew from '../../../../hooks/useNewDataTableNew'

export default function DosenModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/list-users`
  const [searchValue, setSearchValue] = useState('')

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    recordsTotalNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTableNew(
    DATA_URL,
    {
      filter: ['role'],
      filterValue: ['Dosen'],
    },
    searchValue,
    'user_id',
  )

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <div>
          <span>
            Total Data: <b>{recordsTotalNew}</b>
          </span>
        </div>
        <div>
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
                onClick={() => sortByNew('created_at')}
              >
                No
                <SortIcon sort={getSortByNew('created_at')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('created_at')}
              >
                NIDN | NIP
                <SortIcon sort={getSortByNew('nidn')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nama</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Email</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('department_code')}
              >
                Departemen
                <SortIcon sort={getSortByNew('department_code')} />
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
            dataNew.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">{index + 1}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    <p>NIDN: {row.nidn}</p>
                    <p className="pt-2">NIP: {row.personal_data?.nip}</p>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.personal_data?.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.email}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.department_code}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/detail-dosen/${row.user_id}`, '_blank')
                        }
                        variant="info"
                        icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
                      />
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/change-password/${row.user_id}`, '_blank')
                        }
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
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
