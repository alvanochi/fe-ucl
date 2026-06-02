import { Icon } from '@iconify-icon/react'
import Button from '../../../../../components/Button'
import Card from '../../../../../components/Card'
import Form from '../../../../../components/Form'
import Layout from '../../../../../components/Layout'
import PageHeader from '../../../../../components/PageHeader'
import useMenu from '../../../../../hooks/useMenu'
import useUser from '../../../../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useDosen from '../../../../../repo/dosen'
import useCRUD from '../../../../../hooks/useCRUD'
import { Loading } from '../../../../../components/Loading'
import date from '../../../../../utils/date'
import EditNilai from '../../../../../components/EditPenilaian/edit-nilai'
import EditKomentar from '../../../../../components/EditPenilaian/edit-komentar'
import Link from 'next/link'
import EditNilaiSidang from '../../../../../components/EditPenilaian/edit-nilai-sidang'

export default function PelaksanaanSidang() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user])

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/detail-penilaian-sidang-dosen`

  const INITIAL_FORM = {
    pengajuan_sk_id: '',
    sidang_id: '',
    nama_lengkap: '',
    semester: '',
    email: '',
    no_hp: '',
    npm: '',
    judul_skripsi: '',
    link_dok_mhs_aktif: '',
    link_dok_pembayaran: '',
    sidang_pembimbing_1: '',
    sidang_pembimbing_2: '',
    sidang_pembimbing_3: null,
    sidang_status_pem_1: '',
    sidang_status_pem_2: '',
    sidang_status_pem_3: '',
    penguji_1: '',
    penguji_2: '',
    // jadwal_pelaksanaan: "",
    statusDosen: '',
    penilaian_1: '',
    penilaian_2: '',
    penilaian_3: '',
    penilaian_4: '',
    komentar_singkat: '',
    dosen_id: '',
    penilaian_sidang: null,
    statusDosen: '',
    link_draft_final_skripsi: '',
    jadwal_pelaksanaan: '',
  }

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  const CREATE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tugas-akhir/penilaian-sidang`
  const CREATE_OPTION = { url: `${CREATE_URL}`, method: 'POST' }

  useEffect(() => {
    if (router.isReady === false || !user) return
    show(router.query.id, {
      transformData: data => ({
        ...data,
        // jadwal_pelaksanaan: data.jadwal_pelaksanaan
        //   ? date.formatToInput(data.jadwal_pelaksanaan)
        //   : "",
      }),
    })
  }, [router, user])

  if ([user, menu, isDosenLoading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>Penilaian Sidang</div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Nama</Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_lengkap"
              value={form.nama_lengkap}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">NPM</Form.Label>
            <span>:</span>
            <Form.Input type="text" className="flex-1" name="npm" value={form.npm} disabled />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Judul Skripsi</Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="judul_skripsi"
              value={form.judul_skripsi}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">
              {form.statusDosen === 'penguji_1'
                ? 'Penguji 1'
                : form.statusDosen === 'penguji_2'
                  ? 'Penguji 2'
                  : form.statusDosen === 'pembimbing_1'
                    ? 'Pembimbing 1'
                    : form.statusDosen === 'pembimbing_2'
                      ? 'Pembimbing 2'
                      : form.statusDosen === 'pembimbing_3'
                        ? 'Pembimbing 3'
                        : ''}
            </Form.Label>
            <span>:</span>
            <Form.Select
              name="dosen_id"
              value={
                form.statusDosen === 'penguji_1'
                  ? form.penguji_1
                  : form.statusDosen === 'penguji_2'
                    ? form.penguji_2
                    : form.statusDosen === 'pembimbing_1'
                      ? form.sidang_pembimbing_1
                      : form.statusDosen === 'pembimbing_2'
                        ? form.sidang_pembimbing_2
                        : form.statusDosen === 'pembimbing_3'
                          ? form.sidang_pembimbing_3
                          : ''
              }
              options={
                listDosen &&
                listDosen.map(dosen => ({
                  label: dosen.nama_lengkap,
                  value: dosen.user_id,
                }))
              }
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Jadwal Pelaksanaan</Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="jadwal_pelaksanaan"
              value={form?.jadwal_pelaksanaan && date.formatToInput(form.jadwal_pelaksanaan)}
              placeholder="Diisi oleh admin"
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Link Dokumen</Form.Label>
            <span>:</span>
            <Button
              onClick={() => window.open(`${form.link_draft_final_skripsi}`, '_blank')}
              variant="primary"
              icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
              pill
            >
              Link Draft Final Skripsi
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      {form.penilaian_sidang == null &&
        form.statusDosen !== '' &&
        form.statusDosen !== 'kepala_lab' && (
          <Form onSubmit={event => submitHandler(event, CREATE_OPTION)}>
            <div className="flex justify-center">
              <Card className="mt-4 w-full">
                <Card.Header className="text-center">
                  <div>Penilaian (0-100) </div>
                </Card.Header>

                <Card.Body className="space-y-4">
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Nilai Tugas Akhir (Skripsi)
                      <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_1"
                      value={form.penilaian_1}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Presentasi</Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_2"
                      value={form.penilaian_2}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Penguasaan Materi</Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_3"
                      value={form.penilaian_3}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      <p>Penampilan (Menanggapi Pertanyaan,</p>
                      <p>Memberikan Jawaban, sistematika</p>
                      <p>
                        jawaban dan etika)
                        <span className="text-danger-600">*</span>
                      </p>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_4"
                      value={form.penilaian_4}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">Komentar Singkat</Form.Label>
                    <span>:</span>
                    <Form.Textarea
                      className="flex-1"
                      rows="5"
                      name="komentar_singkat"
                      value={form.komentar_singkat}
                      onChange={inputHandler}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
            <div className="flex gap-4 mt-4">
              <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
                Kembali
              </Button>
              {form.penilaian_sidang == null && (
                <Button type="submit" variant="primary" className="w-full h-12">
                  Konfirmasi
                </Button>
              )}
            </div>
          </Form>
        )}

      {form.penilaian_sidang && (
        <>
          <table
            className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
            cellPadding={10}
            style={{ marginTop: '20px' }}
          >
            <thead>
              <tr>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">No</div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">Aspek Penilaian</div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="gap-2 cursor-pointer">Presentase (%)</div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="gap-2 cursor-pointer">Nilai</div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="gap-2 cursor-pointer">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">1</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Nilai Tugas Akhir (Skripsi)
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">40%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Subtansi dan Orientasi Topik Penilitian"
                    data={form.penilaian_sidang?.penilaian_1}
                    name="penilaian_1"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">2</td>
                <td className="text-sm border-2 border-white bg-gray-50">Presentasi</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_2}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian"
                    data={form.penilaian_sidang?.penilaian_2}
                    name="penilaian_2"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">3</td>
                <td className="text-sm border-2 border-white bg-gray-50">Penguasaan Materi</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">40%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_3}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                    data={form.penilaian_sidang?.penilaian_3}
                    name="penilaian_3"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white bg-gray-50">4</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Penampilan (menanggapi pertanyaan, Memberikan Jawaban, sistematika jawaban dan
                  etika)
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">10%</td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_sidang?.penilaian_4}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilaiSidang
                    title="Penyajian Makalah dan Tampilan Slide"
                    data={form.penilaian_sidang?.penilaian_4}
                    name="penilaian_4"
                    id={form.penilaian_sidang?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_sidang"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Card className="mt-2">
            <div className="p-4 flex flex-col">
              <div className="flex justify-end">
                <div className="text-sm font-bold pr-10">
                  <span className="mr-2">Nilai Akhir :</span>{' '}
                  <span>{form.penilaian_sidang?.final_nilai}</span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="text-sm font-bold pr-10">
                  <span className="mr-2">Huruf Mutu :</span>{' '}
                  <span>{form.penilaian_sidang?.huruf_mutu}</span>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex">
            <div className="relative flex-1">
              <Form.Textarea
                className="mt-2"
                rows="5"
                value={`Komentar Singkat : ${form.penilaian_sidang?.komentar_singkat}`}
                disabled
              />
            </div>
            <div className="ml-4 mt-6">
              <EditKomentar
                title="Komentar Singkat"
                data={form.penilaian_sidang?.komentar_singkat}
                name="komentar_singkat"
                id={form.penilaian_sidang?.id}
                onSuccess={() => show(router.query.id)}
                db="ta_penilaian_sidang"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
              Kembali
            </Button>
          </div>
        </>
      )}

      {form.statusDosen == '' && (
        <>
          <h1 className="pt-4 text-center">Halaman tidak tersedia</h1>
          <div className="flex gap-4 mt-4">
            <Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
              Kembali
            </Button>
          </div>
        </>
      )}
    </Layout>
  )
}
