import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'

const EditAbsensi = ({ data, onAddAbsensi }) => {
  const { show, toggle, close } = useModal()

  const [formData, setFormData] = useState({
    code: '',
    name_absen: '',
    status_absen: null,
  })

  const fetchAbsensiData = async id => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_ABSEN}/absensi-meeting`, {
        params: {
          filter: ['id'],
          filterValue: [id],
        },
      })

      const dataAbsensi = response.data.data

      if (dataAbsensi && dataAbsensi.length > 0) {
        setFormData({
          code: dataAbsensi[0]?.code || '',
          name_absen: dataAbsensi[0]?.name_absen || '',
          status_absen: parseInt(dataAbsensi[0]?.status_absen) || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (show && data && data.id) {
      fetchAbsensiData(data.id)
    }
  }, [show, data])

  const inputHandler = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'status_absen' ? (value !== '' ? parseInt(value) : 0) : value,
    }))
  }

  const submitHandler = async event => {
    event.preventDefault()

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_ABSEN}/absensi-meeting/update/${data?.id || ''}`,
        formData,
      )

      const responseData = response.data
      toastAlert('success', 'Updated Successfully')
      close()
      onAddAbsensi()
    } catch (error) {
      console.error('Error updating data:', error)

      if (error.name === 'AxiosError') {
        toastAlert('error', error.message)
      } else {
        loadingAlert()
        MySwal.close()
        toastAlert('error', 'Update failed. Please try again.')
      }
    }
  }

  return (
    <>
      <Button.Icon
        variant="secondary"
        icon={<Icon icon="bx:edit" width={20} height={20} />}
        onClick={toggle}
      />

      <Modal title="Edit Presensi" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>
              Nama <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="name_absen"
              value={formData.name_absen}
              onChange={inputHandler}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              NIP/NPM <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="number"
              name="code"
              value={formData.code}
              onChange={inputHandler}
              required
            />
          </Form.Group>

          <Form.Group className="flex items-baseline gap-2">
            <Form.Label className="min-w-[8rem] text-sm">
              Status Absen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <div className="flex gap-6">
              <Form.Label>
                <Form.Radio
                  name="status_absen"
                  value={1}
                  onChange={inputHandler}
                  checked={formData.status_absen === 1}
                />
                Masuk
              </Form.Label>
              <Form.Label>
                <Form.Radio
                  name="status_absen"
                  value={2}
                  onChange={inputHandler}
                  checked={formData.status_absen === 2}
                />
                Sakit/ Izin
              </Form.Label>
              <Form.Label>
                <Form.Radio
                  name="status_absen"
                  value={0}
                  onChange={inputHandler}
                  checked={formData.status_absen === 0}
                />
                Alfa
              </Form.Label>
            </div>
          </Form.Group>

          <div className="flex gap-4 mt-12">
            <Button type="button" variant="secondary" onClick={close}>
              Tutup
            </Button>
            <Button type="submit" variant="primary" className="w-full h-12">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default EditAbsensi
