import { Icon } from '@iconify-icon/react'
import Button from '../../../../components/Button'
import Form from '../../../../components/Form'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { MySwal, toastAlert, warningAlert } from '../../../../lib/sweetalert'

export default function OrangTuaModule({ baseURL }) {
  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/parents/admin/list`
  
  const [allData, setAllData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(DATA_URL)
      // API returns: { isSuccess: true, statusCode: 200, responseMessage: "...", data: [...] }
      const parentsList = Array.isArray(response.data.data) ? response.data.data : []
      setAllData(parentsList)
      setFilteredData(parentsList)
      setPage(1)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.name === 'AxiosError' && error.response) {
        toastAlert('error', error.response.data.message || 'Gagal mengambil data orang tua!')
      } else {
        toastAlert('error', 'Gagal mengambil data orang tua!')
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Client-side search filtering
  useEffect(() => {
    const term = searchValue.toLowerCase().trim()
    if (!term) {
      setFilteredData(allData)
    } else {
      const filtered = allData.filter(item => {
        const nama = (item.nama_lengkap || '').toLowerCase()
        const email = (item.email || '').toLowerCase()
        const nik = (item.nik || '').toLowerCase()
        const noHp = (item.no_hp || '').toLowerCase()
        return nama.includes(term) || email.includes(term) || nik.includes(term) || noHp.includes(term)
      })
      setFilteredData(filtered)
    }
    setPage(1)
  }, [searchValue, allData])

  const totalData = filteredData.length
  const pageCount = Math.ceil(totalData / pageSize) || 1
  
  // Get current page slice
  const startIndex = (page - 1) * pageSize
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize)

  const handleDelete = (id) => {
    warningAlert(async () => {
      try {
        const DELETE_URL = `${process.env.NEXT_PUBLIC_API_URL}/parents/admin/delete/${id}`
        const request = await axios({
          method: 'DELETE',
          url: DELETE_URL,
        })
        const response = await request.data
        MySwal.close()
        toastAlert('success', response.message || 'Berhasil menghapus data orang tua!', 2000)
        fetchData()
      } catch (error) {
        if (error.name === 'AxiosError' && error.response) {
          toastAlert('error', error.response.data.message || 'Gagal menghapus data orang tua!')
        } else {
          toastAlert('error', 'Terjadi kesalahan server!')
        }
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <div>
          <span>
            Total Data: <b>{totalData}</b>
          </span>
        </div>
        <div>
          <Form.Input
            type="text"
            name="search"
            placeholder="Search (Nama, Email, NIK, No. HP)..."
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
            <th className="text-sm border-2 border-white bg-gray-200 text-left">
              No
            </th>
            <th className="text-sm border-2 border-white bg-gray-200 text-left">
              NIK
            </th>
            <th className="text-sm border-2 border-white bg-gray-200 text-left">
              Nama Lengkap
            </th>
            <th className="text-sm border-2 border-white bg-gray-200 text-left">
              Email
            </th>
            <th className="text-sm border-2 border-white bg-gray-200 text-left">
              No. HP
            </th>
            <th className="text-sm border-2 border-white bg-gray-200 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loading && currentPageData.length < 1 && (
            <tr>
              <td colSpan="6" className="text-sm border-2 border-white bg-gray-50 text-center">
                Tidak ada data
              </td>
            </tr>
          )}
          {!loading &&
            currentPageData.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nik || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.nama_lengkap || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.email || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 ">
                    {row.no_hp || '-'}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/detail-orangtua/${row.id}`, '_blank')
                        }
                        variant="info"
                        icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
                      />
                      <Button.Icon
                        onClick={() =>
                          window.open(`${baseURL}/edit-orangtua/${row.id}`, '_blank')
                        }
                        variant="secondary"
                        icon={<Icon icon="bx:edit" width={20} height={20} />}
                      />
                      <Button.Icon
                        onClick={() => handleDelete(row.id)}
                        variant="danger"
                        icon={<Icon icon="mdi:trash-can-outline" width={20} height={20} />}
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
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
            iconPosition="right"
            onClick={() => setPage(page + 1)}
            disabled={page >= pageCount}
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
            max={pageCount}
            className="w-20"
            value={page}
            onChange={event =>
              setPage(Math.max(1, Math.min(event.target.valueAsNumber, pageCount)))
            }
          />
          of {pageCount}
        </div>
      </div>
    </>
  )
}
