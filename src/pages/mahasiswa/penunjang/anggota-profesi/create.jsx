import { useRouter } from 'next/router'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useMenu from '../../../../hooks/useMenu'
import useUser from '../../../../hooks/useUser'
import useCRUD from '../../../../hooks/useCRUD'
import useKategoriProfesi from '../../../../repo/kategori-profesi'
import { getMonthOptions, getYearOptions } from '../../../../repo/bulan-tahun'
import { Loading } from '../../../../components/Loading'

export default function AnggotaProfesiCreate() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penunjang/addProfesi`
  const INITIAL_FORM = {
    kategori_id: '',
    nama_organisasi: '',
    peran: '',
    mulai_tahun: '',
    mulai_bulan: '',
    selesai_tahun: '',
    selesai_bulan: '',
    instansi_prof: '',
  }

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: 'nama_organisasi', label: 'Nama Organisasi' },
      { field: 'peran', label: 'Peran' },
      { field: 'mulai_tahun', label: 'Mulai Keanggotaan' },
      { field: 'mulai_bulan', label: 'Mulai Keanggotaan' },
      { field: 'selesai_tahun', label: 'Selesai Keanggotaan' },
      { field: 'selesai_bulan', label: 'Selesai Keanggotaan' },
      { field: 'instansi_prof', label: 'Instansi Profesi' },
    ],
    success: () => router.push(prefix + menu.url),
  })

  const { form, inputHandler } = formdata

  const { data: kategoriProfesi, isLoading: isLoadingKategoriProfesi } = useKategoriProfesi([user])

  const bulanOptions = getMonthOptions()
  const tahunOptions = getYearOptions()

  if ([user, menu, isLoadingKategoriProfesi].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Anggota Profesi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Profesi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                onChange={inputHandler}
                options={
                  kategoriProfesi &&
                  kategoriProfesi.map(item => ({
                    label: `${item.nama_kategori}`,
                    value: item.id,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Organisasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_organisasi"
                onChange={inputHandler}
                value={form.nama_organisasi}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Peran <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="peran"
                onChange={inputHandler}
                value={form.peran}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Mulai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="mulai_tahun"
                value={form.mulai_tahun}
                onChange={inputHandler}
                options={tahunOptions}
                required
              />
              <Form.Select
                className="flex-1"
                name="mulai_bulan"
                value={form.mulai_bulan}
                onChange={inputHandler}
                options={bulanOptions}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Selesai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="selesai_tahun"
                value={form.selesai_tahun}
                onChange={inputHandler}
                options={tahunOptions}
                required
              />
              <Form.Select
                className="flex-1"
                name="selesai_bulan"
                value={form.selesai_bulan}
                onChange={inputHandler}
                options={bulanOptions}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Instansi Profesi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="instansi_prof"
                onChange={inputHandler}
                value={form.instansi_prof}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Unggah File <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="file_profesi"
                onChange={inputHandler}
                required
              />
            </Form.Group>
          </Card.Body>
        </Card>
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
