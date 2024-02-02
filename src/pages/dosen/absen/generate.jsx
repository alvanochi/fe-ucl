import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useDatatable from "../../../hooks/useDatatable";
import { useEffect, useState } from "react";
import axios from "axios";
import useForm from "../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";

export default function GamifyCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();


  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);


  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(""); 

  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (data.nip) {
          const response = await axios.post(
            `${process.env.API_ENDPOINT}/help/get-matkul`,
            {
              year: "2023/2024",
              semester: "GASAL",
              nip: data.nip,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const courses = response.data.data;

          const options = courses.map((course) => ({
            label: `${course.name} | ${course.class}`,
            value: course.course_code,
          }));

          setCourseOptions(options);

          async function getClass(){
            try {
              const response = await axios.get(
                `${process.env.API_ENDPOINT}/help/get-class`,{
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
        
              const dataCLass = response.data.data;

              const options = dataCLass.map((classs) => ({
                label: classs.feeder_class_name,
                value: classs.feeder_class_name,
              }));

              setClassOptions(options)
        
              
            } catch (error) {
              console.log(error)
            }
          }
        
          getClass();
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [data.nip]); 

  const INITIAL_FORM = {
    status_kelas: "",
    pertemuan: "",
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: "status_kelas", label: "status_kelas" },
      { field: "pertemuan", label: "pertemuan" },
    ],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const selectedOption = courseOptions.find(option => option.value === selectedCourse);

      if (!selectedOption) {
        console.error("Selected course not found in options");
        return;
      }

      const requestData = {
        ...form,
        nik_dosen: data.nip,
        id_matkul: selectedCourse,
        kelas: selectedOption.label.split('|')[1].trim(),
      }

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
              onChange={(e) => setSelectedCourse(e.target.value)}
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
                onChange={inputHandler}
                name="pertemuan"
                value={data.pertemuan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio name="status_kelas" onChange={inputHandler}value={1} />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="status_kelas" onChange={inputHandler} value={0} />
                  Online
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
