import { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import Form from '../../../../components/Form'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import { loadingAlert, toastAlert, MySwal } from '../../../../lib/sweetalert'

export default function EditKolaboratorEksternal({ item, onAction }) {
  const { show, toggle, close } = useModal()
  const [form, setForm] = useState({
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
  })
  const [loading, setLoading] = useState(false)

  const extId = item?.ext_id || item?.id || item?.kolab_id

  useEffect(() => {
    if (show && item) {
      // Format date if needed (YYYY-MM-DD)
      let tgl = item.tanggal_lahir || item.tgl_lahir || ''
      if (tgl && tgl.includes('T')) {
        tgl = tgl.split('T')[0]
      }

      const jenkelVal = item.jenkel === 'P' || item.jenkel === 'Perempuan' ? 'Perempuan' : 'Laki-Laki'

      setForm({
        nama: item.nama || '',
        negara: item.negara || 'Indonesia',
        jenkel: jenkelVal,
        nik: item.nik || '',
        tempat_lahir: item.tempat_lahir || '',
        tanggal_lahir: tgl,
        email: item.email || '',
        no_hp: item.no_hp || '',
        jalan: item.jalan || '',
        rt: item.rt != null ? String(item.rt) : '',
        rw: item.rw != null ? String(item.rw) : '',
        desa_kelurahan: item.desa_kelurahan || '',
        kota_kabupaten: item.kota_kabupaten || '',
        provinsi: item.provinsi || '',
        kode_pos: item.kode_pos || '',
      })
    }
  }, [show, item])

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

    setLoading(true)
    loadingAlert('Harap Tunggu', 'Menyimpan perubahan...')

    try {
      const payload = {
        nama: form.nama.trim(),
        negara: form.negara,
        jenkel: form.jenkel === 'Perempuan' || form.jenkel === 'P' ? 'P' : 'L',
      }

      if (form.nik?.trim()) payload.nik = form.nik.trim()
      if (form.email?.trim()) payload.email = form.email.trim()
      if (form.no_hp?.trim()) payload.no_hp = form.no_hp.trim()
      if (form.tempat_lahir?.trim()) payload.tempat_lahir = form.tempat_lahir.trim()
      if (form.tanggal_lahir?.trim()) payload.tanggal_lahir = form.tanggal_lahir.trim()
      if (form.jalan?.trim()) payload.jalan = form.jalan.trim()

      if (form.rt && String(form.rt).trim() !== '') {
        const rtNum = parseInt(String(form.rt).trim(), 10)
        if (!isNaN(rtNum)) payload.rt = rtNum
      }
      if (form.rw && String(form.rw).trim() !== '') {
        const rwNum = parseInt(String(form.rw).trim(), 10)
        if (!isNaN(rwNum)) payload.rw = rwNum
      }

      if (form.desa_kelurahan?.trim()) payload.desa_kelurahan = form.desa_kelurahan.trim()
      if (form.kota_kabupaten?.trim()) payload.kota_kabupaten = form.kota_kabupaten.trim()
      if (form.provinsi?.trim()) payload.provinsi = form.provinsi.trim()
      if (form.kode_pos?.trim()) payload.kode_pos = form.kode_pos.trim()

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/kolabExt/${extId}`,
        payload
      )

      MySwal.close()
      toastAlert('success', 'Data kolaborator eksternal berhasil diperbarui!')
      close()
      if (typeof onAction === 'function') onAction()
    } catch (error) {
      MySwal.close()
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal memperbarui kolaborator eksternal!'
      toastAlert('error', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button.Icon
        type="button"
        variant="secondary"
        icon={<Icon icon="bx:edit" width={20} height={20} />}
        onClick={toggle}
      />

      <Modal
        title="Edit Kolaborator Eksternal"
        show={show}
        handler={toggle}
        size="lg"
      >
        <Form className="space-y-6 max-h-[75vh] overflow-y-auto px-2" onSubmit={submitHandler}>
          {/* Data Identitas & Kontak */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
              Data Identitas & Kontak
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group>
                <Form.Label>
                  Nama Lengkap <span className="text-danger-600">*</span>
                </Form.Label>
                <Form.Input
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama lengkap kolaborator"
                  value={form.nama}
                  onChange={inputHandler}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>NIK / No. Identitas</Form.Label>
                <Form.Input
                  type="text"
                  name="nik"
                  placeholder="Contoh: 3201012345670001"
                  value={form.nik}
                  onChange={inputHandler}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Negara <span className="text-danger-600">*</span>
                </Form.Label>
                <Form.Select
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

              <Form.Group>
                <Form.Label>
                  Jenis Kelamin <span className="text-danger-600">*</span>
                </Form.Label>
                <div className="flex items-center gap-6 h-10">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
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
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
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

              <Form.Group>
                <Form.Label>Tempat Lahir</Form.Label>
                <Form.Input
                  type="text"
                  name="tempat_lahir"
                  placeholder="Kota Kelahiran"
                  value={form.tempat_lahir}
                  onChange={inputHandler}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Input
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={inputHandler}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={inputHandler}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>No. HP</Form.Label>
                <Form.Input
                  type="text"
                  name="no_hp"
                  placeholder="08123456789"
                  value={form.no_hp}
                  onChange={inputHandler}
                />
              </Form.Group>
            </div>
          </div>

          {/* Data Alamat */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
              Data Alamat
            </h4>
            <div className="space-y-4">
              <Form.Group>
                <Form.Label>Alamat Lengkap / Jalan</Form.Label>
                <Form.Textarea
                  name="jalan"
                  placeholder="Masukkan nama jalan, nomor rumah, gedung, dsb."
                  value={form.jalan}
                  onChange={inputHandler}
                  rows={2}
                />
              </Form.Group>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Form.Group>
                  <Form.Label>RT</Form.Label>
                  <Form.Input
                    type="text"
                    name="rt"
                    placeholder="Contoh: 001"
                    value={form.rt}
                    onChange={inputHandler}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>RW</Form.Label>
                  <Form.Input
                    type="text"
                    name="rw"
                    placeholder="Contoh: 002"
                    value={form.rw}
                    onChange={inputHandler}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Kode Pos</Form.Label>
                  <Form.Input
                    type="text"
                    name="kode_pos"
                    placeholder="Contoh: 12345"
                    value={form.kode_pos}
                    onChange={inputHandler}
                  />
                </Form.Group>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Form.Group>
                  <Form.Label>Desa / Kelurahan</Form.Label>
                  <Form.Input
                    type="text"
                    name="desa_kelurahan"
                    placeholder="Kelurahan / Desa"
                    value={form.desa_kelurahan}
                    onChange={inputHandler}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Kota / Kabupaten</Form.Label>
                  <Form.Input
                    type="text"
                    name="kota_kabupaten"
                    placeholder="Kota / Kabupaten"
                    value={form.kota_kabupaten}
                    onChange={inputHandler}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Provinsi</Form.Label>
                  <Form.Input
                    type="text"
                    name="provinsi"
                    placeholder="Provinsi"
                    value={form.provinsi}
                    onChange={inputHandler}
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
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
              Simpan Perubahan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
