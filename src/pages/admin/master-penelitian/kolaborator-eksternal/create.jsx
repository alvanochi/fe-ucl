import { useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { loadingAlert, toastAlert, MySwal } from '../../../../lib/sweetalert'

const INITIAL_FORM = {
  nama: '',
  negara: 'Indonesia',
  jenkel: 'Laki-Laki',
  nik: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  email: '',
  no_hp: '',
  jalan: '',
  rt: '',
  rw: '',
  desa_kelurahan: '',
  kota_kabupaten: '',
  provinsi: '',
  kode_pos: '',
}

export default function CreateKolaboratorEksternal({ onAction }) {
  const { show, toggle, close } = useModal()
  const [form, setForm] = useState(INITIAL_FORM)
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
      toastAlert('error', 'Nama lengkap wajib diisi!')
      return
    }
    if (!form.negara) {
      toastAlert('error', 'Negara wajib dipilih!')
      return
    }

    setLoading(true)
    loadingAlert('Harap Tunggu', 'Menyimpan data kolaborator...')

    try {
      const payload = {
        nama: form.nama.trim(),
        negara: form.negara,
        jenkel: form.jenkel,
        nik: form.nik?.trim() || null,
        tempat_lahir: form.tempat_lahir?.trim() || null,
        tanggal_lahir: form.tanggal_lahir || null,
        email: form.email?.trim() || null,
        no_hp: form.no_hp?.trim() || null,
        jalan: form.jalan?.trim() || null,
        alamat: form.jalan?.trim() || null,
        rt: form.rt?.trim() || null,
        rw: form.rw?.trim() || null,
        desa_kelurahan: form.desa_kelurahan?.trim() || null,
        kota_kabupaten: form.kota_kabupaten?.trim() || null,
        provinsi: form.provinsi?.trim() || null,
        kode_pos: form.kode_pos?.trim() || null,
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/kolabExt`, payload)

      MySwal.close()
      toastAlert('success', 'Kolaborator eksternal berhasil ditambahkan!')
      setForm(INITIAL_FORM)
      close()
      if (typeof onAction === 'function') onAction()
    } catch (error) {
      MySwal.close()
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal menambahkan kolaborator eksternal!'
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
        Tambah Kolaborator Eksternal
      </Button>

      <Modal
        title="Tambah Kolaborator Eksternal"
        show={show}
        handler={toggle}
        size="lg"
      >
        <Form className="space-y-4 max-h-[75vh] overflow-y-auto px-1" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[12rem]">
              Nama Lengkap <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama"
              placeholder="Masukkan nama lengkap kolaborator"
              value={form.nama}
              onChange={inputHandler}
              required
            />
          </Form.Group>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[12rem]">
              Negara <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
              className="flex-1"
              name="negara"
              value={form.negara}
              onChange={inputHandler}
              options={[
                { label: 'Indonesia', value: 'Indonesia' },
                { label: 'Singapura', value: 'Singapura' },
                { label: 'Malaysia', value: 'Malaysia' },
                { label: 'Filipina', value: 'Filipina' },
                { label: 'Thailand', value: 'Thailand' },
                { label: 'Vietnam', value: 'Vietnam' },
                { label: 'Brunei Darussalam', value: 'Brunei Darussalam' },
                { label: 'Jepang', value: 'Jepang' },
                { label: 'Australia', value: 'Australia' },
                { label: 'Lainnya', value: 'Lainnya' },
              ]}
              required
            />
          </Form.Group>

          <Form.Group className="flex items-center gap-3">
            <Form.Label className="min-w-[12rem] mb-0">
              Jenis Kelamin <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="jenkel"
                  value="Laki-Laki"
                  checked={form.jenkel === 'Laki-Laki'}
                  onChange={inputHandler}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                Laki-Laki
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="jenkel"
                  value="Perempuan"
                  checked={form.jenkel === 'Perempuan'}
                  onChange={inputHandler}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                Perempuan
              </label>
            </div>
          </Form.Group>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[12rem]">
              NIK / No. Identitas
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nik"
              placeholder="Contoh: 3201012345670001"
              value={form.nik}
              onChange={inputHandler}
            />
          </Form.Group>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[7rem]">
                Tempat Lahir
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tempat_lahir"
                placeholder="Kota Kelahiran"
                value={form.tempat_lahir}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[7rem]">
                Tanggal Lahir
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={inputHandler}
              />
            </Form.Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[7rem]">
                Email
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="email"
                className="flex-1"
                name="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[7rem]">
                No. HP
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_hp"
                placeholder="08123456789"
                value={form.no_hp}
                onChange={inputHandler}
              />
            </Form.Group>
          </div>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[12rem]">
              Alamat Lengkap / Jalan
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1"
              name="jalan"
              placeholder="Jl. Raya No. 123"
              value={form.jalan}
              onChange={inputHandler}
              rows={2}
            />
          </Form.Group>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Form.Group className="flex items-baseline gap-2">
              <Form.Label className="w-10">RT</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rt"
                placeholder="001"
                value={form.rt}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-2">
              <Form.Label className="w-10">RW</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rw"
                placeholder="002"
                value={form.rw}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-2 col-span-2">
              <Form.Label className="w-20">Kode Pos</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kode_pos"
                placeholder="12345"
                value={form.kode_pos}
                onChange={inputHandler}
              />
            </Form.Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Form.Group className="flex items-baseline gap-2">
              <Form.Label className="w-24">Kelurahan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="desa_kelurahan"
                placeholder="Kelurahan/Desa"
                value={form.desa_kelurahan}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-2">
              <Form.Label className="w-24">Kab/Kota</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kota_kabupaten"
                placeholder="Kota/Kabupaten"
                value={form.kota_kabupaten}
                onChange={inputHandler}
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-2">
              <Form.Label className="w-20">Provinsi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="provinsi"
                placeholder="Provinsi"
                value={form.provinsi}
                onChange={inputHandler}
              />
            </Form.Group>
          </div>

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
