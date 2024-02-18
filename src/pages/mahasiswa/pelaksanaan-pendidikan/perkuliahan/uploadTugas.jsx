import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";

const UploadTugas = ({ data, onEditAbsensi }) => {
  const { show, toggle, close } = useModal();

  const [formData, setFormData] = useState({
    npm: "",
    nilai: '',
    upload_dok: '',
  });

  const fetchAbsensiData = async (id) => {
    try {
      const response = await axios.get(`${process.env.API_ENDPOINT_ABSEN}/absensi`, {
        params: {
          filter: ["id"],
          filterValue: [id],
        },
      });

      const dataAbsensi = response.data.data;

      if (dataAbsensi && dataAbsensi.length > 0) {
        setFormData({
          npm: dataAbsensi[0]?.npm || "",
          nilai: dataAbsensi[0]?.nilai || "",
          upload_dok: dataAbsensi[0]?.upload_dok || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    if (show && data && data.id) {
      fetchAbsensiData(data.id);
    }
  }, [show, data]);

  const [dokumenPreview, setDokumenPreview] = useState(null);



  const inputHandler = (e) => {
    const { name, files } = e.target;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.type !== 'application/pdf') {
        toastAlert("error", "Only PDF files are allowed");
        e.target.value = null;
        return;
      }

      setDokumenPreview(URL.createObjectURL(e.target.files[0]));
      
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };
  
  const FILE_URL = `https://absen.ft.uika-bogor.ac.id/storage/tugas/${formData.npm}/${formData.upload_dok}`;



  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.API_ENDPOINT_ABSEN}/absensi/update/${data?.id || ""}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const responseData = response.data;
      toastAlert("success", "Updated Successfully");
      close();
      onEditAbsensi();

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
      <Button.Icon variant="primary" icon={<Icon icon="solar:upload-square-bold" width={20} height={20} />} onClick={toggle} />

      <Modal title="Tugas" show={show} handler={toggle}>
        <Form className="space-y-4" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>
              Nilai <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input type="number" name="nilai" value={formData.nilai ? formData.nilai : 0} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Upload Dokumen <span className="text-danger-600">Only PDF file*</span>
            </Form.Label>
            <Form.Input type="file" name="upload_dok" onChange={inputHandler} />
            {formData.upload_dok ? (
              <embed src={`${dokumenPreview === null ? FILE_URL : dokumenPreview}`} className="w-full h-[256px] mt-4" />
            ) : (
              <span className="text-danger-600 text-center mt-4">Tidak ada tugas terupload</span>
            )}
          </Form.Group>

          <div className="flex gap-4 mt-12">
            <Button type="button" variant="secondary" onClick={() => {
                close()
                setDokumenPreview(null)
              }
              }>
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

export default UploadTugas;


