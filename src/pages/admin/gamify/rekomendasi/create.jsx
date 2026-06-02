import { useRouter } from 'next/router'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import useCRUD from '../../../../hooks/useCRUD'
import { Loading } from '../../../../components/Loading'

export default function RekomendasiGamifyCreate() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/rekomendasi`
  const INITIAL_FORM = {
    kode: '',
    point: '',
  }

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  if ([user, menu].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Tambah Point Rekomendasi</Card.Header>
          <Card.Body className="space-y-4">
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
