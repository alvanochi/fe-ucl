import { useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import useDosen from "../../../../repo/dosen";
import useMahasiswa from "../../../../repo/mahasiswa";

const InvitePesertaMhs = ({ data, onInvite }) => {
  const { show, toggle, close } = useModal();

  const [selectedMhs, setSelectedMhs] = useState(""); 

  const INITIAL_FORM = {
    id_meeting: data?.id || "",
  };

  const {form, inputHandler} = useForm(INITIAL_FORM, {
    rules: [
      { field: "id_meeting", label: "id_meeting" },
    ],
  });

  const handleMhsChange = (selected) => {
    setSelectedMhs(selected?.value);
  };


  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
        npm: selectedMhs,
      };

      if(!requestData.npm){
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }
      await axios.post(`${process.env.API_ENDPOINT_ABSEN}/meeting-invite/store`, requestData);
      toastAlert("success", "Invite successfully");
      close()
      onInvite();
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

  const { data: listMahasiswa } = useMahasiswa();

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Peserta Mahasiswa
      </Button>
      <Modal title="Tambah Peserta" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Input
            type="hidden"
            name="id_meeting"
            onChange={inputHandler}
            value={form.id_meeting}
          />
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Mahasiswa <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="npm"
              onChange={handleMhsChange}
              value={selectedMhs}
              options={listMahasiswa?.map(mhs => ({
                label: mhs.nama_lengkap,
                value: mhs.npm,
              }))}
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

export default InvitePesertaMhs;
