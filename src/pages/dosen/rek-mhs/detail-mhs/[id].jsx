import { useRouter } from 'next/router'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import useCRUD from '../../../../hooks/useCRUD'
import { useEffect, useState } from 'react'
import Form from '../../../../components/Form'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import axios from 'axios'
import useForm from '../../../../hooks/useForm'
import _ from 'underscore'
import Card from '../../../../components/Card'
import { Icon } from '@iconify-icon/react'
import { Loading } from '../../../../components/Loading'

export default function DetailMhs() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const [data, setData] = useState({})
  const [dataRekomendasi, setDataRekomendasi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.id) {
          const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/detail-user/${router.query.id}`

          const response = await axios.get(API_URL)

          setData(response.data.data)
          setDataRekomendasi(response.data.rekomendasiMhs)
        }
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router.query])

  const [formData, setFormData] = useState({
    body: '',
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rekomendasi/add`, {
        body: formData.body,
        mahasiswa_id: data.user_id,
      })

      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/detail-user/${router.query.id}`,
      )
      setData(updatedResponse.data.data)
      setDataRekomendasi(updatedResponse.data.rekomendasiMhs)

      setFormData({
        body: '',
      })

      toastAlert('success', response.data.message)
    } catch (error) {
      if (error.name === 'AxiosError') {
        const { status_code, message, data } = error.response.data
        toastAlert('error', message)

        return
      }
      loadingAlert()
      MySwal.close()

      toastAlert('error', error.message)
    }
  }

  if ([user, menu, loading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title="Rekomendasi Mahasiswa" icon={menu.icon} handler={setActive} />
      <div className="my-8">
        <div className="px-4 md:px-8 lg:px-16">
          <div className="p-4 md:pt-24 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center justify-between mt-20 md:mt-0 md:justify-center">
                <div className="pl-4">
                  <p className="font-bold text-gray-700 text-xl">{data.point_penelitian}</p>
                  <p className="text-gray-400">Point Penelitian</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">{data.point_pendidikan}</p>
                  <p className="text-gray-400">Point Pendidikan</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">{data.point_pengabdian}</p>
                  <p className="text-gray-400">Point Pengabdian</p>
                </div>
              </div>
              <div className="relative">
                <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute md:relative inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + '/foto-profile/' + data.image}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center justify-between mt-20 md:mt-0 md:justify-center">
                <div>
                  <p className="font-bold text-gray-700 text-xl">{data.point_kompetensi}</p>
                  <p className="text-gray-400">Point Kompetensi</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xl">{data.point_penunjang}</p>
                  <p className="text-gray-400">Point Penunjang</p>
                </div>
                <div className="pr-10">
                  <p className="font-bold text-gray-700 text-xl">{data.point_rekomendasi}</p>
                  <p className="text-gray-400">Point Rekomendasi</p>
                </div>
              </div>
            </div>
            <div className="mt-20 text-center border-b pb-12">
              <h1 className="text-2xl md:text-4xl font-medium text-gray-700">
                {data.nama_lengkap} | <span className="font-light text-gray-500">{data.npm}</span>
              </h1>
              <p className="font-light text-gray-600 mt-3">IPK. {data.ipk}</p>
              <p className="mt-4 font-bold text-gray-500">
                TOTAL POINT: {data.total_point} - {data.rank}
              </p>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="px-4 md:px-8 lg:px-16 pt-6">
            <div className="p-4 md:pt-4 bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="my-4">
                <textarea
                  placeholder="Rekomendasi*"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="my-2 w-1/2 lg:w-1/4 pb-4">
                <button
                  type="submit"
                  className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </Form>

        <h3 className="mt-12 font-bold text-xl">Rekomendasi:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {dataRekomendasi.map((row, index) => (
            <Card key={index}>
              <Card.Body>
                <div className="flex items-center mb-2">
                  <div className="inline-flex p-2 rounded-full bg-primary-600">
                    <img
                      src={process.env.NEXT_PUBLIC_API_URL + '/foto-profile/' + row.image}
                      alt="image"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="block text-base font-bold ml-2">{row.nama_dosen}</p>
                </div>
                <p className="block text-sm">{row.text_rekomendasi}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
