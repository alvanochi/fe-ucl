import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useForm from '../../../../hooks/useForm'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import { use, useState } from 'react'
import useUsers from '../../../../repo/users'
import useUser from '../../../../hooks/useUser'

const AddAbsensiRapat = ({ data, onAddAbsensi }) => {
  const { show, toggle, close } = useModal()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const { user } = useUser({ redirectTo: '/login' })

  const { data: listUser, isLoading: isUsersLoading } = useUsers([user])

  const INITIAL_FORM = {
    id_meeting: data && data.id ? data.id : '',
    status_absen: '1',
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: 'id_meeting', label: 'ID Meeting' },
      { field: 'code', label: 'code' },
      { field: 'name_absen', label: 'Nama' },
      { field: 'status_absen', label: 'status_absen' },
    ],
  })

  const handlePesertaChange = selected => {
    setCode(selected?.value)
    setName(selected?.name)
  }

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const requestData = {
        ...form,
        name_absen: name,
        code,
      }

      if (!requestData.status_absen || !requestData.code) {
        toastAlert('error', 'Pleas fill in all the required fields.')

        return
      }
      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL_ABSEN}/absensi-meeting/store`,
        method: 'POST',
        data: requestData,
      })
      const response = await request.data

      form.id_meeting = data && data.id ? data.id : ''
      form.code = ''
      form.name_absen = ''
      form.status_absen = '1'

      toastAlert('success', 'Successfully')
      close()
      onAddAbsensi()
    } catch (error) {
      if (error.name === 'AxiosError') {
        toastAlert('error', error.message)

        return
      }
      loadingAlert()
      MySwal.close()

      toastAlert('error', error.message)
    }
  }

  if ([user, isUsersLoading].some(item => item == null))
    return (
      <>
        <Button
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          onClick={toggle}
          pill
        >
          Tambah Presensi
        </Button>
        <Modal title="Tambah Presensi" show={show} handler={toggle}>
          <Form className="space-y-4" onSubmit={submitHandler}>
            <Form.Input
              type="hidden"
              name="id_meeting"
              onChange={inputHandler}
              value={form.id_meeting}
            />
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[10rem]">
                Peserta <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="code"
                onChange={handlePesertaChange}
                value={code}
                options={listUser?.map(user => ({
                  label: `${user.personal_data?.nama_lengkap} - ${
                    user.npm ? user.npm : user.personal_data?.nip
                  }`,
                  value: user.npm ? user.npm : user.nip,
                  name: user.nama_lengkap,
                }))}
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
                    checked={form.status_absen == 1}
                  />
                  Masuk
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_absen"
                    value={2}
                    onChange={inputHandler}
                    checked={form.status_absen == 2}
                  />
                  Sakit / Izin
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_absen"
                    value={0}
                    onChange={inputHandler}
                    checked={form.status_absen == 0}
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

export default AddAbsensiRapat
