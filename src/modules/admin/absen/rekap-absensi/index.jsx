import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toastAlert } from '../../../../lib/sweetalert'
import Form from '../../../../components/Form'
import useNewDataTable from '../../../../hooks/useNewDataTable'
import useDepartemen from '../../../../repo/departemen'
import useUnit from '../../../../repo/unit'

export default function RekapAbsensi({ baseURL, user }) {
  const { data: listDepartemen, isLoading: isDepartemenLoading } = useUnit()

  const options = listDepartemen?.map(departemen => ({
    value: departemen.code, // Ganti 'code' dengan properti yang sesuai dari listDepartemen
    label: departemen.code, // Ganti 'name' dengan properti yang sesuai dari listDepartemen
  }))

  const [academicYear, setAcademicYear] = useState('')
  const [departementCode, setDepartementCode] = useState('')

  const [searchValue, setSearchValue] = useState('')

  const handleYearChange = event => {
    setAcademicYear(event.target.value)
  }

  const handleDepartementChange = event => {
    setDepartementCode(event.target.value)
  }

  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL_ABSEN}/pembelajaran/list-dosen-pertemuan`
  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTable(
    DATA_URL,
    {
      filter: ['academic_year', 'departement_code'],
      filterValue: [academicYear, departementCode],
    },
    searchValue,
    {
      orderField: 'name', // Ganti dengan nama kolom yang ingin diurutkan
      orderValue: 'asc', // atau "desc"
    },
  )

  useEffect(() => {
    refreshNew()
  }, [academicYear, departementCode])

  const GENERATE_URL = `${process.env.NEXT_PUBLIC_API_URL}/absensi/persentase-dosen/excel`

  async function generate() {
    try {
      const response = await axios.get(GENERATE_URL, {
        responseType: 'blob',
      })

      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition.split('filename=')[1].replace(/"/g, '')

      const url = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toastAlert('success', 'Exported!')
    } catch (error) {
      if (error.name === 'AxiosError') {
        toastAlert('warning', error.response.data)
        return
      }
      toastAlert('error', error)
    }
  }

  return (
    <>
      <div className="mb-2">
        <div className="flex justify-end items-end">
          <Button.Icon
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => generate()}
          />
        </div>
      </div>
      <div className="flex w-full mb-8">
        <div className="flex flex-col w-1/3 mr-4">
          <Form.Label className="mb-2">Tahun Ajaran</Form.Label>
          <Form.Select
            value={academicYear}
            onChange={handleYearChange}
            options={[
              { value: '2024/2025', label: '2024/2025' },
              { value: '2023/2024', label: '2023/2024' },
              { value: '2022/2023', label: '2022/2023' },
              { value: '2021/2022', label: '2021/2022' },
              { value: '2020/2021', label: '2020/2021' },
              { value: '2018/2019', label: '2018/2019' },
              { value: '2017/2018', label: '2017/2018' },
            ]}
          />
        </div>

        <div className="flex flex-col w-1/3 mr-4">
          <Form.Label className="mb-2">Departemen</Form.Label>
          <Form.Select
            value={departementCode}
            onChange={handleDepartementChange}
            options={options}
          />
        </div>

        <div className="flex-shrink flex-col w-1/3">
          <Form.Label className="mb-2">Search</Form.Label>
          <Form.Input
            type="text"
            name="search"
            placeholder="Search"
            style={{ width: '100%' }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="my-8">
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
                <div className="flex items-center gap-2 cursor-pointer">NIDN</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">Nama</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">GASAL</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">GENAP</div>
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
              dataNew.map((row, index) => (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">{index + 1}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.nik}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    <Link href={`${baseURL}/rekap-absensi/${row.nik}`} className="text-blue-500">
                      {row.name}
                    </Link>
                  </td>
                  <td
                    className={`text-sm border-2 border-white max-w-[8rem] truncate text-center mx-auto ${
                      parseInt(row.persentase_gasal) > 70 ? 'bg-green-700' : 'bg-red-500'
                    }`}
                  >
                    <div className="flex items-stretch gap-1 text-white text-center">
                      {parseInt(row.persentase_gasal) > 100 ? '100%' : row.persentase_gasal}
                    </div>
                  </td>
                  <td
                    className={`text-sm border-2 border-white max-w-[8rem] truncate mx-auto ${
                      parseInt(row.persentase_genap) > 70 ? 'bg-green-700' : 'bg-red-500'
                    }`}
                  >
                    <div className="flex items-stretch gap-1 text-white">
                      {parseInt(row.persentase_genap) > 100 ? '100%' : row.persentase_genap}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex mt-8">
          <Button
            as="a"
            href={`${baseURL}`}
            variant="danger"
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            iconPosition="left"
            pill
          >
            Kembali
          </Button>
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
      </div>
    </>
  )
}
