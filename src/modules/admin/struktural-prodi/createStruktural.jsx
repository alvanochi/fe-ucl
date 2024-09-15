import { useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useForm from "../../../hooks/useForm";
import useDosen from "../../../repo/dosen";
import useDepartemen from "../../../repo/departemen";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import useJabatan from "../../../repo/jabatan";

const CreateStruktural = ({ onAction }) => {
  const { show, toggle, close } = useModal();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen();
  const { data: listDepartemen, isLoading: isDepartemenLoading } =
    useDepartemen();
  const { data: listJabatan, isLoading: isJabatanLoading } = useJabatan();

  const [selectedDosen, setSelectedDosen] = useState("");
  const [selectedDepartemen, setSelectedDepartemen] = useState("");
  const [selectedJabatan, setSelectedJabatan] = useState("");
  const [selectedNip, setSelectedNip] = useState("");
  const [keterangan, setKeterangan] = useState(null);

  const handleDosenChange = (selected) => {
    setSelectedDosen(selected?.value);
    setSelectedNip(selected?.nip);
  };
  const handleDepartemenChange = (selected) => {
    setSelectedDepartemen(selected?.value);
  };
  const handleJabatanChange = (selected) => {
    setSelectedJabatan(selected?.value);
  };

  const handleInputChangeKeterangan = (e) => {
    const { name, value } = e.target;
    setKeterangan(value);
  };

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        user_id: selectedDosen,
        nip: selectedNip,
        kode_prodi: selectedDepartemen,
        id_jabatan: selectedJabatan,
        keterangan: keterangan,
      };

      if (
        !requestData.user_id ||
        !requestData.nip ||
        !requestData.kode_prodi ||
        !requestData.id_jabatan
      ) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const request = await axios({
        url: `${process.env.API_ENDPOINT}/struktural`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      setSelectedDepartemen("");
      setSelectedDosen("");
      setSelectedNip("");
      setSelectedJabatan("");
      setKeterangan(null);

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
        Tambah
      </Button>
      <Modal title="Tambah Struktural" show={show} handler={toggle} size="lg">
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Unit <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="kode_prodi"
              onChange={handleDepartemenChange}
              value={selectedDepartemen}
              options={listDepartemen?.map((item) => ({
                label: `${item.code} - ${item.name}`,
                value: item.code,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Jabatan <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="id_jabatan"
              onChange={handleJabatanChange}
              value={selectedJabatan}
              options={listJabatan?.map((item) => ({
                label: item.nama_jabatan,
                value: item.id,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Dosen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Combobox
              name="user_id"
              onChange={handleDosenChange}
              value={selectedDosen}
              options={listDosen?.map((dosen) => ({
                label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                value: dosen.user_id,
                nip: dosen.nip,
              }))}
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">Keterangan</Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1"
              rows="5"
              name="keterangan"
              value={keterangan}
              onChange={handleInputChangeKeterangan}
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

export default CreateStruktural;
