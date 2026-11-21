import React, { useEffect } from 'react'
import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import Form from '../../../../../components/Form'
import Card from '../../../../../components/Card'
import { useRouter } from 'next/router'
import useUser from '../../../../../hooks/useUser'
import useMenu from '../../../../../hooks/useMenu'
import useCRUD from '../../../../../hooks/useCRUD'
import Button from '../../../../../components/Button'
import { Loading } from '../../../../../components/Loading'
import { useJenisDokumen } from '../../../../../repo/master-penelitian'

const DokumenEdit = () => {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/detailDokumen`
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/dokumen-penelitian`

  const INITIAL_FORM = {
    penelitian_id: '',
    dokumen_id: '',
    jenis_dokumen_id: '',
    nama_dok: '',
    keterangan: '',
    tautan_dok: '',
    file: '',
  }

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: 'jenis_dokumen_id', label: 'Jenis Dokumen' },
      { field: 'nama_dok', label: 'Nama Dokumen' },
      { field: 'keterangan', label: 'Keterangan' },
    ],
    success: () =>
      router.push(
        form.penelitian_id
          ? `${prefix + menu.url}/penelitian/edit/${form.penelitian_id}`
          : prefix + menu.url,
      ),
  })

  const { form, inputHandler, setForm } = formdata
  const { data: listJenisDokumen, isLoading: isLoadingJenisDokumen } = useJenisDokumen([user])

  const EDIT_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/editDokumen`
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.dokumen_id}`,
    method: 'PATCH',
  }

  useEffect(() => {
    if (router.isReady === false || !user || !router.query.id) return

    show(router.query.id, {
      transformData: res => {
        const data = res?.data || res || {}
        return {
          ...INITIAL_FORM,
          ...data,
          jenis_dokumen_id: data.jenis_dokumen_id || '',
        }
      },
    })
  }, [router.isReady, router.query.id, user])

  if ([user, menu].some(item => item == null)) return <Loading />

  const jenisDokumenOptions = (listJenisDokumen || []).map(item => ({
    label: item.nama_jenis_dokumen || item.nama || item.label,
    value: item.jenis_dokumen_id || item.id,
  }))

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={event => submitHandler(event, EDIT_OPTION)} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Dokumen Penelitian</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="jenis_dokumen_id"
                  value={form.jenis_dokumen_id}
                  options={jenisDokumenOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      jenis_dokumen_id: selected?.value || '',
                    }))
                  }}
                  placeholder={
                    isLoadingJenisDokumen
                      ? 'Memuat jenis dokumen...'
                      : '-- Pilih Jenis Dokumen --'
                  }
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_dok"
                value={form.nama_dok || ''}
                onChange={inputHandler}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Keterangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="keterangan"
                value={form.keterangan || ''}
                onChange={inputHandler}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Tautan Dokumen</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tautan_dok"
                value={form.tautan_dok || ''}
                onChange={inputHandler}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">File</Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="file"
                  onChange={inputHandler}
                />
                <small className="text-gray-500 block">
                  Biarkan kosong jika tidak ingin mengganti berkas yang sudah ada.
                </small>
                {typeof form.file === 'string' && form.file !== '' && (
                  <embed src={`${FILE_URL}/${form.file}`} className="w-full h-[256px]" />
                )}
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={`${prefix + menu.url}/penelitian/edit/${form.penelitian_id}`}
            variant="secondary"
            className="w-full h-12"
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>
    </Layout>
  )
}

export default DokumenEdit