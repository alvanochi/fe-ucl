import { Icon } from '@iconify-icon/react'
import Button from '../../../../../components/Button'
import Card from '../../../../../components/Card'
import Form from '../../../../../components/Form'
import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import useMenu from '../../../../../hooks/useMenu'
import useUser from '../../../../../hooks/useUser'
import KolabolatorEksternal from '../../../../../modules/pelaksanaan-penelitian/penelitian/kolaborator-eksternal'
import UploadDokumen from '../../../../../modules/pelaksanaan-penelitian/penelitian/upload-dokumen'
import { useRouter } from 'next/router'
import useCRUD from '../../../../../hooks/useCRUD'
import useDosen from '../../../../../repo/dosen'
import useMahasiswa from '../../../../../repo/mahasiswa'
import date from '../../../../../utils/date'
import { useEffect } from 'react'
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from '../../../../../config/role'
import _ from 'underscore'
import Accordion from '../../../../../components/Accordion'
import { Loading } from '../../../../../components/Loading'
import axios from 'axios'
import { toastAlert, loadingAlert, MySwal } from '../../../../../lib/sweetalert'

export default function PembicaraEdit() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/detailPenelitian`
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/dokumen-penelitian`

  const INITIAL_ANGGOTA = {
    user_id: '',
    peran: '',
    status: '',
    role: '',
  }

  const INITIAL_FORM = {
    penelitian_id: '',
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
    docs: [],
  }

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
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
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler, setForm } = formdata

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user])

  const EDIT_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/editPenelitian`
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.penelitian_id}`,
    method: 'PATCH',
  }

  const findInUser = (lists, id) => lists.find(item => item.user_id == id) ?? null
  const removeFromUser = (key, index, role) =>
    setForm(state => ({
      ...state,
      [key]: state[key].filter((item, idx) => item.role == role && idx != index),
    }))

  useEffect(() => {
    if (!router.isReady || !user || !router.query.id) return
    show(router.query.id, {
      transformData: res => {
        const payload = res?.data || res || {}
        const dataPen = Array.isArray(payload.dataPenelitian)
          ? payload.dataPenelitian[0] || {}
          : payload.dataPenelitian || payload || {}

        const allAnggota = Array.isArray(payload.anggotaPenelitian)
          ? payload.anggotaPenelitian
          : []

        const allDokumen = Array.isArray(payload.dataDokumen)
          ? payload.dataDokumen
          : Array.isArray(payload.dataDok)
          ? payload.dataDok
          : Array.isArray(payload.dokumen)
          ? payload.dokumen
          : Array.isArray(payload.dokumenPenelitian)
          ? payload.dokumenPenelitian
          : []

        const dosenList = allAnggota.filter(
          item =>
            String(item.role || '').toLowerCase() === 'dosen' ||
            String(item.role || '').toLowerCase() === 'dosen_ext' ||
            String(item.role || '').toLowerCase() === 'pegawai' ||
            item.role == ROLE_ID_DOSEN ||
            (listDosen && listDosen.some(d => d.user_id == item.user_id)),
        )

        const mahasiswaList = allAnggota.filter(
          item =>
            String(item.role || '').toLowerCase() === 'mahasiswa' ||
            item.role == ROLE_ID_MAHASISWA ||
            (listMahasiswa && listMahasiswa.some(m => m.user_id == item.user_id)),
        )

        const mitraList = allAnggota.filter(
          item => String(item.role || '').toLowerCase() === 'mitra',
        )

        const lainnyaList = allAnggota.filter(
          item => String(item.role || '').toLowerCase() === 'lainnya',
        )

        return {
          ...INITIAL_FORM,
          ...dataPen,
          tgl_sk_penugasan: dataPen.tgl_sk_penugasan
            ? date.formatToInput(dataPen.tgl_sk_penugasan)
            : '',
          anggota_penelitian_dosen: dosenList,
          anggota_penelitian_mahasiswa: mahasiswaList,
          anggota_penelitian_mitra: mitraList,
          anggota_penelitian_lainnya: lainnyaList,
          docs: allDokumen,
        }
      },
    })
  }, [router.isReady, router.query.id, user])

  const DELETE_FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/deleteDokumen`

  const { destroy } = useCRUD(DELETE_FILE_URL)

  const handleSubmit = async e => {
    e.preventDefault()

    // 1. Validasi Anggota Penelitian (Wajib Minimal 1):
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

    // 2. Format Payload anggota_penelitian (status harus boolean):
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

    // 3. Kelengkapan Field Dokumen (jika ada file baru yang diunggah):
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
      loadingAlert('Harap Tunggu', 'Memproses pembaharuan data penelitian...')
      const response = await axios({
        url: `${EDIT_URL}/${form.penelitian_id}`,
        method: 'PATCH',
        data: formData,
      })

      // Jika user memilih file dokumen baru di modal, kirim langsung ke endpoint addDokumenPenelitian
      if (form.file) {
        try {
          const docFormData = new FormData()
          docFormData.append('penelitian_id', form.penelitian_id)
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
      toastAlert('success', response.data?.message || 'Data penelitian berhasil diperbarui!', 2000)
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
      <PageHeader title={`Edit ${menu.label}`} icon={menu.icon} handler={setActive} />
      <Form onSubmit={handleSubmit} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Penelitian</Card.Header>
          <Card.Body className="space-y-4">
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
              <div className="flex-1 block">
                <UploadDokumen form={form} inputHandler={inputHandler} setForm={setForm} />
                {/* <div className="space-y-2 mt-2">
									{form.docs.map((doc, index) => (
										<Accordion key={`doc-${index}`} title={`Dokumen ${index + 1}`}>
											<Form.Group className="mb-4">
												<Form.Label>Nama Dokumen</Form.Label>
												<Form.Input type="text" className="flex-1" defaultValue={doc.nama_dok} disabled />
											</Form.Group>
											<Form.Group className="mb-4">
												<Form.Label>Keterangan</Form.Label>
												<Form.Input type="text" className="flex-1" defaultValue={doc.keterangan} disabled />
											</Form.Group>
											<Form.Group className="mb-4">
												<Form.Label>Tautan Dokumen</Form.Label>
												<Form.Input type="text" className="flex-1" defaultValue={doc.tautan_dok} disabled />
											</Form.Group>
											<Form.Group className="mb-4">
												<embed src={`${FILE_URL}/${doc.file}`} className="w-full h-[256px]" />
											</Form.Group>
										</Accordion>
									))}
								</div> */}
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
                Dokumen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Dokumen</th>
              <th className="text-sm border-2 border-white bg-gray-200">Keteranagan</th>
              <th className="text-sm border-2 border-white bg-gray-200">Tautan Dokumen</th>

              <th className="text-sm border-2 border-white bg-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {form.docs.map((doc, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">{doc.nama_dok}</td>
                <td className="text-sm border-2 border-white bg-gray-50">{doc.keterangan}</td>
                <td className="text-sm border-2 border-white bg-gray-50">{doc.tautan_dok}</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${prefix + menu.url}/penelitian/dokumenEdit/${doc.dokumen_id}`}
                      variant="secondary"
                      icon={<Icon icon="bx:edit" width={20} height={20} />}
                    />
                    <Button.Icon
                      type="button"
                      variant="danger"
                      icon={
                        <Icon
                          icon="solar:trash-bin-2-bold-duotone"
                          width={20}
                          height={20}
                          onClick={() =>
                            destroy(doc.dokumen_id).then(() =>
                              router.push(
                                `${prefix + menu.url}/penelitian/edit/${form.penelitian_id}`,
                              ),
                            )
                          }
                        />
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
