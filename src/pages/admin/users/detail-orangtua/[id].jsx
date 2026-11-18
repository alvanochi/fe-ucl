import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import { Loading } from '../../../../components/Loading'
import { toastAlert } from '../../../../lib/sweetalert'

export default function DetailOrangTua() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()
  const { id } = router.query

  const [loadingData, setLoadingData] = useState(true)
  const [parentData, setParentData] = useState({
    nama_lengkap: '',
    email: '',
    nik: '',
    npm: '',
    no_hp: '',
    is_verified: false,
  })

  useEffect(() => {
    if (!router.isReady || !user || !id) return

    const fetchDetail = async () => {
      try {
        const DETAIL_URL = `${process.env.NEXT_PUBLIC_API_URL}/parents/admin/detail/${id}`
        const response = await axios.get(DETAIL_URL)
        const resData = response.data.data
        setParentData({
          nama_lengkap: resData.nama_lengkap || '',
          email: resData.email || '',
          nik: resData.nik || '',
          npm: resData.npm || '',
          no_hp: resData.no_hp || '',
          is_verified: resData.is_verified ?? false,
        })
        setLoadingData(false)
      } catch (error) {
        setLoadingData(false)
        if (error.name === 'AxiosError' && error.response) {
          toastAlert('error', error.response.data.message || 'Gagal memuat detail orang tua!')
        } else {
          toastAlert('error', 'Gagal memuat detail orang tua!')
        }
      }
    }

    fetchDetail()
  }, [router.isReady, user, id])

  if ([user, menu].some(item => item == null) || loadingData) return <Loading />

  return (
    <Layout>
      <PageHeader title={`Detail Orang Tua`} icon={menu.icon} handler={setActive} />
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Detail Orang Tua</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Lengkap
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_lengkap"
                value={parentData.nama_lengkap}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Email
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="email"
                className="flex-1"
                name="email"
                value={parentData.email}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                NIK
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nik"
                value={parentData.nik}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                NPM (Mahasiswa)
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="npm"
                value={parentData.npm}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                No. HP
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_hp"
                value={parentData.no_hp}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status Verifikasi
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="is_verified"
                    value="true"
                    checked={parentData.is_verified === true}
                    disabled
                  />
                  Verified
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="is_verified"
                    value="false"
                    checked={parentData.is_verified === false}
                    disabled
                  />
                  Belum Verifikasi
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  )
}
