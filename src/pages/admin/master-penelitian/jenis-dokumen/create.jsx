import { useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { loadingAlert, toastAlert, MySwal } from '../../../../lib/sweetalert'

export default function CreateJenisDokumen({ onAction }) {
  const { show, toggle, close } = useModal()
  const [form, setForm] = useState({
    nama: '',
    keterangan: '',
  })
  const [loading, setLoading] = useState(false)

  const inputHandler = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const submitHandler = async e => {
    e.preventDefault()
    if (!form.nama?.trim()) {
      toastAlert('error', 'Nama jenis dokumen wajib diisi!')
      return
    }

    setLoading(true)
    loadingAlert('Harap Tunggu', 'Menyimpan data...')

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/jenis-dokumen`,
        {
          nama: form.nama.trim(),
          keterangan: form.keterangan?.trim() || '',
        }
      )

      MySwal.close()
      toastAlert('success', 'Jenis dokumen berhasil ditambahkan!')
      setForm({ nama: '', keterangan: '' })
      close()
      if (typeof onAction === 'function') onAction()
    } catch (error) {
      MySwal.close()
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal menambahkan jenis dokumen!'
      toastAlert('error', errorMsg)
    } finally {
      setLoading(false)
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
        Tambah Jenis Dokumen
      </Button>

      <Modal title="Tambah Jenis Dokumen" show={show} handler={toggle} size="base">
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Nama Jenis Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama"
              placeholder="Contoh: Proposal Penelitian, Laporan Kemajuan"
              value={form.nama}
              onChange={inputHandler}
              required
            />
          </Form.Group>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Keterangan
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1"
              name="keterangan"
              placeholder="Masukkan keterangan jenis dokumen (opsional)"
              value={form.keterangan}
              onChange={inputHandler}
              rows={3}
            />
          </Form.Group>

          <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={close}
              className="w-full h-12"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full h-12"
              disabled={loading}
            >
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
