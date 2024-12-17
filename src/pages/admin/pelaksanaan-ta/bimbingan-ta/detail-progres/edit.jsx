import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../../components/Button";
import Modal from "../../../../../components/Modal";
import useModal from "../../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import {
  MySwal,
  loadingAlert,
  toastAlert,
} from "../../../../../lib/sweetalert";
import Form from "../../../../../components/Form";

const Edit = ({ id, onAction }) => {
  const { show, toggle, close } = useModal();

  const [formData, setFormData] = useState({
    last_tgl: "",
    pembahasan: "",
    deskripsi: "",
    bab: "",
  });

  const getData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.API_ENDPOINT}/progres-tugas-akhir/detail-progres/${id}`
      );

      const dataResponse = response.data.data;

      setFormData({
        last_tgl: dataResponse.last_tgl,
        pembahasan: dataResponse.pembahasan,
        deskripsi: dataResponse.deskripsi,
        bab: dataResponse.bab,
      });
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
      const response = await axios.put(
        `${process.env.API_ENDPOINT}/progres-tugas-akhir/update-progres/${
          id || ""
        }`,
        formData
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
        icon={<Icon icon="ic:twotone-info" width={20} height={20} />}
        onClick={toggle}
      />

      <Modal title="Edit Progress Bimbingan" show={show} handler={toggle}>
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
              value={formData.last_tgl}
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
              value={formData.bab}
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
              value={formData.pembahasan}
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
              value={formData.deskripsi}
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

export default Edit;
