import { useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";

const InvitePeserta = ({ data, onInvite }) => {
  const { show, toggle, close } = useModal();

  const [dosenOptions, setDosenOptions] = useState([]);
  const [selectedMhs, setSelectedMhs] = useState(""); 
  const [mhsOptions, setMhsOptions] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(""); 
  const [dataUsers, setDataUsers] = useState(null);

  const showData = async () => {
    try {
      const response = await axios.get(`${process.env.API_ENDPOINT}/users/all`);
      setDataUsers(response.data);
      const usersDosen = response.data.data.resultsDosen;
      const usersMhs = response.data.data.resultsMhs;

      const optionsDosen = usersDosen.map((dosen) => ({
        label: `${dosen.nama_lengkap}`,
        value: `${dosen.nip}`,
      }));
      const optionsMhs = usersMhs.map((mhs) => ({
        label: `${mhs.nama_lengkap}`,
        value: `${mhs.npm}`,
      }));
      setDosenOptions(optionsDosen);
      setMhsOptions(optionsMhs);          
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const INITIAL_FORM = {
    id_meeting: data && data.id ? data.id : "",
  }

  const {form, inputHandler} = useForm(INITIAL_FORM, {
    rules: [
      { field: "id_meeting", label: "id_meeting" },
    ],
  });

  const handleMhsChange = (e) => {
    setSelectedMhs(e.target.value);
    setSelectedDosen(""); 
  };

  const handleDosenChange = (e) => {
    setSelectedDosen(e.target.value);
    setSelectedMhs(""); 
  };

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
        npm: selectedMhs,
        nip_dosen: selectedDosen
      }
      const request = await axios({
        url: `${process.env.API_ENDPOINT_ABSEN}/meeting-invite/store`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      form.id_meeting = data && data.id ? data.id : "";
      setSelectedMhs("");
      setSelectedDosen("");
      setMhsOptions([]);
      setDosenOptions([]);

      toastAlert("success", "Invite successfully");
      setDataUsers(null);
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

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={showData}
        pill
      >
        Invite
      </Button>
      <Modal title="Tambah Peserta" show={dataUsers !== null} handler={() => {
          setDataUsers(null);
          setSelectedMhs("");
          setSelectedDosen("");
          setMhsOptions([]);
          setDosenOptions([]);
        }
      }>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Input
            type="hidden"
            name="id_meet"
            onChange={inputHandler}
            value={form.id_meeting}
          />
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Dosen (Pendidik) <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
                className="flex-1"
                name="nip_dosen"
                onChange={handleDosenChange}
                value={selectedDosen}
                options={dosenOptions}
                readOnly={selectedMhs !== ""}
              />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Mahasiswa <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
                className="flex-1"
                name="npm"
                onChange={handleMhsChange}
                value={selectedMhs}
                options={mhsOptions}
                readOnly={selectedDosen !== ""}
              />
          </Form.Group>
          <div className="flex gap-4 mt-12">
            <Button type="button" variant="secondary" onClick={() => {
              setDataUsers(null);
              setSelectedMhs("");
              setSelectedDosen("");
              setMhsOptions([]);
              setDosenOptions([]);
              }}>
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

export default InvitePeserta;
