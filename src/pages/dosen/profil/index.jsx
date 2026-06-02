import classNames from 'classnames'
import { Icon } from '@iconify-icon/react'
import Head from 'next/head'
import Layout from '../../../components/Layout'
import Card from '../../../components/Card'
import useMenu from '../../../hooks/useMenu'
import useUser from '../../../hooks/useUser'
import Form from '../../../components/Form'
import Button from '../../../components/Button'
import KependudukanModule from '../../../modules/profil/kependudukan'
import AlamatDanKontakModule from '../../../modules/profil/alamat-dan-kontak'
import KeluargaModule from '../../../modules/profil/keluarga'
import KepangkatanModule from '../../../modules/profil/kepangkatan'
import JabatanFungsionalModule from '../../../modules/profil/jabatan-fungsional'
import useDatatable from '../../../hooks/useDatatable'
import date from '../../../utils/date'
import useModal from '../../../hooks/useModal'
import useForm from '../../../hooks/useForm'
import Modal from '../../../components/Modal'
import axios from 'axios'
import { MySwal, loadingAlert, toastAlert } from '../../../lib/sweetalert'
import Link from 'next/link'
import { Loading } from '../../../components/Loading'
import LainyaModule from '../../../modules/profil/lainya'
import { ROLE_ID_MAHASISWA } from '../../../config/role'

export default function Profil() {
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, active, setActive } = useMenu()

  const DATA_URL = `${process.env.NEXT_PUBLIC_API_URL}/profile/getDataPribadi`
  const { data, loading, refresh } = useDatatable(DATA_URL)

  const { form, inputHandler } = useForm({})
  const { show, toggle, close } = useModal()

  async function submitHandler(event) {
    event.preventDefault()
    try {
      const formdata = new FormData()
      formdata.append('file', form.file)

      const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/profile/updateImage`,
        method: 'PATCH',
        data: formdata,
      })
      const response = await request.data

      if (response) {
        loadingAlert()
        MySwal.close()

        close()

        return refresh()
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

  function isUserDataIncomplete(userData) {
    return (
      userData.nik == null ||
      userData.jenkel == null ||
      userData.tanggal_lahir == null ||
      userData.tempat_lahir == null ||
      userData.agama == null ||
      userData.warga_negara == null ||
      userData.email == null ||
      userData.alamat == null ||
      userData.rt == null ||
      userData.rw == null ||
      userData.desa_kelurahan == null ||
      userData.kota_kabupaten == null ||
      userData.provinsi == null ||
      userData.kode_pos == null ||
      userData.no_hp == null ||
      userData.singkat_name == null
    )
  }

  if ([user, menu, loading].some(item => item == null)) return <Loading />
  return (
    <Layout>
      <Head>
        <title>
          {menu.label ?? ''} - {process.env.APP_NAME ?? ''}
        </title>
      </Head>
      <Card>
        <Card.Header className="flex items-center font-bold text-2xl">
          <Icon icon={menu.icon} className="mr-1" />
          {menu.label}
          <Button variant="primary" className="ml-4">
            {user?.role}
          </Button>
          {isUserDataIncomplete(data) && (
            <Link
              href="/mahasiswa/profil"
              type="button"
              className="ml-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-lg uppercase"
            >
              <div className="mr-3">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M13.6086 3.247l8.1916 15.8c.0999.2.1998.5.1998.8 0 1-.7992 1.8-1.7982 1.8H3.7188c-.2997 0-.4995-.1-.7992-.2-.7992-.5-1.1988-1.5-.6993-2.4 5.3067-10.1184 8.0706-15.385 8.2915-15.8.3314-.6222.8681-.8886 1.4817-.897.6135-.008 1.273.2807 1.6151.897zM12 18.95c.718 0 1.3-.582 1.3-1.3 0-.718-.582-1.3-1.3-1.3-.718 0-1.3.582-1.3 1.3 0 .718.582 1.3 1.3 1.3zm-.8895-10.203v5.4c0 .5.4.9.9.9s.9-.4.9-.9v-5.3c0-.5-.4-.9-.9-.9s-.9.4-.9.8z"></path>
                </svg>
              </div>
              LENGKAPI DATA PRIBADI TERLEBIH DAHULU!
            </Link>
          )}
        </Card.Header>
        <Card.Body className="flex">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-2">
              <img
                src={data.image}
                alt="Profile"
                className="w-full h-full object-cover border-2 border-primary-600"
              />
            </div>
            <Button type="button" variant="primary" className="mx-auto mb-1" onClick={toggle}>
              Edit Foto Profil
            </Button>
            <Button
              as="a"
              href={`${prefix}${menu.url}/edit`}
              variant="secondary"
              className="mx-auto"
            >
              Edit Profil
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">NIK</Form.Label>
              <span>:</span>
              <p>{data.nik}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Nama</Form.Label>
              <span>:</span>
              <p>{data.nama_lengkap}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Nama Singkatan</Form.Label>
              <span>:</span>
              <p>{data.singkat_name}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Jenis Kelamin</Form.Label>
              <span>:</span>
              <p>{data.jenkel === 'L' ? 'Laki-Laki' : data.jenkel === 'P' ? 'Perempuan' : ''}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Tempat Lahir</Form.Label>
              <span>:</span>
              <p>{data.tempat_lahir}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Tanggal Lahir</Form.Label>
              <span>:</span>
              <p>{data.tanggal_lahir && date.formatToID(new Date(data.tanggal_lahir))}</p>
            </Form.Group>
            {/* <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">
                Nama Ibu Kandung
              </Form.Label>
              <span>:</span>
              <p>{data.ibu_kandung}</p>
            </Form.Group> */}
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">NIP/NIK</Form.Label>
              <span>:</span>
              <p>{data.nip}</p>
            </Form.Group>
          </div>
        </Card.Body>
        <Card.Body className="flex border-t">
          {menu.submenus.map((item, index) => (
            <a
              key={`submenu-${index}`}
              href={item.url}
              className={classNames('flex-1 text-center', {
                'text-primary-600 font-bold': active.url == item.url,
                'font-medium': active.url != item.url,
              })}
              onClick={event => {
                event.preventDefault()
                setActive(item)
              }}
            >
              {item.label}
            </a>
          ))}
        </Card.Body>
      </Card>
      <div className="my-8">
        {active.url === '#kependudukan' && <KependudukanModule baseURL={prefix + menu.url} />}
        {active.url === '#alamat-dan-kontak' && (
          <AlamatDanKontakModule baseURL={prefix + menu.url} />
        )}
        {active.url === '#keluarga' && <KeluargaModule baseURL={prefix + menu.url} />}
        {active.url === '#lainya' && <LainyaModule baseURL={prefix + menu.url} />}
        {active.url === '#kepangkatan' && <KepangkatanModule baseURL={prefix + menu.url} />}
        {active.url === '#jabatan-fungsional' && (
          <JabatanFungsionalModule baseURL={prefix + menu.url} />
        )}
      </div>
      <Modal title="Ganti Foto Profil" show={show} handler={toggle}>
        <Form onSubmit={submitHandler} className="space-y-2" type="formdata">
          <Form.Group>
            <Form.Label>File</Form.Label>
            <Form.Input type="file" name="file" onChange={inputHandler} />
          </Form.Group>
          <Form.Group>
            <Button variant="primary">Kirim</Button>
          </Form.Group>
        </Form>
      </Modal>
    </Layout>
  )
}
