import { useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Form from '../../../components/Form'
import useModal from '../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useForm from '../../../hooks/useForm'
import { MySwal, loadingAlert, toastAlert } from '../../../lib/sweetalert'

const CreateUnit = ({ onAction }) => {
  const { show, toggle, close } = useModal()

  const INITIAL_FORM = {
    code: '',
    nama_unit: '',
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: 'nama_unit', label: 'nama_unit' },
      { field: 'code', label: 'code' },
    ],
  })

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const requestData = {
        ...form,
      }

      if (!requestData.nama_unit || !requestData.code) {
        toastAlert('error', 'Pleas fill in all the required fields.')

        return
      }

      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/kategori/unit`,
        method: 'POST',
        data: requestData,
      })
      const response = await request.data

      form.nama_unit = ''
      form.code = ''

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
        Tambah Unit
      </Button>
      <Modal title="Tambah Data Master Unit" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Kode <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="code"
              onChange={inputHandler}
              value={form.code}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Nama Unit <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_unit"
              onChange={inputHandler}
              value={form.nama_unit}
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

export default CreateUnit
