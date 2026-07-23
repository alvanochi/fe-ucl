import { useState } from "react";
import axios from "axios";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import Button from "../../../../components/Button";

const CreateProgresBimbingan = ({ onAction, id, mhsid }) => {
  const { show, toggle, close } = useModal();

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    mhs_id: "",
    last_tgl: "",
    pembahasan: "",
    deskripsi: "",
    bab: "",
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [{ field: "last_tgl", label: "last_tgl" }],
    rules: [{ field: "pembahasan", label: "pembahasan" }],
    rules: [{ field: "deskripsi", label: "deskripsi" }],
    rules: [{ field: "bab", label: "bab" }],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
        pengajuan_sk_id: id,
        mhs_id: mhsid,
      };

      if (
        !requestData.last_tgl ||
        !requestData.pembahasan ||
        !requestData.deskripsi ||
        !requestData.bab ||
        !requestData.pengajuan_sk_id ||
        !requestData.mhs_id
      ) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/progres-tugas-akhir/create-progres`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      form.last_tgl = "";
      form.pembahasan = "";
      form.deskripsi = "";
      form.bab = "";

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
        Tambah Progres
      </Button>
      <Modal
        title="Tambah Progres Bimbigan"
        show={show}
        handler={toggle}
        size="lg"
      >
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Tanggal <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="last_tgl"
              onChange={inputHandler}
              value={form.last_tgl}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Bab <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="number"
              min={1}
              className="flex-1"
              name="bab"
              onChange={inputHandler}
              value={form.bab}
              required
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Pembahasan <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1 mt-2"
              rows="5"
              name="pembahasan"
              value={form.pembahasan}
              onChange={inputHandler}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Deskripsi <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1 mt-2"
              rows="5"
              name="deskripsi"
              value={form.deskripsi}
              onChange={inputHandler}
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

export default CreateProgresBimbingan;
