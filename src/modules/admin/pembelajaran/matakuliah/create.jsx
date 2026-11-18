import { useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useForm from '../../../../hooks/useForm'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import useKurikulum from '../../../../repo/kurikulum'

const CreateMatakuliah = ({ onAction }) => {
  const { show, toggle, close } = useModal()

  const INITIAL_FORM = {
    kode_matakuliah: '',
    nama_matakuliah: '',
    kurikulum: '',
    sks: '',
    materi: '',
  }

  const { data: listKurikulum, isLoading: isKurkulumLoading } = useKurikulum()
  const [selectedKurikulum, setSelectedKurikulum] = useState('')

  const handleKurikulumChange = selected => {
    setSelectedKurikulum(selected?.value)
  }
  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: 'nama_matakuliah', label: 'nama_matakuliah' },
      { field: 'kode_matakuliah', label: 'kode_matakuliah' },
    ],
  })

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const requestData = {
        ...form,
        kurikulum: selectedKurikulum,
      }

      if (!requestData.nama_matakuliah || !requestData.kode_matakuliah) {
        toastAlert('error', 'Pleas fill in all the required fields.')

        return
      }

      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/kategori/matakuliah`,
        method: 'POST',
        data: requestData,
      })
      const response = await request.data

      form.nama_matakuliah = ''
      form.kode_matakuliah = ''
      form.sks = ''
      form.materi = ''

      setSelectedKurikulum('')

      toastAlert('success', 'Successfully')
      close()
      onAction()
    } catch (error) {
      if (error.name === 'AxiosError') {
        toastAlert('error', error.response.data.message)

        return
      }
      loadingAlert()
      MySwal.close()

      toastAlert('error', error.message)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Tambah Data
      </Button>
      <Modal title="Tambah Data Matakuliah" show={show} handler={toggle}>
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
              value={form.nama_matakuliah}
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
              value={form.kode_matakuliah}
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
              value={form.sks}
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
              value={form.materi}
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

export default CreateMatakuliah
