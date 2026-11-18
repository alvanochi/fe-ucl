import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'

const EditKategoriKegiatan = ({ id, onAction }) => {
  const { show, toggle, close } = useModal()

  const [formData, setFormData] = useState({
    nama_kegiatan: '',
  })

  const getData = async id => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kategori/kegiatan/${id}`)

      const dataResponse = response.data.data

      setFormData({
        nama_kegiatan: dataResponse.nama_kegiatan,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (show && id) {
      getData(id)
    }
  }, [show, id])

  const inputHandler = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const submitHandler = async event => {
    event.preventDefault()

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/kategori/kegiatan/${id || ''}`,
        formData,
      )

      const responseData = response.data
      toastAlert('success', 'Updated Successfully')
      close()
      onAction()
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

      <Modal title="Edit Group" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>
              Nama Kegiatan <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="nama_kegiatan"
              value={formData.nama_kegiatan}
              onChange={inputHandler}
              required
            />
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

export default EditKategoriKegiatan
