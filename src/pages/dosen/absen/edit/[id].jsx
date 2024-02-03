import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import useForm from "../../../../hooks/useForm";
import { useEffect, useState } from "react";
import useDatatableAbsensi from "../../../../hooks/useDataTableAbsensi";
import useDatatable from "../../../../hooks/useDatatable";
import axios from "axios";
import { toastAlert } from "../../../../lib/sweetalert";

export default function EditPembelajran() {
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
            `${process.env.API_ENDPOINT_ABSEN}/dosen-for-mk`,
            {
              code: data.nip,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
          const courses = response.data.Data;

          const options = courses.map((course) => ({
            label: course.name,
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
                label: classs.name,
                value: classs.name,
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

  const DATA_URL_ABSENSI = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran`
  const id = router.query.id;
  const { dataAbsensi, loadingAbsensi } = useDatatableAbsensi(DATA_URL_ABSENSI, {
    filter: ["id"],
    filterValue: [id],
  });


  const [formData, setFormData] = useState({
    id_matkul: dataAbsensi?.[0]?.id_matkul,
    kelas: dataAbsensi?.[0]?.kelas,
    status_kelas: dataAbsensi?.[0]?.status_kelas,
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: name === 'status_kelas' ? parseInt(value) : value }));
  };
  

  async function submitEditHandler(event) {
    event.preventDefault();
    const EDIT_URL = `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/update/${id}`;

    try {
      const response = await axios.post(EDIT_URL, formData);

      toastAlert("success", "Updated Successfuly");
      router.push(prefix + menu.url)
    } catch (error) {
      toastAlert("error", error.message);
    }
  }

  useEffect(() => {
    if (dataAbsensi?.length > 0) {
      setFormData({
        id_matkul: dataAbsensi[0].id_matkul || "",
        kelas: dataAbsensi[0].kelas || "",
        status_kelas: parseInt(dataAbsensi[0].status_kelas) || 0,
      });
    }
  }, [dataAbsensi]);
  

  if ([user, menu, loadingAbsensi].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title='Edit Pembelajaran' icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitEditHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Edit Pembelajaran</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    value={1}
                    checked={formData.status_kelas === 1}
                    onChange={inputHandler}
                  />

                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    value={0}
                    checked={formData.status_kelas === 0}
                    onChange={inputHandler}
                  />
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
