import useMenu from '../../../../hooks/useMenu'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import Form from '../../../../components/Form'
import Button from '../../../../components/Button'
import useUser from '../../../../hooks/useUser'
import _ from 'underscore'
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/router'
import useCRUD from '../../../../hooks/useCRUD'
import { useEffect, useState } from 'react'
import axios from 'axios'
import InvitePesertaDosen from './invite'
import InvitePesertaMhs from './inviteMhs'
import { Loading } from '../../../../components/Loading'
import useNewDataTableForUserMeet from '../../../../hooks/useNewDataTableForUserMeet'

export default function Invite() {
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const router = useRouter()

  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/meet/meeting-invite`
  const DELETE_URL = `${process.env.NEXT_PUBLIC_API_URL_ABSEN}/meeting-invite/delete`
  const id = router.query.id

  const [searchValue, setSearchValue] = useState('')

  const { data, loading, page, pageCount, setPage, sortBy, getSortBy, refresh, itemsPerPage } =
    useNewDataTableForUserMeet(
      DATA_URL,
      {
        filter: ['id_meeting'],
        filterValue: [id],
      },
      searchValue,
    )

  const { destroy } = useCRUD(DELETE_URL)

  const handleInvite = () => {
    refresh()
  }

  if ([user, menu, loading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={`Peserta Kegiatan yang Diundang`} icon={menu.icon} handler={setActive} />

      <div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
          <InvitePesertaDosen data={{ id: id }} onInvite={handleInvite} />
          <InvitePesertaMhs data={{ id: id }} onInvite={handleInvite} />
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
                <div className="flex items-center gap-2 cursor-pointer">No</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">Nama</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">NPM/NIK</div>
              </th>
              {/* <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Action
                </div>
              </th> */}
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
              data.map((row, index) => {
                const startNumber = (page - 1) * 10 + 1

                // Tampilkan nomor urut sesuai dengan halaman aktif
                const rowNumber = startNumber + index
                return (
                  <tr key={`row-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">{rowNumber}</td>
                    <td className="text-sm border-2 border-white bg-gray-50">{row.code}</td>
                    <td className="text-sm border-2 border-white bg-gray-50">{row.nama}</td>
                    {/* <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                      <div className="flex items-stretch gap-1">
                        <Button.Icon
                          variant="danger"
                          icon={
                            <Icon
                              icon="solar:trash-bin-2-bold-duotone"
                              width={20}
                              height={20}
                            />
                          }
                          onClick={() => destroy(row.id).then(() => refresh())}
                        />
                      </div>
                    </td> */}
                  </tr>
                )
              })}
          </tbody>
        </table>

        <div className="flex mt-8">
          <Button
            as="a"
            href={`${prefix + menu.url}`}
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
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              pill
            />
            <Button
              type="button"
              variant="primary"
              icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
              iconPosition="right"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
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
              max={pageCount || 1}
              className="w-20"
              value={page}
              onChange={event =>
                setPage(Math.max(1, Math.min(event.target.valueAsNumber, pageCount || 1)))
              }
            />
            of {pageCount || 1}
          </div>
        </div>
      </div>
    </Layout>
  )
}
