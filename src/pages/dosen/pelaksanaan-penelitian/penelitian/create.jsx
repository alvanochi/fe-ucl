import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import UploadDokumen from '../../../../modules/pelaksanaan-penelitian/penelitian/upload-dokumen'
import ModalKolaboratorEksternal from '../../../../modules/pelaksanaan-penelitian/penelitian/kolaborator-eksternal'
import KolaboratorExternalAutocomplete from '../../../../modules/pelaksanaan-penelitian/penelitian/kolaborator-autocomplete'
import { useRouter } from 'next/router'
import useCRUD from '../../../../hooks/useCRUD'
import { useState, useEffect } from 'react'
import useDosen from '../../../../repo/dosen'
import useMahasiswa from '../../../../repo/mahasiswa'
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from '../../../../config/role'
import { Loading } from '../../../../components/Loading'
import axios from 'axios'
import { toastAlert, loadingAlert, MySwal } from '../../../../lib/sweetalert'
import {
  useKelompokBidang,
  useSkimKegiatan,
  useJenisDokumen,
  useKolaboratorExternal,
} from '../../../../repo/master-penelitian'

export default function PenelitianCreate() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/addPenelitian`

  const INITIAL_ANGGOTA = {
    user_id: '',
    peran: '',
    status: true,
    role: '',
  }

  const INITIAL_EXTERNAL = {
    ext_id: '',
    nama: '',
    peran: '',
    status: true,
    role: 'External',
  }

  const INITIAL_FORM = {
    kategori_id: '7d72e996-05de-4c76-99d1-8aa174e8c2e6',
    judul_kegiatan: '',
    kelompok_bidang: '',
    kelompok_bidang_id: '',
    skim_id: '',
    tahun_pelaksanaan_ke: 1,
    lokasi_kegiatan: '',
    tahun_usulan: '',
    tahun_kegiatan: '',
    tahun_pelaksanaan: '',
    dana_dikti: 0,
    dana_perguruan_tinggi: 0,
    dana_institusi_lain: 0,
    lama_kegiatan: '',
    no_sk_penugasan: '',
    tgl_sk_penugasan: '',
    file: null,
    nama_dok: '',
    keterangan: '',
    tautan_dok: '',
    jenis_dokumen_id: '',
    anggota_penelitian_dosen: [],
    anggota_penelitian_mahasiswa: [],
    anggota_penelitian_external: [],
  }

  const { formdata } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler, setForm } = formdata

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user])
  const { data: listKelompokBidang, isLoading: isLoadingKelompokBidang } = useKelompokBidang([user])
  const { data: listSkimKegiatan, isLoading: isLoadingSkimKegiatan } = useSkimKegiatan([user])
  const { data: listJenisDokumen } = useJenisDokumen([user])
  const {
    data: listKolabExternal,
    isLoading: isLoadingKolabExternal,
    mutate: mutateKolabExternal,
  } = useKolaboratorExternal([user])

  const [showModalKolab, setShowModalKolab] = useState(false)
  const [activeRowKolabIndex, setActiveRowKolabIndex] = useState(null)
  const [modalInitialNama, setModalInitialNama] = useState('')

  const removeFromUser = (key, index, role) =>
    setForm(state => ({
      ...state,
      [key]: state[key].filter((item, idx) => item.role == role && idx != index),
    }))

  useEffect(() => {
    if (!user) return
    setForm(state => ({
      ...state,
      [`anggota_penelitian_${String(user?.role).toLowerCase()}`]: [
        { ...INITIAL_ANGGOTA, user_id: user?.user_id, role: user?.role },
      ],
    }))
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()

    // 1. Validasi Master Dropdown
    if (!form.kelompok_bidang_id) {
      toastAlert('error', 'Kelompok Bidang wajib dipilih!')
      return
    }
    if (!form.skim_id) {
      toastAlert('error', 'Jenis Skim wajib dipilih!')
      return
    }

    // 2. Validasi Dokumen Penelitian
    if (!form.file) {
      toastAlert(
        'error',
        'Dokumen penelitian wajib diunggah! Silakan klik tombol Unggah Dokumen Baru.',
      )
      return
    }
    if (!form.jenis_dokumen_id) {
      toastAlert('error', 'Jenis Dokumen wajib dipilih!')
      return
    }
    if (!form.nama_dok || form.nama_dok.trim() === '') {
      toastAlert('error', 'Nama Dokumen wajib diisi!')
      return
    }
    if (!form.keterangan || form.keterangan.trim() === '') {
      toastAlert('error', 'Keterangan Dokumen wajib diisi!')
      return
    }

    // 3. Validasi Anggota Penelitian (Dosen, Mahasiswa, atau Kolaborator External)
    const validDosen = (form.anggota_penelitian_dosen || []).filter(
      item => item.user_id && String(item.user_id).trim() !== '',
    )
    const validMahasiswa = (form.anggota_penelitian_mahasiswa || []).filter(
      item => item.user_id && String(item.user_id).trim() !== '',
    )
    const validExternal = (form.anggota_penelitian_external || []).filter(
      item =>
        (item.nama && item.nama.trim() !== '') ||
        (item.ext_id && String(item.ext_id).trim() !== ''),
    )

    if (validDosen.length + validMahasiswa.length + validExternal.length === 0) {
      toastAlert(
        'error',
        'Anggota penelitian wajib ditambahkan minimal 1 orang (Dosen, Mahasiswa, atau Kolaborator External)!',
      )
      return
    }

    const toBoolean = val =>
      Boolean(
        val === true ||
          val === 'Aktif' ||
          val === '1' ||
          val === 1 ||
          val === 'true',
      )

    // 4. Gabungkan seluruh anggota (user_id & external) menjadi satu array anggota_penelitian
    const daftarAnggotaDipilih = [
      ...validDosen.map(item => ({
        user_id: String(item.user_id),
        peran: String(item.peran || 'anggota'),
        status: toBoolean(item.status),
      })),
      ...validMahasiswa.map(item => ({
        user_id: String(item.user_id),
        peran: String(item.peran || 'anggota'),
        status: toBoolean(item.status),
      })),
      ...validExternal.map(item => ({
        nama: String(item.nama || item.ext_id || ''),
        ext_id: item.ext_id ? String(item.ext_id) : undefined,
        peran: String(item.peran || 'anggota'),
        status: toBoolean(item.status),
        role: 'External',
      })),
    ]

    const formData = new FormData()
    formData.append('kategori_id', form.kategori_id || '7d72e996-05de-4c76-99d1-8aa174e8c2e6')
    formData.append('judul_kegiatan', form.judul_kegiatan || '')
    formData.append('kelompok_bidang_id', form.kelompok_bidang_id)
    if (form.kelompok_bidang) {
      formData.append('kelompok_bidang', form.kelompok_bidang)
    }
    formData.append('skim_id', form.skim_id)
    formData.append('tahun_pelaksanaan_ke', Number(form.tahun_pelaksanaan_ke) || 1)
    formData.append('lokasi_kegiatan', form.lokasi_kegiatan || '')
    formData.append('tahun_usulan', form.tahun_usulan || '')
    formData.append('tahun_kegiatan', form.tahun_kegiatan || '')
    formData.append('tahun_pelaksanaan', form.tahun_pelaksanaan || '')
    formData.append('dana_dikti', form.dana_dikti || 0)
    formData.append('dana_perguruan_tinggi', form.dana_perguruan_tinggi || 0)
    formData.append('dana_institusi_lain', form.dana_institusi_lain || 0)
    formData.append('lama_kegiatan', form.lama_kegiatan || '')
    formData.append('no_sk_penugasan', form.no_sk_penugasan || '')
    formData.append('tgl_sk_penugasan', form.tgl_sk_penugasan || '')

    formData.append('anggota_penelitian', JSON.stringify(daftarAnggotaDipilih))

    // Kelengkapan Field Dokumen (langsung diproses oleh addDataPenelitian di BE)
    if (form.file) {
      formData.append('file', form.file)
      formData.append('nama_dok', form.nama_dok?.trim() || form.file.name)
      formData.append('keterangan', form.keterangan?.trim() || 'Dokumen Penelitian')
      formData.append('tautan_dok', form.tautan_dok?.trim() || '')
      if (form.jenis_dokumen_id) {
        formData.append('jenis_dokumen_id', form.jenis_dokumen_id)
      }
    }

    try {
      loadingAlert('Harap Tunggu', 'Memproses pengiriman data penelitian...')
      const response = await axios.post(API_URL, formData)
      MySwal.close()
      toastAlert('success', response.data?.message || 'Data penelitian berhasil ditambahkan!', 2000)
      router.push(prefix + menu.url)
    } catch (error) {
      MySwal.close()
      const errorMsg = error.response?.data?.message || error.message || 'Internal Server Error!'
      toastAlert('error', errorMsg)
    }
  }

  if ([user, menu, isDosenLoading, isMahasiswaLoading].some(item => item == null))
    return <Loading />

  const kelompokBidangOptions = (listKelompokBidang || []).map(item => ({
    label: item.nama,
    value: item.id,
  }))

  const skimKegiatanOptions = (listSkimKegiatan || []).map(item => ({
    label: item.nama,
    value: item.id,
  }))

  const kolabItems = Array.isArray(listKolabExternal)
    ? listKolabExternal
    : Array.isArray(listKolabExternal?.data)
    ? listKolabExternal.data
    : []

  const handleOpenModalKolab = (searchQuery = '', rowIndex = null) => {
    setModalInitialNama(searchQuery || '')
    setActiveRowKolabIndex(rowIndex)
    setShowModalKolab(true)
  }

  const handleKolabCreated = kolabData => {
    if (mutateKolabExternal) mutateKolabExternal()
    if (activeRowKolabIndex !== null && activeRowKolabIndex !== undefined) {
      setForm(state => {
        const updated = [...(state.anggota_penelitian_external || [])]
        if (updated[activeRowKolabIndex]) {
          updated[activeRowKolabIndex] = {
            ...updated[activeRowKolabIndex],
            ext_id: kolabData.ext_id || '',
            nama: kolabData.nama || '',
          }
        }
        return { ...state, anggota_penelitian_external: updated }
      })
    } else {
      setForm(state => ({
        ...state,
        anggota_penelitian_external: [
          ...(state.anggota_penelitian_external || []),
          {
            ...INITIAL_EXTERNAL,
            ext_id: kolabData.ext_id || '',
            nama: kolabData.nama || '',
            peran: '',
          },
        ],
      }))
    }
  }

  const peranOptions = [
    { label: 'Ketua', value: 'ketua' },
    { label: 'Anggota', value: 'anggota' },
  ]

  const tahunOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
    item => ({
      label: String(item),
      value: String(item),
    }),
  )

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={handleSubmit} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Penelitian</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Input
                type="hidden"
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_kegiatan"
                onChange={inputHandler}
                value={form.judul_kegiatan}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kelompok Bidang <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="kelompok_bidang_id"
                  value={form.kelompok_bidang_id}
                  options={kelompokBidangOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      kelompok_bidang_id: selected?.value || '',
                      kelompok_bidang: selected?.label || '',
                    }))
                  }}
                  placeholder={
                    isLoadingKelompokBidang
                      ? 'Memuat kelompok bidang...'
                      : '-- Pilih Kelompok Bidang --'
                  }
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Skim <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="skim_id"
                  value={form.skim_id}
                  options={skimKegiatanOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      skim_id: selected?.value || '',
                    }))
                  }}
                  placeholder={
                    isLoadingSkimKegiatan ? 'Memuat jenis skim...' : '-- Pilih Jenis Skim --'
                  }
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan Ke <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                min="1"
                className="flex-1"
                name="tahun_pelaksanaan_ke"
                onChange={inputHandler}
                value={form.tahun_pelaksanaan_ke}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Lokasi Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lokasi_kegiatan"
                onChange={inputHandler}
                value={form.lokasi_kegiatan}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Usulan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="tahun_usulan"
                  value={form.tahun_usulan}
                  options={tahunOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      tahun_usulan: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Tahun Usulan --"
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="tahun_kegiatan"
                  value={form.tahun_kegiatan}
                  options={tahunOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      tahun_kegiatan: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Tahun Kegiatan --"
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Combobox
                  name="tahun_pelaksanaan"
                  value={form.tahun_pelaksanaan}
                  options={tahunOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      tahun_pelaksanaan: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Tahun Pelaksanaan --"
                  isClearable
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Dikti</Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Input
                  type="number"
                  min="0"
                  className="w-full"
                  name="dana_dikti"
                  onChange={inputHandler}
                  value={form.dana_dikti}
                  placeholder="0"
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Perguruan Tinggi</Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Input
                  type="number"
                  min="0"
                  className="w-full"
                  name="dana_perguruan_tinggi"
                  onChange={inputHandler}
                  value={form.dana_perguruan_tinggi}
                  placeholder="0"
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Institusi Lain</Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Input
                  type="number"
                  min="0"
                  className="w-full"
                  name="dana_institusi_lain"
                  onChange={inputHandler}
                  value={form.dana_institusi_lain}
                  placeholder="0"
                />
              </div>
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Lama Kegiatan (Tahun) <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lama_kegiatan"
                onChange={inputHandler}
                value={form.lama_kegiatan}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_sk_penugasan"
                onChange={inputHandler}
                value={form.no_sk_penugasan}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk_penugasan"
                onChange={inputHandler}
                value={form.tgl_sk_penugasan}
                required
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1 flex items-center gap-3">
                <UploadDokumen
                  form={form}
                  inputHandler={inputHandler}
                  setForm={setForm}
                  listJenisDokumen={listJenisDokumen}
                />
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Tabel Anggota Dosen */}
        <table
          className="w-full border-collapse rounded-2xl overflow-visible shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Anggota Dosen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200 text-left">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-left w-64">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-28">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-16"></th>
            </tr>
          </thead>
          <tbody>
            {form.anggota_penelitian_dosen.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    name={`anggota_penelitian_dosen.${index}.user_id`}
                    value={form.anggota_penelitian_dosen[index].user_id}
                    options={
                      listDosen &&
                      listDosen.map(dosen => ({
                        label: dosen.nama_lengkap,
                        value: dosen.user_id,
                      }))
                    }
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...state.anggota_penelitian_dosen]
                        updated[index] = {
                          ...updated[index],
                          user_id: selected?.value || '',
                        }
                        return { ...state, anggota_penelitian_dosen: updated }
                      })
                    }}
                    placeholder="-- Cari / Pilih Dosen --"
                    isClearable
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    name={`anggota_penelitian_dosen.${index}.peran`}
                    value={form.anggota_penelitian_dosen[index].peran}
                    options={peranOptions}
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...state.anggota_penelitian_dosen]
                        updated[index] = {
                          ...updated[index],
                          peran: selected?.value || '',
                        }
                        return { ...state, anggota_penelitian_dosen: updated }
                      })
                    }}
                    placeholder="-- Pilih Peran --"
                    isClearable
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      checked={Boolean(form.anggota_penelitian_dosen[index]?.status)}
                      onChange={e => {
                        const val = e.target.checked
                        setForm(state => {
                          const updated = [...state.anggota_penelitian_dosen]
                          updated[index] = { ...updated[index], status: val }
                          return { ...state, anggota_penelitian_dosen: updated }
                        })
                      }}
                    />{' '}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    {(index > 0 || user?.role != ROLE_ID_DOSEN) && (
                      <Button.Icon
                        type="button"
                        variant="danger"
                        icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                        onClick={() => removeFromUser('anggota_penelitian_dosen', index, 'Dosen')}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                <Button
                  type="button"
                  variant="primary"
                  className="mx-auto"
                  onClick={() =>
                    setForm(state => ({
                      ...state,
                      anggota_penelitian_dosen: [
                        ...state.anggota_penelitian_dosen,
                        { ...INITIAL_ANGGOTA, role: 'Dosen' },
                      ],
                    }))
                  }
                >
                  Tambah Anggota
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Tabel Anggota Mahasiswa */}
        <table
          className="w-full border-collapse rounded-2xl overflow-visible shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Anggota Mahasiswa
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200 text-left">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-left w-64">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-28">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-16"></th>
            </tr>
          </thead>
          <tbody>
            {form.anggota_penelitian_mahasiswa.map((item, index) => (
              <tr key={`anggota-mahasiswa-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    name={`anggota_penelitian_mahasiswa.${index}.user_id`}
                    value={form.anggota_penelitian_mahasiswa[index].user_id}
                    options={
                      listMahasiswa &&
                      listMahasiswa.map(mhs => ({
                        label: mhs.nama_lengkap,
                        value: mhs.user_id,
                      }))
                    }
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...state.anggota_penelitian_mahasiswa]
                        updated[index] = {
                          ...updated[index],
                          user_id: selected?.value || '',
                        }
                        return { ...state, anggota_penelitian_mahasiswa: updated }
                      })
                    }}
                    placeholder="-- Cari / Pilih Mahasiswa --"
                    isClearable
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    name={`anggota_penelitian_mahasiswa.${index}.peran`}
                    value={form.anggota_penelitian_mahasiswa[index].peran}
                    options={peranOptions}
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...state.anggota_penelitian_mahasiswa]
                        updated[index] = {
                          ...updated[index],
                          peran: selected?.value || '',
                        }
                        return { ...state, anggota_penelitian_mahasiswa: updated }
                      })
                    }}
                    placeholder="-- Pilih Peran --"
                    isClearable
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      checked={Boolean(form.anggota_penelitian_mahasiswa[index]?.status)}
                      onChange={e => {
                        const val = e.target.checked
                        setForm(state => {
                          const updated = [...state.anggota_penelitian_mahasiswa]
                          updated[index] = { ...updated[index], status: val }
                          return { ...state, anggota_penelitian_mahasiswa: updated }
                        })
                      }}
                    />{' '}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    {(index > 0 || user?.role != ROLE_ID_MAHASISWA) && (
                      <Button.Icon
                        type="button"
                        variant="danger"
                        icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                        onClick={() =>
                          removeFromUser('anggota_penelitian_mahasiswa', index, 'Mahasiswa')
                        }
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                <Button
                  type="button"
                  variant="primary"
                  className="mx-auto"
                  onClick={() =>
                    setForm(state => ({
                      ...state,
                      anggota_penelitian_mahasiswa: [
                        ...state.anggota_penelitian_mahasiswa,
                        { ...INITIAL_ANGGOTA, role: 'Mahasiswa' },
                      ],
                    }))
                  }
                >
                  Tambah Anggota
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Tabel Kolaborator External (Pilih dari Master kolab_external) */}
        <table
          className="w-full border-collapse rounded-2xl overflow-visible shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Kolaborator External
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200 text-left">Nama Kolaborator</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-left w-64">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-28">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200 text-center w-16"></th>
            </tr>
          </thead>
          <tbody>
            {(form.anggota_penelitian_external || []).map((item, index) => (
              <tr key={`anggota-external-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <KolaboratorExternalAutocomplete
                    value={item.ext_id}
                    defaultList={kolabItems}
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...(state.anggota_penelitian_external || [])]
                        updated[index] = {
                          ...updated[index],
                          ext_id: selected?.value || '',
                          nama: selected?.item?.nama || selected?.label || '',
                        }
                        return { ...state, anggota_penelitian_external: updated }
                      })
                    }}
                    onAddNew={typedText => handleOpenModalKolab(typedText, index)}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    name={`anggota_penelitian_external.${index}.peran`}
                    value={item.peran || ''}
                    options={peranOptions}
                    onChange={selected => {
                      setForm(state => {
                        const updated = [...(state.anggota_penelitian_external || [])]
                        updated[index] = {
                          ...updated[index],
                          peran: selected?.value || '',
                        }
                        return { ...state, anggota_penelitian_external: updated }
                      })
                    }}
                    placeholder="-- Pilih Peran --"
                    isClearable
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      checked={Boolean(item.status)}
                      onChange={e => {
                        const val = e.target.checked
                        setForm(state => {
                          const updated = [...(state.anggota_penelitian_external || [])]
                          updated[index] = { ...updated[index], status: val }
                          return { ...state, anggota_penelitian_external: updated }
                        })
                      }}
                    />{' '}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1 justify-center">
                    <Button.Icon
                      type="button"
                      variant="danger"
                      icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                      onClick={() =>
                        setForm(state => ({
                          ...state,
                          anggota_penelitian_external: state.anggota_penelitian_external.filter(
                            (_, idx) => idx !== index,
                          ),
                        }))
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                <Button
                  type="button"
                  variant="primary"
                  className="mx-auto"
                  onClick={() =>
                    setForm(state => ({
                      ...state,
                      anggota_penelitian_external: [
                        ...(state.anggota_penelitian_external || []),
                        { ...INITIAL_EXTERNAL },
                      ],
                    }))
                  }
                >
                  + Tambah Kolaborator External
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex gap-4 mt-4">
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>

      <ModalKolaboratorEksternal
        show={showModalKolab}
        initialNama={modalInitialNama}
        onClose={() => setShowModalKolab(false)}
        onSuccess={handleKolabCreated}
      />
    </Layout>
  )
}