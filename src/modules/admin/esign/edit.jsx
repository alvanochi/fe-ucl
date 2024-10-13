import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import Form from "../../../components/Form";
import useMahasiswa from "../../../repo/mahasiswa";
import useDosen from "../../../repo/dosen";

const EditESign = ({ id, onAction }) => {
  const { show, toggle, close } = useModal();

  const [formData, setFormData] = useState({
    dosen_id: "",
    mhs_id: "",
    nama_kegiatan: "",
    link_validasi: "",
  });

  const { data: listMhs, isLoading: isMhsLoading } = useMahasiswa();
  const { data: listDosen, isLoading: isDosenLoadin } = useDosen();

  const [selectedMhs, setSelectedMhs] = useState("");
  const [selectedDosen, setSelectedDosen] = useState("");

  const handleMhsChange = (selected) => {
    selectedMhs(selected?.value);
  };

  const handleDosenChange = (selected) => {
    selectedDosen(selected?.value);
  };

  const getData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.API_ENDPOINT}/validasi/validasi-dokumen/detail/${id}`
      );

      const dataResponse = response.data.data;

      setFormData({
        nama_kegiatan: dataResponse.nama_kegiatan,
        link_validasi: dataResponse.link_validasi,
      });
      setSelectedDosen(dataResponse.dosen_id);
      setSelectedMhs(dataResponse.mhs_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (show && id) {
      getData(id);
    }
  }, [show, id]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        ...formData,
        dosen_id: selectedDosen,
        mhs_id: selectedMhs,
      };

      const response = await axios.put(
        `${process.env.API_ENDPOINT}/validasi/validasi-dokumen/${id || ""}`,
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

      <Modal title="Edit Data Master Unit" show={show} handler={toggle}>
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
              value={formData.nama_kegiatan}
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
              value={formData.link_validasi}
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

export default EditESign;
