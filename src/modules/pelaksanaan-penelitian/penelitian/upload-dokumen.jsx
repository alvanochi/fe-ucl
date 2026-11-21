import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Form from '../../../components/Form'
import useModal from '../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'
import useUser from '../../../hooks/useUser'
import { useJenisDokumen } from '../../../repo/master-penelitian'

export default function UploadDokumen({ form, inputHandler, setForm, listJenisDokumen }) {
  const { show, toggle } = useModal()
  const { user } = useUser()
  const { data: fetchedJenisDokumen, isLoading: isLoadingJenisDokumen } = useJenisDokumen(
    listJenisDokumen ? [] : [user],
  )

  const sourceJenisDokumen = listJenisDokumen || fetchedJenisDokumen || []

  const handleFileChange = e => {
    const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!selectedFile) return

    if (setForm) {
      setForm(prev => ({
        ...prev,
        file: selectedFile,
        nama_dok:
          prev.nama_dok && prev.nama_dok.trim() !== '' ? prev.nama_dok : selectedFile.name,
      }))
    } else {
      inputHandler(e)
    }
  }

  const jenisDokumenOptions = sourceJenisDokumen.map(item => ({
    label: item.nama_jenis_dokumen || item.nama || item.label,
    value: item.jenis_dokumen_id || item.id,
  }))

  return (
    <>
      <Button
        type="button"
        variant="primary"
        icon={<Icon icon="material-symbols:upload" width={20} height={20} />}
        onClick={toggle}
      >
        Unggah Dokumen Baru
      </Button>

      <Modal title="Unggah Dokumen" show={show} handler={toggle}>
        <p className="text-center text-sm mb-6 text-gray-600">
          (Maksimal total ukuran file : 5 MB) Dokumen yang dilampirkan adalah dokumen yang sesuai
          dengan data penelitian yang diusulkan.
        </p>
        <div className="space-y-4">
          <Form.Group>
            <Form.Label>
              Jenis Dokumen <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Combobox
              name="jenis_dokumen_id"
              value={form.jenis_dokumen_id || ''}
              options={jenisDokumenOptions}
              onChange={selected => {
                if (setForm) {
                  setForm(prev => ({
                    ...prev,
                    jenis_dokumen_id: selected?.value || '',
                  }))
                }
              }}
              placeholder={
                isLoadingJenisDokumen ? 'Memuat jenis dokumen...' : '-- Pilih Jenis Dokumen --'
              }
              isClearable
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              File <span className="text-danger-600">*</span>
            </Form.Label>
            <small className="text-gray-500 block mb-1">
              (Jenis file: pdf, jpg, jpeg, png, doc, docx, xls, xlsx, txt)
            </small>
            <Form.Input type="file" name="file" onChange={handleFileChange} />
            {form?.file && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-emerald-600 text-base shrink-0"
                />
                <div className="overflow-hidden">
                  <span className="font-semibold block truncate">
                    Berkas saat ini:{' '}
                    {form.file?.name ||
                      (typeof form.file === 'string' ? form.file : 'File telah dipilih')}
                  </span>
                  {form.file?.size ? (
                    <span className="text-gray-500 text-[11px]">
                      Ukuran: {(form.file.size / 1024).toFixed(1)} KB •{' '}
                    </span>
                  ) : null}
                  <span className="text-gray-500 text-[11px]">
                    Pilih file baru hanya jika ingin mengganti.
                  </span>
                </div>
              </div>
            )}
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
            <Button type="button" onClick={toggle} variant="primary" className="w-full h-12">
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}