import { useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import useMahasiswa from "../../../repo/mahasiswa";
import useDosen from "../../../repo/dosen";

const CreateValidasi = ({ onAction }) => {
  const { show, toggle, close } = useModal();

  const INITIAL_FORM = {
    dosen_id: "",
    mhs_id: "",
    nama_kegiatan: "",
    link_validasi: "",
  };

  const { data: listMhs, isLoading: isMhsLoading } = useMahasiswa();
  const { data: listDosen, isLoading: isDosenLoadin } = useDosen();

  const [selectedMhs, setSelectedMhs] = useState("");
  const [selectedDosen, setSelectedDosen] = useState("");

  const handleMhsChange = (selected) => {
    setSelectedMhs(selected?.value);
  };

  const handleDosenChange = (selected) => {
    setSelectedDosen(selected?.value);
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: "nama_kegiatan", label: "nama_kegiatan" },
      { field: "link_validasi", label: "link_validasi" },
    ],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
        mhs_id: selectedMhs,
        dosen_id: selectedDosen,
      };

      if (
        !requestData.mhs_id ||
        !requestData.dosen_id ||
        !requestData.nama_kegiatan ||
        !requestData.link_validasi
      ) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/validasi/validasi-dokumen`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      form.mhs_id = "";
      form.dosen_id = "";
      form.nama_kegiatan = "";
      form.link_validasi = "";

      setSelectedMhs("");
      setSelectedDosen("");

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
        Tambah Data
      </Button>
      <Modal title="Tambah Data" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Pelaksana <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="dosen_id"
              onChange={handleDosenChange}
              value={selectedDosen}
              options={listDosen?.map((item) => ({
                label: item.nama_lengkap,
                value: item.user_id,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Tertuju <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="mhs_id"
              onChange={handleMhsChange}
              value={selectedMhs}
              options={listMhs?.map((item) => ({
                label: item.nama_lengkap,
                value: item.user_id,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Nama Kegiatan <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              rows="4"
              name="nama_kegiatan"
              onChange={inputHandler}
              value={form.nama_kegiatan}
            ></Form.Textarea>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[8rem]">
              Link Validasi <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="link_validasi"
              onChange={inputHandler}
              value={form.link_validasi}
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

export default CreateValidasi;
