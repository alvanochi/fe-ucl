import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import useMenu from '../../../../../hooks/useMenu'
import useUser from '../../../../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loading } from '../../../../../components/Loading'
import Form from '../../../../../components/Form'
import SortIcon from '../../../../../components/SortIcon'
import Button from '../../../../../components/Button'
import useNewDataTableForMainApi from '../../../../../hooks/useNewDataTableForMainApi'
import { Icon } from '@iconify-icon/react'
import axios from 'axios'

export default function RekapitulasiNilaiSidang() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { menu, setActive } = useMenu()

  const [searchValue, setSearchValue] = useState('')

  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/rekap-nilai-sidang`

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
  } = useNewDataTableForMainApi(DATA_URL, {}, searchValue)

  const exportsRekap = async () => {
    const EXPORT_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/export-nilai-sidang`
    try {
      if (user) {
        const response = await axios.get(EXPORT_URL, {
          headers: {
            token: user?.token,
          },
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))

        const filename = 'rekapitulasi_penilaian_sidang.xlsx'

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading the rekapitulasi kolokium:', error)
    }
  }

  useEffect(() => {
    if (router.isReady === false || !user) return
  }, [router, user])
  if ([user, menu].some(item => item == null)) return <Loading />
  return (
    <>
      <div className="flex mb-8 justify-end items-center mt-8">
        <div className="flex items-center mr-4"></div>

        <div className="flex-shrink mr-4">
          <Form.Input
            type="text"
            name="search"
            placeholder="Search"
            style={{ width: '400px' }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex items-center ">
          <Button.Icon
            variant="success"
            icon={<Icon icon="ri:file-excel-2-line" width={40} height={40} />}
            onClick={() => exportsRekap()}
          />
        </div>
      </div>
      <table className="w-full border-collapse rounded-2xl shadow table-auto" cellPadding={10}>
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
                onClick={() => sortByNew('npm')}
              >
                Nama
                <SortIcon sort={getSortByNew('npm')} />
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Pembimbing 1</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Pembimbing 2</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Penguji 1</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Penguji 2</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Nilai Akhir</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td colSpan="7" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loadingNew && dataNew && dataNew.length < 1 && (
            <tr>
              <td colSpan="7" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingNew &&
            dataNew &&
            dataNew?.map((row, index) => {
              const startNumber = (pageNew - 1) * 10 + 1
              const rowNumber = startNumber + index

              const pembimbing1 =
                row.penilaian_sidang?.find(nilai => nilai.peran === 'pembimbing_1') || {}
              const pembimbing2 =
                row.penilaian_sidang?.find(nilai => nilai.peran === 'pembimbing_2') || {}
              const penguji1 =
                row.penilaian_sidang?.find(nilai => nilai.peran === 'penguji_1') || {}
              const penguji2 =
                row.penilaian_sidang?.find(nilai => nilai.peran === 'penguji_2') || {}

              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">{rowNumber}</td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.nama_lengkap}
                    <span className="block font-bold">{row.npm}</span>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {pembimbing1.final_nilai || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {pembimbing2.final_nilai || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {penguji1.final_nilai || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {penguji2.final_nilai || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.nilai_akhir_sidang || '-'}
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
