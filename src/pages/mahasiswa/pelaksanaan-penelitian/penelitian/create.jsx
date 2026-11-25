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
import { useKelompokBidang, useSkimKegiatan } from '../../../../repo/master-penelitian'

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
  const { data: listKelompokBidang } = useKelompokBidang([user])
  const { data: listSkimKegiatan } = useSkimKegiatan([user])

  const kelompokBidangOptions = (listKelompokBidang || []).map(item => ({
    label: item.nama,
    value: item.id,
  }))

  const skimKegiatanOptions = (listSkimKegiatan || []).map(item => ({
    label: item.nama,
    value: item.id,
  }))

  const tahunOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
    item => ({
      label: String(item),
      value: String(item),
    }),
  )

  const kategoriPublikasiOptions = (kategoriPublikasi || []).map(item => ({
    label: `${item.nama_kategori} - ${item.tingkatan}`,
    value: item.id,
  }))

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
              <div className="flex-1">
                <Form.Combobox
                  name="kategori_id"
                  value={form.kategori_id}
                  options={kategoriPublikasiOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      kategori_id: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Kategori Publikasi --"
                  isClearable
                />
              </div>
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
                  name="kelompok_bidang"
                  value={form.kelompok_bidang_id || form.kelompok_bidang}
                  options={kelompokBidangOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      kelompok_bidang: selected?.label || '',
                      kelompok_bidang_id: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Kelompok Bidang --"
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
                  name="jenis_skim"
                  value={form.skim_id || form.jenis_skim}
                  options={skimKegiatanOptions}
                  onChange={selected => {
                    setForm(state => ({
                      ...state,
                      jenis_skim: selected?.label || '',
                      skim_id: selected?.value || '',
                    }))
                  }}
                  placeholder="-- Pilih Jenis Skim --"
                  isClearable
                />
              </div>
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
              <Form.Label className="min-w-[18rem]">Dana Institusi Lainnya</Form.Label>
              <span>:</span>
              <div className="flex-1">
                <Form.Input
                  type="number"
                  min="0"
                  className="w-full"
                  name="dana_institusi_lainnya"
                  onChange={inputHandler}
                  value={form.dana_institusi_lainnya}
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
