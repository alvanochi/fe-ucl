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
import CreateKolaboratorEksternal from './create'
import EditKolaboratorEksternal from './edit'

export default function KolaboratorEksternalPage() {
  const { user } = useUser({ redirectTo: '/login' })
  const { menu, active, setActive } = useMenu()
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/kolabExt`
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
        title="Master Kolaborator Eksternal"
        icon="material-symbols:edit-document-outline-rounded"
        handler={setActive}
      />
      <div className="my-8">
        <div className="flex mb-8 justify-between items-center">
          <CreateKolaboratorEksternal onAction={handleAction} />
          <div className="flex-shrink">
            <Form.Input
              type="text"
              name="search"
              placeholder="Cari Kolaborator..."
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
              <th className="text-sm border-2 border-white bg-gray-200 text-left">Nama Lengkap</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-40">Negara & Jenkel</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-44">NIK / No. Identitas</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-left w-52">Email & No. HP</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loadingNew ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">Memuat data...</td>
              </tr>
            ) : dataNew && dataNew.length > 0 ? (
              dataNew.map((item, index) => {
                const extId = item.id || item.ext_id || item.kolab_id
                return (
                  <tr key={extId || index} className="hover:bg-gray-50">
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      {(pageNew - 1) * 10 + index + 1}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 font-medium">
                      <div>{item.nama}</div>
                      {item.desa_kelurahan || item.kota_kabupaten ? (
                        <div className="text-xs text-gray-500">
                          {[item.desa_kelurahan, item.kota_kabupaten, item.provinsi].filter(Boolean).join(', ')}
                        </div>
                      ) : null}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <span className="font-semibold text-gray-700">{item.negara || '-'}</span>
                      <div className="text-xs text-gray-500">{item.jenkel || item.jenis_kelamin || '-'}</div>
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center font-mono text-gray-700">
                      {item.nik || '-'}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <div className="text-gray-800">{item.email || '-'}</div>
                      <div className="text-xs text-gray-500">{item.no_hp || '-'}</div>
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <EditKolaboratorEksternal item={item} onAction={handleAction} />
                        <Button.Icon
                          type="button"
                          variant="danger"
                          icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                          onClick={() => destroy(extId).then(() => handleAction())}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">Tidak ada data ditemukan.</td>
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
