import { useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import Form from "../../../components/Form";

const CreateKategoriLaporan = ({ onAction }) => {
  const { show, toggle, close } = useModal();

  const INITIAL_FORM = {
    nama_kategori: "",
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [{ field: "nama_kategori", label: "nama_kategori" }],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
      };

      if (!requestData.nama_kategori) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/kategori/laporan`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      form.nama_kategori = "";

      toastAlert("success", "Successfully");
      close();
      onAction();
    } catch (error) {
      if (error.name === "AxiosError") {
        toastAlert("error", error.response.data.message);

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
        Tambah Kategori
      </Button>
      <Modal title="Tambah Kategori Laporan" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Nama Kategori <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_kategori"
              onChange={inputHandler}
              value={form.nama_kategori}
              required
            />
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

export default CreateKategoriLaporan;
