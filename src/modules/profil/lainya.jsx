import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";
import { ROLE_ID_MAHASISWA } from "../../config/role";
import useModal from "../../hooks/useModal";
import Modal from "../../components/Modal";
import axios from "axios";
import useForm from "../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";

export default function LainyaModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);
  const { show, toggle, close } = useModal();

  const { form, inputHandler } = useForm({});

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("file", form.file);

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/profile/update-foto-narsum`,
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

        return;
      }

      toastAlert("error", error.message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        {!loading && data.role == "Mahasiswa" && (
          <Button
            as="a"
            href={`${baseURL}/lainya/edit`}
            variant="secondary"
            icon={<Icon icon="bx:edit" width={20} height={20} />}
            pill
          >
            Edit
          </Button>
        )}

        {!loading && (data.role == "Dosen" || data.role == "Dosen_Ext") && (
          <Button
            variant="primary"
            icon={<Icon icon="bx:edit" width={20} height={20} />}
            onClick={toggle}
            pill
          >
            Upload Foto Narsum
          </Button>
        )}
      </div>

      <Card className="mt-4">
        <Card.Header className="text-center">Lainya</Card.Header>
        <Card.Body className="space-y-4">
          {!loading && data.role == "Mahasiswa" && (
            <>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">Pekerjaan</Form.Label>
                <span>:</span>
                <p>{!loading && data.pekerjaan}</p>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Alamat Pekerjaan
                </Form.Label>
                <span>:</span>
                <p>{!loading && data.alamat_pekerjaan}</p>
              </Form.Group>
            </>
          )}

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">TTD</Form.Label>
            <span>:</span>
            {!loading && data.status_ttd ? (
              <img
                src={data.ttd}
                alt="TTD"
                className="w-40 h-auto object-cover border-2 border-primary-600"
              />
            ) : (
              <span>Belum ada tanda tangan</span>
            )}
          </Form.Group>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Foto Sebagai Narasumber
            </Form.Label>
            <span>:</span>
            {!loading && data.status_foto_narsum ? (
              <a
                href={data.foto_narsum}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={data.foto_narsum}
                  alt="narasumber"
                  className="w-40 h-auto object-cover border-2 border-primary-600 cursor-pointer"
                />
              </a>
            ) : (
              <span>Belum ada foto</span>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
      <Modal
        title="Update Foto Sebagai Narasumber"
        show={show}
        handler={toggle}
      >
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
    </>
  );
}
