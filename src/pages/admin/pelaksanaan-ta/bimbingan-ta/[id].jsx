import Card from '../../../../components/Card'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loading } from '../../../../components/Loading'
import useCRUD from '../../../../hooks/useCRUD'
import BackButton from '../../../../components/BackButton'
import useNewDataTableForMainApi from '../../../../hooks/useNewDataTableForMainApi'
import Form from '../../../../components/Form'
import SortIcon from '../../../../components/SortIcon'
import Button from '../../../../components/Button'
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import Link from 'next/link'
import moment from 'moment'

export default function BimbiganTaPerdosen() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const dataUrl = router.query.id
    ? `${process.env.NEXT_PUBLIC_API_URL}/progres-tugas-akhir/list-progres-dosen/${router.query.id}`
    : null

  const [searchValue, setSearchValue] = useState('')

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    sortByNew,
    getSortByNew,
    filterNew,
    setFilterNew,
  } = useNewDataTableForMainApi(dataUrl, {}, searchValue)

  useEffect(() => {
    if (!router.isReady || !user || !router.query.id) return
  }, [router.isReady, user, router.query.id])

  if ([user, menu, dataUrl].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader
        title={menu.label}
        icon={menu.icon}
        handler={setActive}
        leading={<BackButton />}
      />

      <Card className="mt-8">
        <Card.Header className="text-center">
          <div>Progres Bimbingan Tugas Akhir</div>
        </Card.Header>
        <div className="flex mb-8 justify-end items-center mt-4 px-4">
          <div className="flex items-center mr-4"></div>
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
          className="w-full border-collapse rounded-2xl  shadow table-auto px-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew('id')}
                >
                  No <SortIcon sort={getSortByNew('id')} />
                </div>
              </th>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">Nama</div>
              </th>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">Peran</div>
              </th>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew('count')}
                >
                  Jumlah Bimbingan
                  <SortIcon sort={getSortByNew('count')} />
                </div>
              </th>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew('last_tgl')}
                >
                  Terakhir Bimbingan
                  <SortIcon sort={getSortByNew('last_tgl')} />
                </div>
              </th>
              <th className="text-xs border-2 border-white bg-gray-200">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => sortByNew('status_kelulusan')}
                >
                  Status Kelulusan
                  <SortIcon sort={getSortByNew('status_kelulusan')} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingNew && (
              <tr>
                <td colSpan="6" className="text-xs border-2 border-white bg-gray-50 text-center">
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
                    <Link
                      href={`${prefix + menu.url}/bimbingan-ta/detail-progres/${
                        row.mhs_id
                      }/${row.id}`}
                      className="cursor-pointer text-blue-700"
                    >
                      {row.nama_lengkap}
                      <span className="block font-bold">{row.npm}</span>
                    </Link>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">{row.peran}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {row.count ? row.count : 0}
                  </td>
                  <td
                    className={`text-sm border-2 border-white text-center text-white ${
                      row.late_progres === 'hijau'
                        ? 'bg-green-500'
                        : row.late_progres === 'kuning'
                          ? 'bg-yellow-500'
                          : row.late_progres === 'merah'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
                  >
                    {row.last_tgl ? moment(row.last_tgl).local().format('DD-MM-YYYY') : '-'}
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {row.status_kelulusan == 0 || !row.status_kelulusan ? 'BELUM' : 'LULUS'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex mt-8 px-8">
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
        <Card.Body className="space-y-4"></Card.Body>
      </Card>
    </Layout>
  )
}
