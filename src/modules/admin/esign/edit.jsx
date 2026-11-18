import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import useModal from '../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { MySwal, loadingAlert, toastAlert } from '../../../lib/sweetalert'
import Form from '../../../components/Form'
import useUsersGroup from '../../../repo/users-group'

const EditESign = ({ id, onAction }) => {
  const { show, toggle, close } = useModal()

  const [formData, setFormData] = useState({
    pelaksana: '',
    tertuju: '',
    nama_kegiatan: '',
    link_attachment: '',
  })

  const { data: listUsersGroup, isLoading: isLoadingUsersGroup } = useUsersGroup()

  const [selectedPelaksana, setSelectedPelaksana] = useState('')
  const [selectedTertuju, setSelectedTertuju] = useState('')

  const handleSelectedPelaksana = selected => {
    setSelectedPelaksana(selected?.value)
  }

  const handleSelectedTertuju = selected => {
    setSelectedTertuju(selected?.value)
  }

  const getData = async id => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/validasi/validasi-dokumen/detail/${id}`,
      )

      const dataResponse = response.data.data

      setFormData({
        nama_kegiatan: dataResponse.nama_kegiatan,
        link_attachment: dataResponse.link_attachment,
      })
      setSelectedPelaksana(dataResponse.pelaksana)
      setSelectedTertuju(dataResponse.tertuju)
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
        pelaksana: selectedPelaksana,
        tertuju: selectedTertuju,
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/validasi/validasi-dokumen/${id || ''}`,
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
              value={formData.nama_kegiatan}
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
              value={formData.link_attachment}
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

export default EditESign
