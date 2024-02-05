import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useDatatable from "../../../../hooks/useDatatable";
import { useEffect, useState } from "react";
import axios from "axios";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";

export default function GenerateQrCode() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();


  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);


  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(""); 
  const [pertemuanData, setPertemuanData] = useState(null);

  const [idLecture, setIdLecture] = useState();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (data.nip) {
          const response = await axios.get(
            `${process.env.API_ENDPOINT_ABSEN}/dosen-for-mk`,
            {
              params: {
                code: data.nip,
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const courses = response.data.Data;

          const options = courses.map((course) => ({
            label: `${course.name} | ${course.class}`,
            value: `${course.course_code}-${course.class}`,
            dataId: course.id
          }));
          
          setCourseOptions(options);          

          // setCourseOptions(options);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [data.nip]); 

  const INITIAL_FORM = {
    status_kelas: "",
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: "status_kelas", label: "status_kelas" },
    ],
  });


  useEffect(() => {
    const fetchPertemuan = async () => {
      try {
        if (selectedCourse) {
          const selectedOption = courseOptions.find(option => option.value === selectedCourse);
  
          if (data.nip) {
            const response = await axios.get(
              `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/cek-pertemuan`,
              {
                params: {
                  nik_dosen: data.nip,
                  id_matkul: selectedCourse,
                  kelas: selectedOption.label.split('|')[1].trim(),
                  id_lecture: selectedOption.dataId

                }
              }
            );
  
            const pertemuanData = response.data.data.pertemuan_ke; 
            setPertemuanData(pertemuanData);
          }
        }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };
  
    fetchPertemuan();
  }, [selectedCourse, courseOptions, data.nip]);



  async function submitHandler(event) {
    event.preventDefault();
    try {
      const selectedOption = courseOptions.find(option => option.value === selectedCourse);

      if (!selectedOption) {
        console.error("Selected course not found in options");
        return;
      }

      const [selectedCourseCode, selectedClass] = selectedCourse.split('-');
      const [optionCourseCode, optionClass] = selectedOption.value.split('-');

      // Pemeriksaan course_code dan class
      if (selectedCourseCode !== optionCourseCode || selectedClass !== optionClass) {
        console.error("Selected course and class don't match with options");
        return;
      }
      if(!form.status_kelas){
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const requestData = {
        ...form,
        nik_dosen: data.nip,
        id_matkul: selectedCourseCode,
        kelas: selectedOption.label.split('|')[1].trim(),
        pertemuan: pertemuanData,
        id_lecture: selectedOption.dataId
      };

      const request = await axios({
        url: `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/store`,
        method: "POST",
        data: requestData,
      });

      const response = await request.data;

      toastAlert("success", "QRCODE created successfully");
      router.push(prefix + menu.url);
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);

        return;
      }
      loadingAlert();
      MySwal.close();

      toastAlert("error", error.message);
    }
  }

  if ([user, menu, loading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Generate QRCODE</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                NIK <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                onChange={inputHandler}
                name="nik_dosen"
                value={data.nip}
                readOnly
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[14rem]">
              Matakuliah <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
                className="flex-1"
                name="id_matkul"
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  // setIdLecture(e.target.idLecture);
                  // console.log(e.target);
                }}
                value={selectedCourse}
                options={courseOptions}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Pertemuan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="pertemuan"
                value={pertemuanData}
                readOnly
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio name="status_kelas" onChange={inputHandler}value={0} />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="status_kelas" onChange={inputHandler} value={1} />
                  Online
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="status_kelas" onChange={inputHandler} value={2} />
                  Hybird
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>   
      </Form>
    </Layout>
  );
}
