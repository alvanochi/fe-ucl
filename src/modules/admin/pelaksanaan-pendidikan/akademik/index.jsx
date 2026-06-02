import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import useDatatable from '../../../../hooks/useDatatable'
import useCRUD from '../../../../hooks/useCRUD'
import Form from '../../../../components/Form'
import { useState } from 'react'
import useNewDataTableNew from '../../../../hooks/useNewDataTableNew'
import Modal from '../../../../components/Modal'
import useModal from '../../../../hooks/useModal'
import axios from 'axios'
import { MySwal, loadingAlert, toastAlert } from '../../../../lib/sweetalert'
import useForm from '../../../../hooks/useForm'

export default function AkademikModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik/for-admin`
  const IMPORT_URL = `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik/format-import`
  const DELETE_URL = `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik`

  const [searchValue, setSearchValue] = useState('')

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTableNew(DATA_URL, {}, searchValue)

  const { destroy } = useCRUD(DELETE_URL)

  const { form, inputHandler } = useForm({})
  const { show, toggle, close } = useModal()

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const formdata = new FormData()
      formdata.append('file', form.file)

      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/bimbingan-akademik/import`,
        method: 'POST',
        data: formdata,
      })
      const response = await request.data

      if (response) {
        loadingAlert()
        MySwal.close()

        close()

        return refreshNew()
      }

      throw new Error(response.message)
    } catch (error) {
      if (error.name === 'AxiosError') {
        const { status_code, message, data } = error.response.data
        toastAlert('error', message)

        return
      }

      toastAlert('error', error.message)
    }
  }

  const formatImport = async () => {
    try {
      const response = await axios.get(IMPORT_URL, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))

      const filename = 'format_import.xlsx'

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading the file:', error)
    }
  }

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="flex items-center mr-4">
          <Button
            onClick={() => window.open(`${`${baseURL}/akademik/create`}`, '_blank')}
            variant="primary"
            className="mr-4"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Tambah Bimbingan
          </Button>

          <Button
            onClick={toggle}
            variant="success"
            className="mr-4"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Import
          </Button>
        </div>

        <div className="flex-shrink">
          <Form.Input
            type="text"
            name="search"
            placeholder="Search Mahasiswa"
            style={{ width: '400px' }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Tahun Angkatan</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">Dosen</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {loadingNew && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loadingNew && dataNew && dataNew.length < 1 && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingNew &&
            dataNew &&
            dataNew.map((row, index) => {
              const startNumber = (pageNew - 1) * 10 + 1

              const rowNumber = startNumber + index
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">{rowNumber}</td>
                  <td className="text-sm border-2 border-white bg-gray-50">{row.tahun_angkatan}</td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.personal_data?.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/akademik/detail/${row.id}`, '_blank')
                        }
                        variant="info"
                        icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
                      />
                      <Button.Icon
                        onClick={() => window.open(`${baseURL}/akademik/edit/${row.id}`, '_blank')}
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                      <Button.Icon
                        variant="danger"
                        icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
                        onClick={() => destroy(row.id).then(() => refreshNew())}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <div className="flex mt-8">
        <div className="flex gap-1 ml-auto">
          <Button.Icon
            type="button"
            variant="outline-primary"
            icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
            onClick={() => setPageNew(pageNew - 1)}
            disabled={pageNew <= 1}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
            iconPosition="right"
            onClick={() => setPageNew(pageNew + 1)}
            disabled={pageNew >= pageCountNew}
            pill
          >
            Next Page
          </Button>
        </div>
        <div className="ml-auto whitespace-nowrap flex items-center gap-2">
          <p className="">Page</p>
          <Form.Input
            type="number"
            min="1"
            max={pageCountNew || 1}
            className="w-20"
            value={pageNew}
            onChange={event =>
              setPageNew(Math.max(1, Math.min(event.target.valueAsNumber, pageCountNew || 1)))
            }
          />
          of {pageCountNew || 1}
        </div>
      </div>

      <Modal title="Import" show={show} handler={toggle}>
        <div className="flex items-center mb-4">
          <h1 className="mr-4">Silahkan download format import terlebih dahulu :</h1>
          <Button.Icon
            variant="info"
            icon={<Icon icon="basil:file-download-solid" width={20} height={20} />}
            onClick={e => formatImport()}
          />
        </div>

        <hr />
        <Form onSubmit={submitHandler} className="space-y-2" type="formdata">
          <Form.Group className="mb-4 mt-2">
            <Form.Label className="pb-2 text-2xl">File</Form.Label>
            <Form.Input type="file" name="file" onChange={inputHandler} />
          </Form.Group>
          <div className="flex justify-center">
            <Button variant="primary">Import</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
