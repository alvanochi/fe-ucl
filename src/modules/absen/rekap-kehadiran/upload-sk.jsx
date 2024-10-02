import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";

const UploadSk = ({ nip, academic_year, semester }) => {
  const { show, toggle, close } = useModal();

  const [formData, setFormData] = useState({
    nip: "",
    academic_year: "",
    semester: "",
    file: "",
  });
  const [dokumenPreview, setDokumenPreview] = useState(null);

  useEffect(() => {
    if (show && nip && academic_year && semester) {
      const fetchDokumen = async (nip, academic_year, semester) => {
        try {
          const response = await axios.get(
            `${process.env.API_ENDPOINT}/absensi/dokumen-sk`,
            {
              params: {
                nip: nip,
                academic_year: academic_year,
                semester: semester,
              },
            }
          );

          const dataDokumen = response.data.data;

          setFormData({
            nip: dataDokumen.nip,
            academic_year: dataDokumen.academic_year,
            semester: dataDokumen.semester,
            file: dataDokumen.file,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchDokumen(nip, academic_year, semester);
    }
  }, [show, nip, academic_year, semester]);

  const inputHandler = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.type !== "application/pdf") {
        toastAlert("error", "Only PDF files are allowed");
        e.target.value = null;
        return;
      }

      setDokumenPreview(URL.createObjectURL(e.target.files[0]));

      setFormData((prevData) => ({
        ...prevData,
        nip: nip,
        academic_year: academic_year,
        semester: semester,
        [name]: file,
      }));
    }
  };

  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-sk-perkuliahan/${formData.file}`;

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.API_ENDPOINT}/absensi/upload-dokumen-sk`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseData = response.data;
      toastAlert("success", "Updated Successfully");
      close();
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
        className="mb-2"
        variant="info"
        icon={<Icon icon="ic:sharp-upload-file" width={40} height={40} />}
        onClick={toggle}
      />

      <Modal title="Upload Dokumen Sk" show={show} handler={toggle} size="xl">
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>
              Upload Dokumen{" "}
              <span className="text-danger-600">Only PDF file*</span>
            </Form.Label>
            <Form.Input type="file" name="file" onChange={inputHandler} />
            {formData.file ? (
              <embed
                src={`${dokumenPreview === null ? FILE_URL : dokumenPreview}`}
                className="w-full h-[400px] mt-4"
              />
            ) : (
              <span className="text-danger-600 text-center mt-4">
                Tidak ada dokumen yang diupload
              </span>
            )}
          </Form.Group>

          <div className="flex gap-4 mt-12">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                close();
                setDokumenPreview(null);
              }}
            >
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

export default UploadSk;
