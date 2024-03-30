import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import useDosen from "../../../repo/dosen";
import useDepartemen from "../../../repo/departemen";
import useJabatan from "../../../repo/jabatan";

const EditStruktural = ({ id, onAction }) => {
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

  const getData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.API_ENDPOINT}/struktural/${id}`
      );

      const dataResponse = response.data.data;

      setSelectedDosen(dataResponse.user_id);
      setSelectedNip(dataResponse.nip);
      setSelectedDepartemen(dataResponse.kode_prodi);
      setSelectedJabatan(dataResponse.id_jabatan);
      setKeterangan(dataResponse.keterangan);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (show && id) {
      getData(id);
    }
  }, [show, id]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        user_id: selectedDosen,
        nip: selectedNip,
        kode_prodi: selectedDepartemen,
        id_jabatan: selectedJabatan,
        keterangan: keterangan,
      };
      const response = await axios.put(
        `${process.env.API_ENDPOINT}/struktural/${id || ""}`,
        requestData
      );

      const responseData = response.data;
      toastAlert("success", "Updated Successfully");
      close();
      onAction();
    } catch (error) {
      console.error("Error updating data:", error);

      if (error.name === "AxiosError") {
        toastAlert("error", error.message);
      } else {
        loadingAlert();
        MySwal.close();
        toastAlert("error", "Update failed. Please try again.");
      }
    }
  };

  return (
    <>
      <Button.Icon
        variant="secondary"
        icon={<Icon icon="bx:edit" width={20} height={20} />}
        onClick={toggle}
      />

      <Modal title="Edit Group" show={show} handler={toggle} size="lg">
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[10rem]">
              Program Studi <span className="text-danger-600">*</span>
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

export default EditStruktural;
