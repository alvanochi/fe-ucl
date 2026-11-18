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

export default function AnggotaProfesiEdit() {
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
          ]),
        },
        ['anggota_penelitian_dosen', 'anggota_penelitian_mahasiswa'],
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

  if ([user, menu, isDosenLoading, isMahasiswaLoading].some(item => item == null))
    return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4">
        <Button
          onClick={() =>
            window.open(`${`${prefix + menu.url}/penelitian/edit/${form.penelitian_id}`}`, '_blank')
          }
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Form onSubmit={event => submitHandler(event, EDIT_OPTION)} type="formdata">
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
                disabled
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
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis Skim <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="jenis_skim"
                onChange={inputHandler}
                value={form.jenis_skim}
                disabled
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
                disabled
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
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i,
                ).map(item => ({
                  label: item,
                  value: item,
                }))}
                disabled
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
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i,
                ).map(item => ({
                  label: item,
                  value: item,
                }))}
                disabled
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
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i,
                ).map(item => ({
                  label: item,
                  value: item,
                }))}
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dokumen</Form.Label>
              <span>:</span>
              <div className="flex-1 block">
                {(!form.docs || form.docs.length === 0) && (
                  <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg">
                    Tidak ada dokumen yang dilampirkan.
                  </p>
                )}
                <div className="space-y-3 mt-2">
                  {(form.docs || []).map((doc, index) => (
                    <Accordion key={`doc-${index}`} title={`Dokumen ${index + 1}: ${doc.nama_dok || 'Dokumen Pendukung'}`} show={true}>
                      <Form.Group className="mb-4">
                        <Form.Label>Nama Dokumen</Form.Label>
                        <Form.Input
                          type="text"
                          className="flex-1"
                          defaultValue={doc.nama_dok || ''}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Keterangan</Form.Label>
                        <Form.Input
                          type="text"
                          className="flex-1"
                          defaultValue={doc.keterangan || ''}
                          disabled
                        />
                      </Form.Group>
                      {doc.tautan_dok && (
                        <Form.Group className="mb-4">
                          <Form.Label>Tautan Dokumen</Form.Label>
                          <div className="flex items-center gap-2">
                            <Form.Input
                              type="text"
                              className="flex-1"
                              defaultValue={doc.tautan_dok}
                              disabled
                            />
                            <a
                              href={doc.tautan_dok.startsWith('http') ? doc.tautan_dok : `https://${doc.tautan_dok}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 whitespace-nowrap"
                            >
                              Buka Tautan
                            </a>
                          </div>
                        </Form.Group>
                      )}
                      {doc.file && (
                        <Form.Group className="mb-4">
                          <Form.Label>Berkas File</Form.Label>
                          <div className="flex items-center justify-between p-3 bg-gray-100 rounded mb-2">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-md">
                              {doc.file}
                            </span>
                            <a
                              href={`${FILE_URL}/${doc.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-primary-600 text-white rounded text-xs hover:bg-primary-700"
                            >
                              Unduh / Lihat Berkas
                            </a>
                          </div>
                          <embed src={`${FILE_URL}/${doc.file}`} className="w-full h-[256px] rounded border" />
                        </Form.Group>
                      )}
                    </Accordion>
                  ))}
                </div>
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
            {(form.anggota_penelitian_dosen || []).map((item, index) => {
              const namaDosen =
                item.nama ||
                item.nama_lengkap ||
                (listDosen && listDosen.find(d => d.user_id == item.user_id)?.nama_lengkap) ||
                item.user_id ||
                '-'
              const peranText = item.peran
                ? item.peran.charAt(0).toUpperCase() + item.peran.slice(1)
                : 'Anggota'
              const isAktif =
                item.status === true ||
                item.status === 'Aktif' ||
                item.status === '1' ||
                item.status === 'true'

              return (
                <tr key={`anggota-dosen-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input
                      type="text"
                      className="w-full"
                      value={namaDosen}
                      disabled
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input
                      type="text"
                      className="w-full capitalize"
                      value={peranText}
                      disabled
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isAktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isAktif ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                </tr>
              )
            })}
          </tbody>
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
            {(form.anggota_penelitian_mahasiswa || []).map((item, index) => {
              const namaMhs =
                item.nama ||
                item.nama_lengkap ||
                (listMahasiswa && listMahasiswa.find(m => m.user_id == item.user_id)?.nama_lengkap) ||
                item.user_id ||
                '-'
              const peranText = item.peran
                ? item.peran.charAt(0).toUpperCase() + item.peran.slice(1)
                : 'Anggota'
              const isAktif =
                item.status === true ||
                item.status === 'Aktif' ||
                item.status === '1' ||
                item.status === 'true'

              return (
                <tr key={`anggota-mahasiswa-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input
                      type="text"
                      className="w-full"
                      value={namaMhs}
                      disabled
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input
                      type="text"
                      className="w-full capitalize"
                      value={peranText}
                      disabled
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isAktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isAktif ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1"></div>
                  </td>
                </tr>
              )
            })}
          </tbody>
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
                    value={item.nama || ''}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="peran"
                    value={item.peran || 'anggota'}
                    options={[
                      { label: 'Ketua', value: 'ketua' },
                      { label: 'Anggota', value: 'anggota' },
                    ]}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      checked={item.status ?? true}
                      disabled
                    />{' '}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1"></div>
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
                    value={item.nama || ''}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 mt-4">
          <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  )
}
