import { useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Form from '../../../components/Form'
import useModal from '../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useForm from '../../../hooks/useForm'
import { MySwal, loadingAlert, toastAlert } from '../../../lib/sweetalert'
import useUsersGroup from '../../../repo/users-group'

const CreateValidasi = ({ onAction }) => {
  const { show, toggle, close } = useModal()

  const INITIAL_FORM = {
    pelaksana: '',
    tertuju: '',
    nama_kegiatan: '',
    link_attachment: '',
  }

  const { data: listUsersGroup, isLoading: isLoadingUsersGroup } = useUsersGroup()

  const [selectedPelaksana, setSelectedPelaksana] = useState('')
  const [selectedTertuju, setSelectedTertuju] = useState('')

  const handleSelectedPelaksana = selected => {
    setSelectedPelaksana(selected?.value)
  }

  const handleSelectedTertuju = selected => {
    setSelectedTertuju(selected?.value)
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: 'nama_kegiatan', label: 'nama_kegiatan' },
      { field: 'link_attachment', label: 'link_attachment' },
    ],
  })

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const requestData = {
        ...form,
        pelaksana: selectedPelaksana,
        tertuju: selectedTertuju,
      }

      if (!requestData.pelaksana || !requestData.tertuju || !requestData.nama_kegiatan) {
        toastAlert('error', 'Pleas fill in all the required fields.')

        return
      }

      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/validasi/validasi-dokumen`,
        method: 'POST',
        data: requestData,
      })
      const response = await request.data

      form.pelaksana = ''
      form.tertuju = ''
      form.nama_kegiatan = ''
      form.link_attachment = ''

      setSelectedPelaksana('')
      setSelectedTertuju('')

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
      <Modal title="Tambah Data" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Pelaksana <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="dosen_id"
              onChange={handleSelectedPelaksana}
              value={selectedPelaksana}
              options={listUsersGroup
                ?.map(item => {
                  if (item.type === 'users') {
                    return {
                      label: item.nama_lengkap,
                      value: item.nama_lengkap,
                    }
                  } else if (item.type === 'group') {
                    return {
                      label: item.nama_group,
                      value: item.nama_group,
                    }
                  } else if (item.type === 'jabatan') {
                    return {
                      label: item.nama_jabatan,
                      value: item.nama_jabatan,
                    }
                  } else if (item.type === 'unit') {
                    return {
                      label: item.nama_unit,
                      value: item.nama_unit,
                    }
                  }
                  return null
                })
                .filter(Boolean)}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Tertuju <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="mhs_id"
              onChange={handleSelectedTertuju}
              value={selectedTertuju}
              options={listUsersGroup
                ?.map(item => {
                  if (item.type === 'users') {
                    return {
                      label: item.nama_lengkap,
                      value: item.nama_lengkap,
                    }
                  } else if (item.type === 'group') {
                    return {
                      label: item.nama_group,
                      value: item.nama_group,
                    }
                  } else if (item.type === 'jabatan') {
                    return {
                      label: item.nama_jabatan,
                      value: item.nama_jabatan,
                    }
                  } else if (item.type === 'unit') {
                    return {
                      label: item.nama_unit,
                      value: item.nama_unit,
                    }
                  }
                  return null
                })
                .filter(Boolean)}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Nama Kegiatan <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              rows="4"
              name="nama_kegiatan"
              onChange={inputHandler}
              value={form.nama_kegiatan}
            ></Form.Textarea>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">Link Attachment</Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="link_attachment"
              onChange={inputHandler}
              value={form.link_attachment}
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

export default CreateValidasi
