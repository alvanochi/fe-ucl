import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Form from '../../../../components/Form'
import { useState } from 'react'
import useNewDataTableForMainApi from '../../../../hooks/useNewDataTableForMainApi'
import SortIcon from '../../../../components/SortIcon'

export default function MahasiswaExtModule({ baseURL }) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/all-mhs-beasiswa`
  const [searchValue, setSearchValue] = useState('')

  const initialSortField = 'code'
  const initialSortOrder = 'desc'

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    sortByNew,
    getSortByNew,
    refreshNew,
    filterNew,
    setFilterNew,
  } = useNewDataTableForMainApi(API_URL, {}, searchValue, initialSortField, initialSortOrder)

  return (
    <>
      <div className="flex items-center justify-end my-8 w-full ">
        <Form.Input
          type="text"
          name="search"
          placeholder="Search"
          style={{ width: '400px' }}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
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
                onClick={() => sortByNew('code')}
              >
                No <SortIcon sort={getSortByNew('code')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('funding_scheme')}
              >
                Beasiswa <SortIcon sort={getSortByNew('funding_scheme')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('code')}
              >
                NPM <SortIcon sort={getSortByNew('code')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('name')}
              >
                Nama
                <SortIcon sort={getSortByNew('name')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('sex')}
              >
                Sex
                <SortIcon sort={getSortByNew('sex')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('phone')}
              >
                Phone
                <SortIcon sort={getSortByNew('phone')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('departement_code')}
              >
                Departement
                <SortIcon sort={getSortByNew('departement_code')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => sortByNew('class')}
              >
                Kelas
                <SortIcon sort={getSortByNew('class')} />
              </div>
            </th>
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
              const startNumber = (pageNew - 1) * 10 + 1

              const rowNumber = startNumber + index
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">{rowNumber}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.funding_scheme}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.code}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.name}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.sex}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.phone}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.department_code}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.class}</td>
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
