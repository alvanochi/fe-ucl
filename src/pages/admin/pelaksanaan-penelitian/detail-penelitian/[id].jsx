import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import { useRouter } from 'next/router'
import useCRUD from '../../../../hooks/useCRUD'
import useDosen from '../../../../repo/dosen'
import useMahasiswa from '../../../../repo/mahasiswa'
import date from '../../../../utils/date'
import { useEffect } from 'react'
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from '../../../../config/role'
import Accordion from '../../../../components/Accordion'
import { Loading } from '../../../../components/Loading'
import {
  useKelompokBidang,
  useSkimKegiatan,
  useJenisDokumen,
  useKolaboratorExternal,
} from '../../../../repo/master-penelitian'

export default function DetailPenelitianAdmin() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/detailPenelitian`
  const FILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/dokumen-penelitian`

  const INITIAL_FORM = {
    penelitian_id: '',
    point: '',
    tingkatan: '',
    nama_kategori: '',
    judul_kegiatan: '',
    kelompok_bidang: '',
    kelompok_bidang_id: '',
    nama_kelompok_bidang: '',
    skim_id: '',
    nama_skim_kegiatan: '',
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
    anggota_penelitian_dosen: [],
    anggota_penelitian_mahasiswa: [],
    anggota_penelitian_external: [],
    docs: [],
  }

  const { formdata, show } = useCRUD(API_URL, INITIAL_FORM)
  const { form } = formdata

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([user])
  const { data: listKelompokBidang } = useKelompokBidang([user])
  const { data: listSkimKegiatan } = useSkimKegiatan([user])
  const { data: listJenisDokumen } = useJenisDokumen([user])
  const { data: listKolabExternal } = useKolaboratorExternal([user])

  const toBoolean = val =>
    Boolean(
      val === true ||
        val === 'Aktif' ||
        val === '1' ||
        val === 1 ||
        val === 'true',
    )

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

        // Filter Dosen (pastikan tidak memiliki ext_id)
        const dosenList = allAnggota
          .filter(
            item =>
              !item.ext_id &&
              (String(item.role || '').toLowerCase() === 'dosen' ||
                String(item.role || '').toLowerCase() === 'dosen_ext' ||
                String(item.role || '').toLowerCase() === 'pegawai' ||
                item.role == ROLE_ID_DOSEN ||
                (listDosen && listDosen.some(d => d.user_id == item.user_id))),
          )
          .map(item => ({
            ...item,
            status: toBoolean(item.status),
          }))

        // Filter Mahasiswa (pastikan tidak memiliki ext_id)
        const mahasiswaList = allAnggota
          .filter(
            item =>
              !item.ext_id &&
              (String(item.role || '').toLowerCase() === 'mahasiswa' ||
                item.role == ROLE_ID_MAHASISWA ||
                (listMahasiswa && listMahasiswa.some(m => m.user_id == item.user_id))),
          )
          .map(item => ({
            ...item,
            status: toBoolean(item.status),
          }))

        // Filter Kolaborator External
        const externalList = allAnggota
          .filter(
            item =>
              (item.ext_id != null && String(item.ext_id).trim() !== '') ||
              String(item.role || '').toLowerCase() === 'external' ||
              String(item.role || '').toLowerCase() === 'mitra' ||
              String(item.role || '').toLowerCase() === 'lainnya' ||
              (!item.user_id && item.nama),
          )
          .map(item => ({
            ext_id: item.ext_id,
            nama: item.nama || item.nama_external || item.nama_lengkap || '',
            negara: item.negara_external || '',
            email: item.email_external || '',
            peran: item.peran || 'anggota',
            status: toBoolean(item.status),
          }))

        return {
          ...INITIAL_FORM,
          ...dataPen,
          nama_kategori: dataPen.nama_kategori || '',
          tingkatan: dataPen.tingkatan || '',
          point: dataPen.point !== undefined && dataPen.point !== null ? dataPen.point : '',
          tahun_pelaksanaan_ke: dataPen.tahun_pelaksanaan_ke || 1,
          dana_institusi_lain:
            dataPen.dana_institusi_lain ?? dataPen.dana_institusi_lainnya ?? 0,
          tgl_sk_penugasan: dataPen.tgl_sk_penugasan
            ? date.formatToInput(dataPen.tgl_sk_penugasan)
            : '',
          anggota_penelitian_dosen: dosenList,
          anggota_penelitian_mahasiswa: mahasiswaList,
          anggota_penelitian_external: externalList,
          docs: allDokumen,
        }
      },
    })
  }, [router.isReady, router.query.id, user])

  if ([user, menu, isDosenLoading, isMahasiswaLoading].some(item => item == null))
    return <Loading />

  // Resolusi label Kelompok Bidang & Jenis Skim (dari LEFT JOIN backend atau lookup master)
  const matchedKelompokBidang = (listKelompokBidang || []).find(
    item => item.id == form.kelompok_bidang_id,
  )
  const displayKelompokBidang =
    form.nama_kelompok_bidang ||
    matchedKelompokBidang?.nama ||
    (typeof form.kelompok_bidang === 'string' ? form.kelompok_bidang : '') ||
    '-'

  const matchedSkim = (listSkimKegiatan || []).find(item => item.id == form.skim_id)
  const displaySkim =
    form.nama_skim_kegiatan || matchedSkim?.nama || form.jenis_skim || '-'

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form type="formdata">
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
                value={form.judul_kegiatan || ''}
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
                value={displayKelompokBidang}
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
                name="skim_id"
                value={displaySkim}
                disabled
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan Ke <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="tahun_pelaksanaan_ke"
                value={form.tahun_pelaksanaan_ke || 1}
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
                value={form.lokasi_kegiatan || ''}
                disabled
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Usulan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_usulan"
                value={form.tahun_usulan || ''}
                disabled
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_kegiatan"
                value={form.tahun_kegiatan || ''}
                disabled
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_pelaksanaan"
                value={form.tahun_pelaksanaan || ''}
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
                value={form.dana_dikti ?? 0}
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
                value={form.dana_perguruan_tinggi ?? 0}
                disabled
              />
            </Form.Group>

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Dana Institusi Lain</Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                min="0"
                className="flex-1"
                name="dana_institusi_lain"
                value={form.dana_institusi_lain ?? 0}
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
                value={form.lama_kegiatan || ''}
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
                value={form.no_sk_penugasan || ''}
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
                value={form.tgl_sk_penugasan || ''}
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
                  {(form.docs || []).map((doc, index) => {
                    const matchedJenisDok = (listJenisDokumen || []).find(
                      jd => jd.id == doc.jenis_dokumen_id,
                    )
                    const displayJenisDok =
                      doc.nama_jenis_dokumen || matchedJenisDok?.nama || '-'

                    return (
                      <Accordion
                        key={`doc-${index}`}
                        title={`Dokumen ${index + 1}: ${doc.nama_dok || 'Dokumen Pendukung'}`}
                        show={false}
                      >
                        <Form.Group className="mb-4">
                          <Form.Label>Jenis Dokumen</Form.Label>
                          <Form.Input
                            type="text"
                            className="flex-1"
                            value={displayJenisDok}
                            disabled
                          />
                        </Form.Group>
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
                                href={
                                  doc.tautan_dok.startsWith('http')
                                    ? doc.tautan_dok
                                    : `https://${doc.tautan_dok}`
                                }
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
                            <embed
                              src={`${FILE_URL}/${doc.file}`}
                              className="w-full h-[256px] rounded border"
                            />
                          </Form.Group>
                        )}
                      </Accordion>
                    )
                  })}
                </div>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Tabel Anggota Dosen */}
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={3} className="text-sm border-2 border-white bg-gray-50">
                Anggota Dosen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
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

              return (
                <tr key={`anggota-dosen-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input type="text" className="w-full" value={namaDosen} disabled />
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
                        item.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Tabel Anggota Mahasiswa */}
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={3} className="text-sm border-2 border-white bg-gray-50">
                Anggota Mahasiswa
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {(form.anggota_penelitian_mahasiswa || []).map((item, index) => {
              const namaMhs =
                item.nama ||
                item.nama_lengkap ||
                (listMahasiswa &&
                  listMahasiswa.find(m => m.user_id == item.user_id)?.nama_lengkap) ||
                item.user_id ||
                '-'
              const peranText = item.peran
                ? item.peran.charAt(0).toUpperCase() + item.peran.slice(1)
                : 'Anggota'

              return (
                <tr key={`anggota-mahasiswa-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <Form.Input type="text" className="w-full" value={namaMhs} disabled />
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
                        item.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Tabel Kolaborator External */}
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th colSpan={3} className="text-sm border-2 border-white bg-gray-50">
                Kolaborator External
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Kolaborator</th>
              <th className="text-sm border-2 border-white bg-gray-200">Nama Peran</th>
              <th className="text-sm border-2 border-white bg-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {(form.anggota_penelitian_external || []).length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-sm text-center text-gray-500 italic border-2 border-white bg-gray-50"
                >
                  Tidak ada kolaborator external.
                </td>
              </tr>
            ) : (
              (form.anggota_penelitian_external || []).map((item, index) => {
                const matchedExt = (listKolabExternal || []).find(
                  ext => ext.ext_id == item.ext_id,
                )
                const namaExt = item.nama || matchedExt?.nama || item.ext_id || '-'
                const peranText = item.peran
                  ? item.peran.charAt(0).toUpperCase() + item.peran.slice(1)
                  : 'Anggota'

                return (
                  <tr key={`anggota-external-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <Form.Input type="text" className="w-full" value={namaExt} disabled />
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
                          item.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
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
