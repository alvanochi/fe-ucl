import { useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";

const TambahMhs = ({ data, onTambahMhs }) => {
  const { show, toggle, close } = useModal();

  const INITIAL_FORM = {
    id_pembelajaran: data && data.id ? data.id : "",
    npm: "",
    status_absen: "1",
  }

  const {form, inputHandler} = useForm(INITIAL_FORM, {
    rules: [
      { field: "id", label: "id" },
      { field: "npm", label: "npm" },
      { field: "status_absen", label: "status_absen" },
    ],
  });
  

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
      }

      if(!requestData.status_absen || !requestData.npm){
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }
      const request = await axios({
        url: `${process.env.API_ENDPOINT_ABSEN}/absensi/store`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      form.id_pembelajaran = data && data.id ? data.id : "";
      form.npm = "";
      form.status_absen = "1";

      toastAlert("success", "Successfully");
      close();
      onTambahMhs();
    } catch (error) {
      if (error.name === "AxiosError") {
        toastAlert("error", error.message);

        return;
      }
      loadingAlert();
      MySwal.close();

      toastAlert("error", error.message);
    }
  }

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Presensi
      </Button>
      <Modal title="Tambah Mahasiswa" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Input
            type="hidden"
            name="id_pembelajaran"
            onChange={inputHandler}
            value={form.id_pembelajaran}
          />
          <Form.Group>
            <Form.Label>
              NPM <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="number"
              name="npm"
              value={form.npm}
              onChange={inputHandler}
              required
            />

          </Form.Group>
          <Form.Group className="flex items-baseline gap-2">
            <Form.Label className="min-w-[8rem] text-sm">
              Status Absen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <div className="flex gap-6">
            <Form.Label>
              <Form.Radio
                name="status_absen"
                value={1}
                onChange={inputHandler}
                checked={form.status_absen == 1}
              />
              Masuk
            </Form.Label>
            <Form.Label>
              <Form.Radio
                name="status_absen"
                value={2}
                onChange={inputHandler}
                checked={form.status_absen == 2}
              />
              Sakit / Izin
            </Form.Label>
            <Form.Label>
              <Form.Radio
                name="status_absen"
                value={0}
                onChange={inputHandler}
                checked={form.status_absen == 0}
              />
              Alfa
            </Form.Label>
            </div>
          </Form.Group>
          <div className="flex gap-4 mt-12">
            <Button type="button" variant="secondary" onClick={close}>
              Tutup
            </Button>
            <Button type="submit" variant="primary" className="w-full h-12">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TambahMhs;
