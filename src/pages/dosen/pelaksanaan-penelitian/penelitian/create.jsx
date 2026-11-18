import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import UploadDokumen from '../../../../modules/pelaksanaan-penelitian/penelitian/upload-dokumen'
import { useRouter } from 'next/router'
import useCRUD from '../../../../hooks/useCRUD'
import { useEffect } from 'react'
import useDosen from '../../../../repo/dosen'
import useMahasiswa from '../../../../repo/mahasiswa'
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from '../../../../config/role'
import _ from 'underscore'
import useKategoriPublikasi from '../../../../repo/kategori-publikasi'
import { Loading } from '../../../../components/Loading'
import axios from 'axios'
import { toastAlert, loadingAlert, MySwal } from '../../../../lib/sweetalert'

export default function PenelitianCreate() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/addPenelitian`

  const INITIAL_ANGGOTA = {
    user_id: '',
    peran: '',
    status: false,
    role: '',
  }

  const INITIAL_FORM = {
    kategori_id: '7d72e996-05de-4c76-99d1-8aa174e8c2e6',
    judul_kegiatan: '',
    kelompok_bidang: '',
    jenis_skim: '',
    lokasi_kegiatan: '',
    tahun_usulan: '',
    tahun_kegiatan: '',
    tahun_pelaksanaan: '',
    dana_dikti: '',
    dana_perguruan_tinggi: '',
    dana_institusi_lainnya: '',
    lama_kegiatan: '',
    no_sk_penugasan: '',
    tgl_sk_penugasan: '',
    file: null,
    nama_dok: '',
    keterangan: '',
    tautan_dok: '',
    anggota_penelitian_dosen: [],
    anggota_penelitian_mahasiswa: [],
    anggota_penelitian_mitra: [],
    anggota_penelitian_lainnya: [],
  }

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
    transformData: data =>
      _.omit(
        {
          ...data,
          anggota_penelitian: JSON.stringify([
            ...data.anggota_penelitian_dosen.map(item => _.omit(item, ['role'])),
            ...data.anggota_penelitian_mahasiswa.map(item => _.omit(item, ['role'])),
            ...(data.anggota_penelitian_mitra || []).map(item => ({
              ..._.omit(item, ['role']),
              role: 'Mitra',
            })),
            ...(data.anggota_penelitian_lainnya || []).map(item => ({
              ..._.omit(item, ['role']),
              role: 'Lainnya',
            })),
          ]),
        },
        [
          'anggota_penelitian_dosen',
          'anggota_penelitian_mahasiswa',
          'anggota_penelitian_mitra',
          'anggota_penelitian_lainnya',
        ],
      ),
  })

  const { form, inputHandler, setForm } = formdata

  const { data: kategoriPublikasi, isLoading: isLoadingKategoriPublikasi } = useKategoriPublikasi([
    user,
  ])

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user])

  const findInUser = (lists, id) => lists.find(item => item.user_id == id) ?? null
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

    // 1. Validasi Dokumen Penelitian (Wajib Diunggah):
    if (!form.file) {
      toastAlert(
        'error',
        'Dokumen penelitian wajib diunggah! Silakan klik tombol Unggah Dokumen Baru.',
      )
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

    // 2. Validasi Anggota Penelitian (Wajib Minimal 1):
    const validDosen = (form.anggota_penelitian_dosen || []).filter(
      item => item.user_id && String(item.user_id).trim() !== '',
    )
    const validMahasiswa = (form.anggota_penelitian_mahasiswa || []).filter(
      item => item.user_id && String(item.user_id).trim() !== '',
    )

    if (validDosen.length + validMahasiswa.length === 0) {
      toastAlert(
        'error',
        'Anggota penelitian wajib ditambahkan minimal 1 orang (Dosen atau Mahasiswa)!',
      )
      return
    }

    // 3. Format Payload anggota_penelitian (status harus boolean):
    const daftarAnggotaDipilih = [
      ...validDosen.map(item => ({
        user_id: String(item.user_id),
        peran: String(item.peran || 'anggota'),
        status: Boolean(
          item.status === true ||
          item.status === 'Aktif' ||
          item.status === '1' ||
          item.status === 1 ||
          item.status === 'true'
        ),
      })),
      ...validMahasiswa.map(item => ({
        user_id: String(item.user_id),
        peran: String(item.peran || 'anggota'),
        status: Boolean(
          item.status === true ||
          item.status === 'Aktif' ||
          item.status === '1' ||
          item.status === 1 ||
          item.status === 'true'
        ),
      })),
    ]

    const formData = new FormData()
    formData.append('kategori_id', form.kategori_id || '7d72e996-05de-4c76-99d1-8aa174e8c2e6')
    formData.append('judul_kegiatan', form.judul_kegiatan || '')
    formData.append('kelompok_bidang', form.kelompok_bidang || '')
    formData.append('jenis_skim', form.jenis_skim || '')
    formData.append('lokasi_kegiatan', form.lokasi_kegiatan || '')
    formData.append('tahun_usulan', form.tahun_usulan || '')
    formData.append('tahun_kegiatan', form.tahun_kegiatan || '')
    formData.append('tahun_pelaksanaan', form.tahun_pelaksanaan || '')
    formData.append('dana_dikti', form.dana_dikti || '')
    formData.append('dana_perguruan_tinggi', form.dana_perguruan_tinggi || '')
    formData.append('dana_institusi_lainnya', form.dana_institusi_lainnya || '')
    formData.append('lama_kegiatan', form.lama_kegiatan || '')
    formData.append('no_sk_penugasan', form.no_sk_penugasan || '')
    formData.append('tgl_sk_penugasan', form.tgl_sk_penugasan || '')

    formData.append('anggota_penelitian', JSON.stringify(daftarAnggotaDipilih))

    const daftarMitra = (form.anggota_penelitian_mitra || []).filter(
      item => item.nama && item.nama.trim() !== '',
    )
    if (daftarMitra.length > 0) {
      formData.append('anggota_penelitian_mitra', JSON.stringify(daftarMitra))
    }
    const daftarLainnya = (form.anggota_penelitian_lainnya || []).filter(
      item => item.nama && item.nama.trim() !== '',
    )
    if (daftarLainnya.length > 0) {
      formData.append('anggota_penelitian_lainnya', JSON.stringify(daftarLainnya))
    }

    // 3. Kelengkapan Field Dokumen:
    if (form.file) {
      formData.append('file', form.file)
      formData.append('nama_dok', form.nama_dok?.trim() || form.file.name)
      formData.append('keterangan', form.keterangan?.trim() || 'Dokumen Penelitian')
      formData.append('tautan_dok', form.tautan_dok?.trim() || '')
    } else {
      if (form.nama_dok) formData.append('nama_dok', form.nama_dok.trim())
      if (form.keterangan) formData.append('keterangan', form.keterangan.trim())
      if (form.tautan_dok) formData.append('tautan_dok', form.tautan_dok.trim())
    }

    // 4. Penanganan Response Error dari Backend:
    try {
      loadingAlert('Harap Tunggu', 'Memproses pengiriman data penelitian...')
      const response = await axios.post(API_URL, formData)

      // Pastikan dokumen juga tersimpan ke endpoint dokumen penelitian jika ada file
      const resData = response.data?.data || response.data
      const newPenelitianId =
        resData?.penelitian_id ||
        resData?.id ||
        (Array.isArray(resData) && resData[0]?.penelitian_id) ||
        (typeof resData === 'string' ? resData : null)

      if (newPenelitianId && form.file) {
        try {
          const docFormData = new FormData()
          docFormData.append('penelitian_id', newPenelitianId)
          docFormData.append('file', form.file)
          docFormData.append('nama_dok', form.nama_dok?.trim() || form.file.name)
          docFormData.append('keterangan', form.keterangan?.trim() || 'Dokumen Penelitian')
          docFormData.append('tautan_dok', form.tautan_dok?.trim() || '')
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/penelitian/addDokumenPenelitian`,
            docFormData,
          )
        } catch (docErr) {
          console.warn('addDokumenPenelitian info:', docErr)
        }
      }

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
              <Form.Input
                type="text"
                className="flex-1"
                name="kelompok_bidang"
                onChange={inputHandler}
                value={form.kelompok_bidang}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Skim <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenis_skim"
                onChange={inputHandler}
                value={form.jenis_skim}
                options={[
                  { label: 'Hibah Nasional', value: 'Hibah Nasional' },
                  {
                    label: 'Sumber Pendanaan & Pengelolaan',
                    value: 'Sumber Pendanaan & Pengelolaan',
                  },
                  {
                    label: 'Sasaran & Jenjang Peneliti',
                    value: 'Sasaran & Jenjang Peneliti',
                  },
                ]}
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
              <Form.Select
                className="flex-1"
                name="tahun_usulan"
                onChange={inputHandler}
                value={form.tahun_usulan}
                options={Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
                  item => ({
                    label: item,
                    value: item,
                  }),
                )}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_kegiatan"
                onChange={inputHandler}
                value={form.tahun_kegiatan}
                options={Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
                  item => ({
                    label: item,
                    value: item,
                  }),
                )}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_pelaksanaan"
                onChange={inputHandler}
                value={form.tahun_pelaksanaan}
                options={Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
                  item => ({
                    label: item,
                    value: item,
                  }),
                )}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Dikti</Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                min="0"
                className="flex-1"
                name="dana_dikti"
                onChange={inputHandler}
                value={form.dana_dikti}
                placeholder="0"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Perguruan Tinggi</Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                min="0"
                className="flex-1"
                name="dana_perguruan_tinggi"
                onChange={inputHandler}
                value={form.dana_perguruan_tinggi}
                placeholder="0"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Institusi Lainnya</Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                min="0"
                className="flex-1"
                name="dana_institusi_lainnya"
                onChange={inputHandler}
                value={form.dana_institusi_lainnya}
                placeholder="0"
              />
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
                <UploadDokumen form={form} inputHandler={inputHandler} setForm={setForm} />
                {form?.file && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Berkas siap: <strong>{form.file.name || form.nama_dok}</strong>
                  </span>
                )}
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Anggota Dosen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
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
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_dosen.peran"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_dosen[index].peran}
                    options={[
                      { label: 'Ketua', value: 'ketua' },
                      { label: 'Anggota', value: 'anggota' },
                    ]}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="anggota_penelitian_dosen.status"
                      onChange={inputHandler}
                      checked={form.anggota_penelitian_dosen[index].status}
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
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Anggota Mahasiswa
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.anggota_penelitian_mahasiswa.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
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
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_mahasiswa.peran"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_mahasiswa[index].peran}
                    options={[
                      { label: 'Ketua', value: 'ketua' },
                      { label: 'Anggota', value: 'anggota' },
                    ]}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="anggota_penelitian_mahasiswa.status"
                      onChange={inputHandler}
                      checked={form.anggota_penelitian_mahasiswa[index].status}
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
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={4} className="text-sm border-2 border-white bg-gray-50">
                Anggota Lainnya
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {(form.anggota_penelitian_lainnya || []).map((item, index) => (
              <tr key={`anggota-lainnya-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Input
                    type="text"
                    className="w-full"
                    placeholder="Nama Anggota Lainnya"
                    value={item.nama || ''}
                    onChange={e => {
                      const val = e.target.value
                      setForm(state => {
                        const updated = [...(state.anggota_penelitian_lainnya || [])]
                        updated[index] = { ...updated[index], nama: val }
                        return { ...state, anggota_penelitian_lainnya: updated }
                      })
                    }}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="peran"
                    value={item.peran || 'anggota'}
                    onChange={e => {
                      const val = e.target.value
                      setForm(state => {
                        const updated = [...(state.anggota_penelitian_lainnya || [])]
                        updated[index] = { ...updated[index], peran: val }
                        return { ...state, anggota_penelitian_lainnya: updated }
                      })
                    }}
                    options={[
                      { label: 'Ketua', value: 'ketua' },
                      { label: 'Anggota', value: 'anggota' },
                    ]}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      checked={item.status ?? true}
                      onChange={e => {
                        const val = e.target.checked
                        setForm(state => {
                          const updated = [...(state.anggota_penelitian_lainnya || [])]
                          updated[index] = { ...updated[index], status: val }
                          return { ...state, anggota_penelitian_lainnya: updated }
                        })
                      }}
                    />{' '}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      type="button"
                      variant="danger"
                      icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                      onClick={() =>
                        setForm(state => ({
                          ...state,
                          anggota_penelitian_lainnya: state.anggota_penelitian_lainnya.filter(
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
                      anggota_penelitian_lainnya: [
                        ...(state.anggota_penelitian_lainnya || []),
                        { nama: '', peran: 'anggota', status: true, role: 'Lainnya' },
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
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={2} className="text-sm border-2 border-white bg-gray-50">
                Anggota Mitra
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Mitra</th>
              <th className="text-sm border-2 border-white bg-gray-200 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {(form.anggota_penelitian_mitra || []).map((item, index) => (
              <tr key={`anggota-mitra-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Input
                    type="text"
                    className="w-full"
                    placeholder="Nama Mitra"
                    value={item.nama || ''}
                    onChange={e => {
                      const val = e.target.value
                      setForm(state => {
                        const updated = [...(state.anggota_penelitian_mitra || [])]
                        updated[index] = { ...updated[index], nama: val }
                        return { ...state, anggota_penelitian_mitra: updated }
                      })
                    }}
                  />
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
                          anggota_penelitian_mitra: state.anggota_penelitian_mitra.filter(
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
              <td colSpan={2} className="text-sm border-2 border-white bg-gray-50">
                <Button
                  type="button"
                  variant="primary"
                  className="mx-auto"
                  onClick={() =>
                    setForm(state => ({
                      ...state,
                      anggota_penelitian_mitra: [
                        ...(state.anggota_penelitian_mitra || []),
                        { nama: '', role: 'Mitra' },
                      ],
                    }))
                  }
                >
                  Tambah Mitra
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
    </Layout>
  )
}
