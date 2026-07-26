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

export default function EditOrangTua() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()
  const { id } = router.query

  const [loadingData, setLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentData, setParentData] = useState({
    nama_lengkap: '',
    email: '',
    npm: '',
    no_hp: '',
    is_verified: false,
    password: '',
    confirmPassword: '',
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
          npm: resData.npm || '',
          no_hp: resData.no_hp || '',
          is_verified: resData.is_verified ?? false,
          password: '',
          confirmPassword: '',
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

  const inputHandler = (e) => {
    const { name, value } = e.target
    setParentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRadioChange = (val) => {
    setParentData(prev => ({
      ...prev,
      is_verified: val
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validasi kecocokan password jika diisi
    if (parentData.password) {
      if (parentData.password !== parentData.confirmPassword) {
        return toastAlert('error', 'Konfirmasi password baru tidak sesuai!')
      }
    }

    setIsSubmitting(true)
    try {
      const UPDATE_URL = `${process.env.NEXT_PUBLIC_API_URL}/parents/admin/update/${id}`
      const payload = { ...parentData }
      
      // Hapus confirmPassword agar tidak dikirim ke API
      delete payload.confirmPassword

      // Jika password tidak diisi, hapus dari payload agar tidak mengubah password lama
      if (!payload.password) {
        delete payload.password
      }
      
      const response = await axios.put(UPDATE_URL, payload)
      toastAlert('success', response.data.message || 'Berhasil memperbarui data orang tua!', 2000)
      router.push(prefix + menu.url)
    } catch (error) {
      setIsSubmitting(false)
      if (error.name === 'AxiosError' && error.response) {
        toastAlert('error', error.response.data.message || 'Gagal memperbarui data orang tua!')
      } else {
        toastAlert('error', 'Gagal memperbarui data orang tua!')
      }
    }
  }

  if ([user, menu].some(item => item == null) || loadingData) return <Loading />

  return (
    <Layout>
      <PageHeader title={`Edit Orang Tua`} icon={menu.icon} handler={setActive} />
      <Form onSubmit={handleSubmit}>
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Orang Tua</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Lengkap<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_lengkap"
                value={parentData.nama_lengkap}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Email<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="email"
                className="flex-1"
                name="email"
                value={parentData.email}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                NPM (Mahasiswa)<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="npm"
                value={parentData.npm}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                No. HP<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_hp"
                value={parentData.no_hp}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status Verifikasi<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="is_verified"
                    value="true"
                    checked={parentData.is_verified === true}
                    onChange={() => handleRadioChange(true)}
                  />
                  Verified
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="is_verified"
                    value="false"
                    checked={parentData.is_verified === false}
                    onChange={() => handleRadioChange(false)}
                  />
                  Belum Verifikasi
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Password Baru
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="password"
                className="flex-1"
                name="password"
                value={parentData.password}
                onChange={inputHandler}
                placeholder="Kosongkan jika tidak ingin mengubah password"
              />
            </Form.Group>
            {parentData.password && (
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Konfirmasi Password Baru<span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="password"
                  className="flex-1"
                  name="confirmPassword"
                  value={parentData.confirmPassword}
                  onChange={inputHandler}
                  required
                />
              </Form.Group>
            )}
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button type="submit" variant="primary" className="w-1/2 h-12" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-1/2 h-12">
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  )
}
