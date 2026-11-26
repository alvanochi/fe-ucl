import { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Form from '../../../components/Form'
import { loadingAlert, toastAlert, MySwal } from '../../../lib/sweetalert'

const INITIAL_FORM = {
  nama: '',
  instansi: '',
  negara: 'Indonesia',
  jenkel: '',
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

export default function ModalKolaboratorEksternal({
  show,
  onClose,
  initialNama = '',
  onSuccess,
}) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show) {
      setForm({
        ...INITIAL_FORM,
        nama: initialNama || '',
      })
    }
  }, [show, initialNama])

  const NUMERIC_FIELDS = ['nik', 'no_hp', 'rt', 'rw', 'kode_pos']

  const inputHandler = e => {
    const { name, value } = e.target
    const finalValue = NUMERIC_FIELDS.includes(name) ? value.replace(/\D/g, '') : value
    setForm(prev => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  const handleClose = () => {
    setForm(INITIAL_FORM)
    if (typeof onClose === 'function') onClose()
  }

  const submitHandler = async (e, force = false) => {
    if (e && e.preventDefault) e.preventDefault()

    if (!form.nama?.trim()) {
      toastAlert('error', 'Nama lengkap wajib diisi!')
      return
    }
    if (!form.instansi?.trim()) {
      toastAlert('error', 'Instansi asal wajib diisi!')
      return
    }
    if (!form.nik?.trim()) {
      toastAlert('error', 'NIK / No. Identitas wajib diisi!')
      return
    }
    if (!form.negara) {
      toastAlert('error', 'Negara wajib dipilih!')
      return
    }

    setLoading(true)
    loadingAlert('Harap Tunggu', 'Menyimpan data kolaborator...')

    const payload = {
      nama: form.nama.trim(),
      instansi: form.instansi.trim(),
      negara: form.negara,
    }

    if (force) {
      payload.force = true
    }

    if (form.jenkel) {
      payload.jenkel = form.jenkel === 'Perempuan' || form.jenkel === 'P' ? 'P' : 'L'
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

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/kolabExt`, payload)
      MySwal.close()

      // 4a. Jika Sukses (201 / status: "success")
      const createdData = res.data?.data || res.data || {}
      toastAlert('success', 'Kolaborator eksternal berhasil ditambahkan!')
      setForm(INITIAL_FORM)

      if (typeof onSuccess === 'function') {
        onSuccess(createdData)
      }
      if (typeof onClose === 'function') {
        onClose()
      }
    } catch (error) {
      MySwal.close()
      const errRes = error.response
      const errData = errRes?.data || {}

      // 4b. Jika NIK Duplikat (409 / status: "blocked")
      if (
        errRes?.status === 409 &&
        (errData.status === 'blocked' || String(errData.message || '').toLowerCase().includes('nik'))
      ) {
        await MySwal.fire({
          icon: 'info',
          title: 'Kolaborator dengan NIK ini sudah terdaftar',
          text: `Data kolaborator "${errData.data?.nama || form.nama}" dengan NIK tersebut telah terdaftar di sistem dan otomatis dipilihkan untuk Anda.`,
          confirmButtonColor: '#126e63',
          confirmButtonText: 'Gunakan Data Ini',
        })

        const existingData = errData.data || errData.existing || {}
        if (typeof onSuccess === 'function' && existingData.ext_id) {
          onSuccess(existingData)
        }
        handleClose()
        return
      }

      // 4c. Jika Nama Mirip & Negara Sama (409 / status: "warning")
      if (errRes?.status === 409 && (errData.status === 'warning' || errData.existing)) {
        const existing = errData.existing || errData.data || {}
        const existingInfo = `${existing.nama || ''} dari ${existing.instansi || '-'} (${existing.negara || 'Indonesia'})`

        const confirmResult = await MySwal.fire({
          icon: 'question',
          title: 'Apakah ini orang yang sama?',
          text: `Ditemukan kolaborator ${existingInfo}.`,
          showCancelButton: true,
          confirmButtonColor: '#126e63',
          cancelButtonColor: '#0284c7',
          confirmButtonText: 'Pakai yang Ada',
          cancelButtonText: 'Tetap Tambah Baru',
          reverseButtons: true,
          allowOutsideClick: false,
        })

        if (confirmResult.isConfirmed) {
          // a) "Pakai yang Ada" -> pasang data res.data.existing ke baris tabel, tutup modal
          toastAlert('info', `Menggunakan data kolaborator ${existing.nama}`)
          if (typeof onSuccess === 'function' && existing.ext_id) {
            onSuccess(existing)
          }
          handleClose()
        } else if (confirmResult.dismiss === MySwal.DismissReason.cancel) {
          // b) "Tetap Tambah Baru" -> kirim ulang POST /kolabExt dengan "force": true
          await submitHandler(null, true)
        }
        return
      }

      const errorMsg =
        errData.message ||
        errData.error ||
        error.message ||
        'Gagal menambahkan kolaborator eksternal!'
      toastAlert('error', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Tambah Kolaborator Eksternal"
      show={show}
      handler={handleClose}
      size="lg"
    >
      <Form className="space-y-6 max-h-[75vh] overflow-y-auto px-2" onSubmit={e => submitHandler(e, false)}>
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
              <Form.Label>
                Instansi Asal <span className="text-danger-600">*</span>
              </Form.Label>
              <Form.Input
                type="text"
                name="instansi"
                placeholder="Contoh: Universitas Indonesia, PT Maju Bersama, dsb."
                value={form.instansi}
                onChange={inputHandler}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                NIK / No. Identitas <span className="text-danger-600">*</span>
              </Form.Label>
              <Form.Input
                type="text"
                name="nik"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Contoh: 3201012345670001"
                value={form.nik}
                onChange={inputHandler}
                required
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
              <Form.Label>Jenis Kelamin</Form.Label>
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
                {form.jenkel && (
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-danger-600 underline"
                    onClick={() => setForm(prev => ({ ...prev, jenkel: '' }))}
                  >
                    Reset
                  </button>
                )}
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
                inputMode="numeric"
                pattern="[0-9]*"
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
                  inputMode="numeric"
                  pattern="[0-9]*"
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
                  inputMode="numeric"
                  pattern="[0-9]*"
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
                  inputMode="numeric"
                  pattern="[0-9]*"
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
            onClick={handleClose}
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
  )
}
