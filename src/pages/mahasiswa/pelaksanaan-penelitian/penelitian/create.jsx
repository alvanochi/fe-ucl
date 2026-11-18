import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import KolabolatorEksternal from '../../../../modules/pelaksanaan-penelitian/penelitian/kolaborator-eksternal'
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
    kategori_id: '',
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
            ...data.anggota_penelitian_dosen
              .filter(item => item.user_id && String(item.user_id).trim() !== '')
              .map(item => ({
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
            ...data.anggota_penelitian_mahasiswa
              .filter(item => item.user_id && String(item.user_id).trim() !== '')
              .map(item => ({
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

  if (
    [user, menu, isDosenLoading, isMahasiswaLoading, isLoadingKategoriPublikasi].some(
      item => item == null,
    )
  )
    return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Penelitian</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Publikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                onChange={inputHandler}
                options={
                  kategoriPublikasi &&
                  kategoriPublikasi.map(item => ({
                    label: `${item.nama_kategori} - ${item.tingkatan}`,
                    value: item.id,
                  }))
                }
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
                    index={index}
                    name="anggota_penelitian_dosen.user_id"
                    onChange={selected =>
                      inputHandler({
                        target: {
                          attributes: {
                            index: {
                              value: index,
                            },
                          },
                          name: 'anggota_penelitian_dosen.user_id',
                          value: selected?.value,
                        },
                      })
                    }
                    value={form.anggota_penelitian_dosen[index].user_id}
                    options={
                      listDosen &&
                      Array.isArray(listDosen) &&
                      listDosen.map(dosen => ({
                        label: dosen.nama_lengkap,
                        value: dosen.user_id,
                      }))
                    }
                    menuTarget={document.body}
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
                    index={index}
                    name="anggota_penelitian_mahasiswa.user_id"
                    onChange={selected =>
                      inputHandler({
                        target: {
                          attributes: {
                            index: {
                              value: index,
                            },
                          },
                          name: 'anggota_penelitian_mahasiswa.user_id',
                          value: selected?.value,
                        },
                      })
                    }
                    value={form.anggota_penelitian_mahasiswa[index].user_id || ''}
                    options={
                      listMahasiswa &&
                      Array.isArray(listMahasiswa) &&
                      listMahasiswa.map(mhs => ({
                        label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                        value: mhs.user_id,
                      }))
                    }
                    menuTarget={document.body}
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
                    required
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="anggota_penelitian_mahasiswa.status"
                      onChange={inputHandler}
                      checked={form.anggota_penelitian_mahasiswa[index].status}
                      required
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
