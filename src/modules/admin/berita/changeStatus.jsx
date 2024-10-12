// ChangeStatus.js
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { toastAlert } from "../../../lib/sweetalert";

export default function ChangeStatus({ id, status, onStatusChange }) {
  const INITIAL_FORM = {
    ...id,
    ...status,
  };

  const { show, toggle, close } = useModal();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmit, setIsSubmit] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const reset = () => {
    setForm(INITIAL_FORM);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSubmit(true);

    try {
      const EDIT_URL = `${process.env.API_ENDPOINT}/berita/change-status/${form.id}`;
      const response = await axios.patch(EDIT_URL, { status: form.status });

      toastAlert("success", response.data.message);

      close();
      reset();

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toastAlert("error", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Button.Icon
        variant="primary"
        icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
        onClick={toggle}
      />
      <Modal title="Change Status" show={show} handler={toggle}>
        <p className="text-center text-sm mb-8">
          Jika status suatu (Event / Tantangan) adalah Active maka informasi
          tersebut akan ditampilkan dalam daftar berita pada aplikasi mobile
          UCL. Sebaliknya, jika statusnya Non Active berarti informasi tersebut
          tidak akan ditampilkan.
        </p>
        <Form onSubmit={submitHandler} className="space-y-4" type="formdata">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[6rem]">
              Status <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
              className="flex-1"
              name="status"
              value={form.status}
              onChange={inputHandler}
              options={[
                { label: "Active", value: 0 },
                {
                  label: "Non Active",
                  value: 1,
                },
              ]}
              required
            />
          </Form.Group>
          <div className="flex gap-4 mt-4">
            <Button onClick={toggle} variant="primary" className="w-full h-12">
              {isSubmit ? "Menyimpan data" : "Kirim"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
