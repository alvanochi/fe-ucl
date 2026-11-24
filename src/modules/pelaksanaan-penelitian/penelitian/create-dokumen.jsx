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
    const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!selectedFile) {
      setForm(state => ({ ...state, file: null }))
      return
    }

    setForm(prev => ({
      ...prev,
      file: selectedFile,
    }))
  }

  const jenisDokumenOptions = (listJenisDokumen || []).map(item => ({
    label: item.nama_jenis_dokumen || item.nama || item.label,
    value: item.jenis_dokumen_id || item.id,
  }))

  return (
    <>
      <Button.Icon
        variant="primary"
        icon={<Icon icon="typcn:plus" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Unggah Dokumen" show={show} handler={toggle}>
        <p className="text-center text-sm mb-6 text-gray-600">
          (Maksimal total ukuran file : 5 MB) Dokumen yang dilampirkan adalah dokumen yang sesuai
          dengan data penelitian yang diusulkan.
        </p>
        <Form onSubmit={submitHandler} className="space-y-4" type="formdata">
          <Form.Group>
            <Form.Label>
              File <span className="text-danger-600">*</span>
            </Form.Label>
            <small className="text-gray-500 block mb-1">
              (Jenis file: pdf, jpg, jpeg, png, doc, docx, xls, xlsx, txt)
            </small>
            <Form.Input type="file" name="file" onChange={handleFileChange} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Jenis Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Combobox
              name="jenis_dokumen_id"
              value={form.jenis_dokumen_id || ''}
              options={jenisDokumenOptions}
              onChange={selected => {
                setForm(prev => ({
                  ...prev,
                  jenis_dokumen_id: selected?.value || '',
                }))
              }}
              placeholder={
                isLoadingJenisDokumen ? 'Memuat jenis dokumen...' : '-- Pilih Jenis Dokumen --'
              }
              isClearable
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Nama Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="text"
              name="nama_dok"
              placeholder="Masukkan nama/judul dokumen"
              onChange={inputHandler}
              value={form.nama_dok || ''}
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
              placeholder="Contoh: Proposal Penelitian / Laporan"
              onChange={inputHandler}
              value={form.keterangan || ''}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tautan Dokumen</Form.Label>
            <Form.Input
              type="text"
              name="tautan_dok"
              placeholder="https://..."
              onChange={inputHandler}
              value={form.tautan_dok || ''}
            />
          </Form.Group>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" className="w-full h-12" disabled={isSubmit}>
              {isSubmit ? 'Menyimpan data...' : 'Konfirmasi'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
