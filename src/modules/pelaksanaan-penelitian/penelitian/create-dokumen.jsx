import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Form from '../../../components/Form'
import useModal from '../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useCRUD from '../../../hooks/useCRUD'
import useUser from '../../../hooks/useUser'
import { useJenisDokumen } from '../../../repo/master-penelitian'

export default function CreateDokumen({ id }) {
  const { user } = useUser()
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/addDokumenPenelitian`

  const INITIAL_FORM = {
    ...id,
    file: null,
    jenis_dokumen_id: '',
    nama_dok: '',
    keterangan: '',
    tautan_dok: '',
  }

  const { show, toggle, close } = useModal()
  const { formdata, isSubmit, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => {
      close()
      reset()
    },
  })

  const { form, inputHandler, setForm, reset } = formdata
  const { data: listJenisDokumen, isLoading: isLoadingJenisDokumen } = useJenisDokumen([user])

  // Handler khusus upload file agar nama_dok otomatis terisi dari nama berkas
  const handleFileChange = e => {
    const selectedFile = e.target.files?.[0] || null
    if (!selectedFile) {
      setForm(state => ({ ...state, file: null }))
      return
    }

    // Hilangkan ekstensi file untuk nama dokumen yang rapi (misal: "Laporan_Akhir.pdf" -> "Laporan_Akhir")
    const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '')

    setForm(state => ({
      ...state,
      file: selectedFile,
      nama_dok: state.nama_dok?.trim() ? state.nama_dok : fileNameWithoutExt,
    }))
  }

  const jenisDokumenOptions = (listJenisDokumen || []).map(item => ({
    label: item.nama,
    value: item.id,
  }))

  return (
    <>
      <Button.Icon
        variant="primary"
        icon={<Icon icon="typcn:plus" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Unggah Dokumen" show={show} handler={toggle}>
        <p className="text-center text-sm mb-8">
          (Maksimal total ukuran file dalam sekali proses upload : 5 MB) Dokumen yang dilampirkan
          adalah dokumen wajib dan dokumen yang sesuai dengan data yang diusulkan. Dokumen Wajib:
          - Ijazah - SK Penyetaraan Ijasah (PT luar negeri) - Transkrip Nilai
        </p>
        <Form onSubmit={submitHandler} className="space-y-4" type="formdata">
          <Form.Group>
            <Form.Label>
              File <span className="text-danger-600">*</span>
            </Form.Label>
            <small>
              ( Jenis file yang diijinkan : pdf, jpg, jpeg, png, doc, docx, xls, xlsx, txt )
            </small>
            <Form.Input type="file" name="file" onChange={handleFileChange} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Jenis Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Select
              name="jenis_dokumen_id"
              value={form.jenis_dokumen_id}
              onChange={inputHandler}
              options={jenisDokumenOptions}
              placeholder={
                isLoadingJenisDokumen ? 'Memuat jenis dokumen...' : '-- Pilih Jenis Dokumen --'
              }
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Nama Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="nama_dok"
              onChange={inputHandler}
              value={form.nama_dok}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Keterangan <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="keterangan"
              onChange={inputHandler}
              value={form.keterangan}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tautan Dokumen</Form.Label>
            <Form.Input
              type="text"
              name="tautan_dok"
              onChange={inputHandler}
              value={form.tautan_dok}
            />
          </Form.Group>

          <div className="flex gap-4 mt-4">
            <Button type="submit" variant="primary" className="w-full h-12" disabled={isSubmit}>
              {isSubmit ? 'Menyimpan data...' : 'Kirim'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}