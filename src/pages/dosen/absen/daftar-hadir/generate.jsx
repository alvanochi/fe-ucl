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
import useDosen from "../../../../repo/dosen";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import { Loading } from "../../../../components/Loading";
import useMahasiswa from "../../../../repo/mahasiswa";
import useDosenExt from "../../../../repo/dosen-ext";

export default function GenerateQrCode() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);
  const { data: listDosenExt, isLoading: isDosenExtLoading } = useDosenExt([
    user,
  ]);

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [pertemuanData, setPertemuanData] = useState(null);
  const [selectedMhs, setSelectedMhs] = useState("");

  const [rps, setRps] = useState({
    rps_dasar: null,
    rps_pelaksanaan: null,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (data.nip) {
          const response = await axios.get(
            `${process.env.API_ENDPOINT_ABSEN}/dosen-for-mk`,
            {
              params: {
                code: data.nip,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const courses = response.data.Data;

          const options = courses.map((course) => ({
            label: `${course.name} | ${course.class}`,
            value: `${course.course_code} - ${course.class}`,
            dataId: course.id,
            kelas: course.class,
          }));

          setCourseOptions(options);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [data.nip]);

  const INITIAL_FORM = {
    status_kelas: "",
    dosen_tamu: "",
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [{ field: "status_kelas", label: "status_kelas" }],
  });

  useEffect(() => {
    const fetchPertemuan = async () => {
      try {
        if (selectedCourse) {
          const selectedOption = courseOptions.find(
            (option) => option.value === selectedCourse
          );

          if (!selectedOption) {
            console.error("Selected course not found in options");
            return;
          }

          const [selectedCourseCode, selectedClass] = selectedCourse.split("-");
          const [optionCourseCode, optionClass] =
            selectedOption.value.split("-");

          if (
            selectedCourseCode !== optionCourseCode ||
            selectedClass !== optionClass
          ) {
            console.error("Selected course and class don't match with options");
            return;
          }
          if (data.nip) {
            const response = await axios.get(
              `${process.env.API_ENDPOINT_ABSEN}/pembelajaran/cek-pertemuan`,
              {
                params: {
                  nik_dosen: data.nip,
                  id_matkul: selectedCourseCode,
                  kelas: selectedOption.kelas,
                  id_lecture: selectedOption.dataId,
                },
              }
            );

            const pertemuanData = response.data.data.pertemuan_ke;
            const rps = response.data.data.rps_dasar;
            const rpsp = response.data.data.rps_pelaksanaan;
            setPertemuanData(pertemuanData);
            setRps({
              rps_dasar: rps !== null ? rps : "",
              rps_pelaksanaan: rpsp !== null ? rpsp : "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };

    fetchPertemuan();
  }, [selectedCourse, courseOptions, data.nip]);

  const [selectedDosen, setSelectedDosen] = useState("");
  const [selectedDosenExt, setSelectedDosenExt] = useState("");

  const handleDosenChange = (selected) => {
    setSelectedDosen(selected?.value);
  };

  const handleDosenExtChange = (selected) => {
    setSelectedDosenExt(selected?.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRps((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMhsChange = (selected) => {
    setSelectedMhs(selected?.value);
  };

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const selectedOption = courseOptions.find(
        (option) => option.value === selectedCourse
      );

      if (!selectedOption) {
        console.error("Selected course not found in options");
        return;
      }

      const [selectedCourseCode, selectedClass] = selectedCourse.split("-");
      const [optionCourseCode, optionClass] = selectedOption.value.split("-");

      // Pemeriksaan course_code dan class
      if (
        selectedCourseCode !== optionCourseCode ||
        selectedClass !== optionClass
      ) {
        console.error("Selected course and class don't match with options");
        return;
      }
      if (!form.status_kelas) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }

      const requestData = {
        ...form,
        ...rps,
        nik_dosen: data.nip,
        id_matkul: selectedCourseCode,
        kelas: selectedClass,
        pertemuan: pertemuanData,
        id_lecture: selectedOption.dataId,
        nidn_dosen_pengganti: selectedDosen,
        npm_komti: selectedMhs,
        dosen_tamu: selectedDosenExt,
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

  if (
    [
      user,
      menu,
      loading,
      isDosenLoading,
      isMahasiswaLoading,
      isDosenExtLoading,
    ].some((item) => item == null)
  )
    return <Loading />;
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
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={0}
                  />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={1}
                  />
                  Online
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={2}
                  />
                  Hybird
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Dasar</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_dasar"
                value={rps.rps_dasar}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Pelaksanaan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_pelaksanaan"
                value={rps.rps_pelaksanaan}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">Dosen Pengganti</Form.Label>
              <span>:</span>
              <Form.Combobox
                name="nidn_dosen_pengganti"
                className="flex-1"
                onChange={handleDosenChange}
                value={selectedDosen}
                options={listDosen?.map((dosen) => ({
                  label: dosen.nama_lengkap,
                  value: dosen.nip,
                }))}
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">Dosen Tamu</Form.Label>
              <span>:</span>
              <Form.Combobox
                name="dosen_tamu"
                className="flex-1"
                onChange={handleDosenExtChange}
                value={selectedDosenExt}
                options={listDosenExt?.map((dosen) => ({
                  label: dosen.nama_lengkap,
                  value: `${dosen.nama_lengkap} - ${dosen.nip}`,
                }))}
                menuTarget={document.body}
              />
              {/* <Form.Input
                type="text"
                className="flex-1"
                name="dosen_tamu"
                onChange={inputHandler}
                value={data.dosen_tamu}
              /> */}
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Komti Kelas <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="npm_komti"
                onChange={handleMhsChange}
                value={selectedMhs}
                options={listMahasiswa?.map((mhs) => ({
                  label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                  value: mhs.npm,
                }))}
                menuTarget={document.body}
              />
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
