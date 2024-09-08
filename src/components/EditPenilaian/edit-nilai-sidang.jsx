import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../Button";
import Modal from "../Modal";
import Form from "../Form";
import useModal from "../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";

const EditNilaiSidang = ({ title, data, name, id, onSuccess, db }) => {
  const { show, toggle, close } = useModal();

  const [formData, setFormData] = useState(0);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData(value);
  };

  useEffect(() => {
    setFormData(data);
  }, [setFormData, data]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const dataToEdit = {
        db: db,
        [name]: formData,
      };

      const response = await axios.put(
        `${process.env.API_ENDPOINT}/tugas-akhir/update-nilai-sidang/${
          id || ""
        }`,
        dataToEdit
      );

      const responseData = response.data;
      toastAlert("success", "Updated Successfully");
      close();
      onSuccess();
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
        type="button"
        variant="secondary"
        icon={<Icon icon="bx:edit" width={20} height={20} />}
        onClick={toggle}
      />

      <Modal title={`${title} (0 - 100)`} show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Input
              type="number"
              name={name}
              value={formData}
              onChange={inputHandler}
              required
              min={1}
              max={100}
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

export default EditNilaiSidang;
