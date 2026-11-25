import { useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { loadingAlert, toastAlert, MySwal } from '../../../../lib/sweetalert'

export default function CreateKelompokBidang({ onAction }) {
  const { show, toggle, close } = useModal()
  const [form, setForm] = useState({
    nama: '',
    is_iptek: true,
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
      toastAlert('error', 'Nama kelompok bidang wajib diisi!')
      return
    }

    setLoading(true)
    loadingAlert('Harap Tunggu', 'Menyimpan data...')

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/kelompok-bidang`,
        {
          nama: form.nama.trim(),
          is_iptek: Boolean(form.is_iptek),
        }
      )

      MySwal.close()
      toastAlert('success', 'Kelompok bidang berhasil ditambahkan!')
      setForm({ nama: '', is_iptek: true })
      close()
      if (typeof onAction === 'function') onAction()
    } catch (error) {
      MySwal.close()
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal menambahkan kelompok bidang!'
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
        Tambah Kelompok Bidang
      </Button>

      <Modal title="Tambah Kelompok Bidang" show={show} handler={toggle} size="base">
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Nama Kelompok Bidang <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama"
              placeholder="Masukkan nama kelompok bidang"
              value={form.nama}
              onChange={inputHandler}
              required
            />
          </Form.Group>

          <Form.Group className="flex items-center gap-3">
            <Form.Label className="min-w-[10rem] mb-0">
              Kategori IPTEK <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="is_iptek"
                  checked={form.is_iptek === true}
                  onChange={() => setForm(prev => ({ ...prev, is_iptek: true }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                IPTEK
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="is_iptek"
                  checked={form.is_iptek === false}
                  onChange={() => setForm(prev => ({ ...prev, is_iptek: false }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                Non-IPTEK
              </label>
            </div>
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
