import useMenu from '../../../../hooks/useMenu'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useUser from '../../../../hooks/useUser'
import { Loading } from '../../../../components/Loading'
import { useState } from 'react'
import useNewDataTableNew from '../../../../hooks/useNewDataTableNew'
import useCRUD from '../../../../hooks/useCRUD'
import Form from '../../../../components/Form'
import Button from '../../../../components/Button'
import { Icon } from '@iconify-icon/react'
import CreateKelompokBidang from './create'
import EditKelompokBidang from './edit'

export default function KelompokBidangPage() {
  const { user } = useUser({ redirectTo: '/login' })
  const { menu, active, setActive } = useMenu()
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/kelompok-bidang`
  const [searchValue, setSearchValue] = useState('')

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
  } = useNewDataTableNew(DATA_URL, {}, searchValue)

  const { destroy } = useCRUD(DATA_URL)

  const handleAction = () => {
    refreshNew()
  }

  if ([user, menu].some(item => item == null)) return <Loading />

  return (
    <Layout>
      <PageHeader
        title="Master Kelompok Bidang"
        icon="material-symbols:edit-document-outline-rounded"
        handler={setActive}
      />
      <div className="my-8">
        <div className="flex mb-8 justify-between items-center">
          <CreateKelompokBidang onAction={handleAction} />
          <div className="flex-shrink">
            <Form.Input
              type="text"
              name="search"
              placeholder="Cari Kelompok Bidang..."
              style={{ width: '350px' }}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto" cellPadding={10}>
          <thead>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200 w-16 text-center">No</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-left">Nama Kelompok Bidang</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-36">Kategori IPTEK</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loadingNew ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">Memuat data...</td>
              </tr>
            ) : dataNew && dataNew.length > 0 ? (
              dataNew.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {(pageNew - 1) * 10 + index + 1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 font-medium">{item.nama}</td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.is_iptek ? (
                      <span className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full font-semibold">IPTEK</span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Non-IPTEK</span>
                    )}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <EditKelompokBidang item={item} onAction={handleAction} />
                      <Button.Icon
                        type="button"
                        variant="danger"
                        icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                        onClick={() => destroy(item.id).then(() => handleAction())}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">Tidak ada data ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>

        {pageCountNew > 1 && (
          <div className="flex mt-8 items-center justify-between">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm text-gray-600">Halaman</span>
              <Form.Input
                type="number"
                min="1"
                max={pageCountNew || 1}
                value={pageNew}
                onChange={e => setPageNew(Math.max(1, Math.min(pageCountNew, Number(e.target.value))))}
                className="w-16 text-center text-sm"
              />
              <span className="text-sm text-gray-600">dari {pageCountNew || 1}</span>
            </div>
            <div className="flex gap-2">
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
                Halaman Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
