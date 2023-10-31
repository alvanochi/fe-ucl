import classNames from "classnames";
import { Icon } from "@iconify-icon/react";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import KependudukanModule from "../../../modules/profil/kependudukan";
import AlamatDanKontakModule from "../../../modules/profil/alamat-dan-kontak";
import KeluargaModule from "../../../modules/profil/keluarga";
import KepangkatanModule from "../../../modules/profil/kepangkatan";
import JabatanFungsionalModule from "../../../modules/profil/jabatan-fungsional";
import useDatatable from "../../../hooks/useDatatable";
import date from "../../../utils/date";
import useModal from "../../../hooks/useModal";
import useForm from "../../../hooks/useForm";
import Modal from "../../../components/Modal";
import axios from "axios";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";

export default function Profil() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);

  const { form, inputHandler } = useForm({});
  const { show, toggle, close } = useModal();

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("file", form.file);

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/profile/updateImage`,
        method: "PATCH",
        data: formdata,
      });
      const response = await request.data;

      if (response) {
        loadingAlert();
        MySwal.close();

        close();

        return refresh();
      }

      throw new Error(response.message);
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);
        console.error(status_code, message, data);

        return;
      }

      console.error(error.message);
    }
  }

  if ([user, menu, loading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <Head>
        <title>
          {menu.label} - {process.env.APP_NAME}
        </title>
      </Head>
      <Card>
        <Card.Header className="flex items-center font-bold text-2xl">
          <Icon icon={menu.icon} className="mr-1" />
          {menu.label}
          <Button variant="primary" className="ml-4">
            {user?.role}
          </Button>
        </Card.Header>
        <Card.Body className="flex">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-2">
              <img
                src={process.env.API_ENDPOINT + "/foto-profile/" + data.image}
                alt="Profile"
                className="w-full h-full object-cover border-2 border-primary-600"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              className="mx-auto mb-1"
              onClick={toggle}
            >
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
              <Form.Label className="min-w-[12rem]">Jenis Kelamin</Form.Label>
              <span>:</span>
              <p>{data.jenkel == "L" ? "Laki-Laki" : "Perempuan"}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Tempat Lahir</Form.Label>
              <span>:</span>
              <p>{data.tempat_lahir}</p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Tanggal Lahir</Form.Label>
              <span>:</span>
              <p>
                {data.tanggal_lahir &&
                  date.formatToID(new Date(data.tanggal_lahir))}
              </p>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">
                Nama Ibu Kandung
              </Form.Label>
              <span>:</span>
              <p>{data.ibu_kandung}</p>
            </Form.Group>
          </div>
        </Card.Body>
        <Card.Body className="flex border-t">
          {menu.submenus.map((item, index) => (
            <a
              key={`submenu-${index}`}
              href={item.url}
              className={classNames("flex-1 text-center", {
                "text-primary-600 font-bold": active.url == item.url,
                "font-medium": active.url != item.url,
              })}
              onClick={(event) => {
                event.preventDefault();
                setActive(item);
              }}
            >
              {item.label}
            </a>
          ))}
        </Card.Body>
      </Card>
      <div className="my-8">
        {active.url === "#kependudukan" && (
          <KependudukanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#alamat-dan-kontak" && (
          <AlamatDanKontakModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#keluarga" && (
          <KeluargaModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#kepangkatan" && (
          <KepangkatanModule baseURL={prefix + menu.url} />
        )}
        {active.url === "#jabatan-fungsional" && (
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
  );
}
