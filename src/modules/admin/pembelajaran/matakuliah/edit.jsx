import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import Form from '../../../../components/Form'
import useKurikulum from '../../../../repo/kurikulum'

const EditMatakuliah = ({ id, onAction }) => {
  const { show, toggle, close } = useModal()

  const [formData, setFormData] = useState({
    kode_matakuliah: '',
    nama_matakuliah: '',
    kurikulum: '',
    sks: '',
    materi: '',
  })

  const { data: listKurikulum, isLoading: isKurkulumLoading } = useKurikulum()
  const [selectedKurikulum, setSelectedKurikulum] = useState(1)

  const handleKurikulumChange = selected => {
    setSelectedKurikulum(selected?.value)
  }

  const getData = async id => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/kategori/matakuliah/${id}`,
      )

      const dataResponse = response.data.data

      setFormData({
        code: dataResponse.code,
        nama_unit: dataResponse.nama_unit,
        kode_matakuliah: dataResponse.kode_matakuliah,
        nama_matakuliah: dataResponse.nama_matakuliah,
        sks: dataResponse.sks,
        materi: dataResponse.materi,
      })
      setSelectedKurikulum(dataResponse.kurikulum)
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
      const requestData = {
        ...formData,
        kurikulum: selectedKurikulum,
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/kategori/matakuliah/${id || ''}`,
        requestData,
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

      <Modal title="Edit Data Master Unit" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Matakuliah <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_matakuliah"
              onChange={inputHandler}
              value={formData.nama_matakuliah}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Kode <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="kode_matakuliah"
              onChange={inputHandler}
              value={formData.kode_matakuliah}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Kurikulum <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="kurikulum"
              onChange={handleKurikulumChange}
              value={selectedKurikulum}
              options={listKurikulum?.map(item => ({
                label: item.kurikulum,
                value: item.id,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              SKS <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="number"
              className="flex-1"
              name="sks"
              onChange={inputHandler}
              value={formData.sks}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">Link Materi</Form.Label>
            <span>:</span>
            <Form.Textarea
              rows="4"
              name="materi"
              onChange={inputHandler}
              value={formData.materi}
            ></Form.Textarea>
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

export default EditMatakuliah
