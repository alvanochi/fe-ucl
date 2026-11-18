import { useRouter } from 'next/router'
import Button from '../../../../../components/Button'
import Card from '../../../../../components/Card'
import Form from '../../../../../components/Form'
import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import useMenu from '../../../../../hooks/useMenu'
import useUser from '../../../../../hooks/useUser'
import useCRUD from '../../../../../hooks/useCRUD'
import { useEffect } from 'react'
import { Loading } from '../../../../../components/Loading'

export default function DetailKategoriRekomendasi() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/rekomendasi`

  const INITIAL_FORM = {
    id: '',
    kode: '',
    point: '',
    status: 0,
  }

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: 'id', label: 'id' },
      { field: 'kode', label: 'Kode' },
      { field: 'point', label: 'Point' },
      { field: 'status', label: 'status' },
    ],
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  const EDIT_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/rekomendasi`
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: 'PATCH' }

  useEffect(() => {
    if (router.isReady === false || !user) return
    show(router.query.id, { transformData: data => ({ ...data }) })
  }, [router, user])

  if ([user, menu, form].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={event => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Point Rekomendasi</Card.Header>
          <Card.Body className="space-y-4">
            <span>
              <b>Catatan:</b> DIGUNAKAN berarti bahwa poin tersebut telah diterapkan didalam
              gamifikasi untuk memberikan setiap rekomendasi sesuai dengan poin yang dimanfaatkan.
              TIDAK DIGUNAKAN menunjukkan bahwa poin tersebut tidak diterapkan dalam memberikan poin
              dalam gamifikasi. Penting untuk dicatat bahwa dari semua data poin,{' '}
              <b>HANYA BOLEH ADA 1 DATA POIN YANG DIGUNAKAN!</b>
            </span>
            <hr />
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kode
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kode"
                value={form.kode}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Point <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="point"
                value={form.point}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status"
                    value={0}
                    onChange={inputHandler}
                    checked={form.status == 0}
                  />
                  TIDAK DIGUNAKAN
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status"
                    value={1}
                    onChange={inputHandler}
                    checked={form.status == 1}
                  />
                  DIGUNAKAN
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
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
