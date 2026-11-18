import { useEffect, useState } from 'react'
import axios from 'axios'
import useUser from '../../../../hooks/useUser'
import useMenu from '../../../../hooks/useMenu'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Button from '../../../../components/Button'
import useDosen from '../../../../repo/dosen'
import { toastAlert } from '../../../../lib/sweetalert'
import { Loading } from '../../../../components/Loading'

export default function AkademikModule({ baseURL }) {
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik/get`
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/dokumen-frs`

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dataSemesters, setDataSemesters] = useState([])
  const [activeSemester, setActiveSemester] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL)
        setData(response.data.data)
        const sortedSemesters = response.data.semesters.sort((a, b) => a.semester - b.semester)
        setDataSemesters(sortedSemesters)
        setActiveSemester(response.data.semesters[0])
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])

  const handleSemesterChange = semester => {
    setActiveSemester(semester)
  }

  const formatDate = dateString => {
    if (!dateString) return ''
    return dateString.substring(0, 10)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const formData = new FormData(event.target)

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik/edit-mhs/${activeSemester.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      const getDataAgain = await axios.get(API_URL)
      setData(getDataAgain.data.data)
      const sortedSemesters = getDataAgain.data.semesters.sort((a, b) => a.semester - b.semester)
      setDataSemesters(sortedSemesters)
      setActiveSemester(getDataAgain.data.semesters[0])

      const updatedActiveSemester = response.data.data

      setActiveSemester(updatedActiveSemester)

      toastAlert('success', 'Updated!')
      event.target.reset()
    } catch (error) {
      console.error('Terjadi kesalahan saat mengunggah dokumen FRS:', error)
      if (error.name === 'AxiosError') {
        toastAlert('warning', error.response.data.message)
        return
      }
      toastAlert('error', error)
    }
  }

  if ([user, menu, isDosenLoading, loading].some(item => item == null)) return <Loading />

  return (
    <>
      <Card className="mt-4">
        <Card.Header className="text-center">Bimbingan Akademik</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Tahun Angkatan <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="tahun_angkatan"
              value={data?.tahun_angkatan}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Dosen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
              className="flex-1"
              name="dosen_id"
              value={data?.dosen_id}
              options={
                listDosen &&
                listDosen.map(dosen => ({
                  label: dosen.nama_lengkap,
                  value: dosen.user_id,
                }))
              }
              disabled
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <div className="sm:hidden mt-8">
        <label htmlFor="tabs" className="sr-only">
          Select your semester
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => {
            const selectedSemester = dataSemesters.find(
              semester => semester.semester === parseInt(e.target.value),
            )
            handleSemesterChange(selectedSemester)
          }}
        >
          {dataSemesters.map(semester => (
            <option key={semester.id} value={semester.semester}>
              Semester {semester.semester}
            </option>
          ))}
        </select>
      </div>

      <ul className="hidden text-sm font-medium text-center rounded-lg shadow sm:flex mt-8">
        {dataSemesters.map(semester => (
          <li key={semester.id} className="w-full focus-within:z-10">
            <button
              className={`inline-block w-full p-4 ${
                semester.id === activeSemester?.id
                  ? 'bg-info-700 text-white-900'
                  : 'bg-gray-300 text-white-500'
              } border-r border-gray-200 dark:border-white-700 rounded-s-lg focus:ring-4 ${
                semester.id === activeSemester?.id ? 'focus:ring-blue-300' : ''
              }  focus:outline-none  dark:text-white`}
              onClick={() => handleSemesterChange(semester)}
            >
              Semester {semester.semester}
            </button>
          </li>
        ))}
      </ul>

      <Card className="mt-2">
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 1 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p1"
              value={formatDate(activeSemester?.p1)}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 2 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p2"
              value={formatDate(activeSemester?.p2)}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 3 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p3"
              value={formatDate(activeSemester?.p3)}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 4 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p4"
              value={formatDate(activeSemester?.p4)}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Catatan<span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1"
              rows="5"
              name="catatan"
              value={activeSemester?.catatan || ''}
              disabled
            />
          </Form.Group>
        </Card.Body>
      </Card>
      {!data ? null : (
        <Form onSubmit={handleSubmit}>
          <Card className="mt-8 mb-8">
            <Card.Header className="text-center">Dokumen FRS</Card.Header>
            <Card.Body className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <div className="flex-1 block">
                  <div className="space-y-2 mt-2">
                    <Form.Group className="mb-4">
                      <Form.Label>Dokumen</Form.Label>
                      <Form.Input type="file" className="flex-1" name="dok_frs" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <embed
                        src={`${FILE_URL}/${activeSemester?.dok_frs}`}
                        className="w-full h-[256px]"
                      />
                    </Form.Group>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button type="submit" variant="primary" className="w-full h-12">
                      Submit
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Form>
      )}
    </>
  )
}
