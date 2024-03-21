import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import useDosen from "../../../../../repo/dosen";
import date from "../../../../../utils/date";
import { useEffect, useState } from "react";
import Accordion from "../../../../../components/Accordion";
import { Icon } from "@iconify-icon/react";
import axios from "axios";
import { toastAlert } from "../../../../../lib/sweetalert";

export default function DetailBimbinganAkademik() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const [activeSemester, setActiveSemester] = useState(1);
  const [mhsBimbingan, setMhsBimbingan] = useState([]);
  const [dataBimbingan, setDataBimbingan] = useState(null);

  const API_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-frs`;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.id) {
          const response = await axios.get(`${API_URL}/${router.query.id}`);

          setDataBimbingan(response.data.data.dataBimbingan);
          setMhsBimbingan(response.data.data.mhsBimbingan);
        }
      } catch (error) {
        console.log(error);
        if (error.name === "AxiosError") {
          toastAlert("warning", error.response.data);
          return;
        }
        toastAlert("error", error);
      }
    };

    fetchData();
  }, [router.query]);

  const handleChange = (mhsIndex, semesterIndex, fieldName, value) => {
    const updatedMhsBimbingan = [...mhsBimbingan];
    updatedMhsBimbingan[mhsIndex].semesters[semesterIndex][fieldName] = value;
    setMhsBimbingan(updatedMhsBimbingan);
  };

  const handleEdit = async (id, mhsIndex, semesterIndex, updatedData) => {
    try {
      await axios.patch(`${API_URL}/edit-dosen/${id}`, updatedData);

      const updatedMhsBimbingan = [...mhsBimbingan];
      updatedMhsBimbingan[mhsIndex].semesters[semesterIndex] = updatedData;
      setMhsBimbingan(updatedMhsBimbingan);

      toastAlert("success", "Updated!");
    } catch (error) {
      console.error("Gagal mengubah data:", error);
      if (error.name === "AxiosError") {
        toastAlert("warning", error.response.data);
        return;
      }
      toastAlert("error", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  };

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">
            Detail Bimbingan Akademik
          </Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Angkatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_angkatan"
                value={dataBimbingan?.tahun_angkatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dosen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="dosen_id"
                value={dataBimbingan?.dosen_id}
                options={
                  listDosen &&
                  listDosen.map((dosen) => ({
                    label: dosen.nama_lengkap,
                    value: dosen.user_id,
                  }))
                }
                disabled
              />
            </Form.Group>
          </Card.Body>
        </Card>
      </Form>

      <Card className="mt-8 mb-8">
        <Card.Header className="text-center">List Mahasiswa</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <div className="flex-1 block">
              <div className="space-y-2 mt-2">
                {mhsBimbingan?.map((mhs, mhsIndex) => (
                  <Accordion
                    key={`mhs-${mhsIndex}`}
                    title={`${mhsIndex + 1}. ${mhs.nama_lengkap} - ${mhs.npm}`}
                  >
                    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                      <ul class="flex flex-wrap -mb-px">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((semesterNum) => (
                          <li class="me-2" key={`semester-tab-${semesterNum}`}>
                            <button
                              onClick={() => setActiveSemester(semesterNum)}
                              className={`inline-block p-4 border-b-2 ${
                                activeSemester === semesterNum
                                  ? "border-blue-600 text-blue-600"
                                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 dark:border-gray-300 dark:hover:border-gray-300"
                              }`}
                            >
                              Semester {semesterNum}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {mhs.semesters.map((semester, semesterIndex) => {
                      return (
                        <div key={`semester-${semesterIndex}`}>
                          {activeSemester === semester.semester && (
                            <>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Pertemuan 1{" "}
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <Form.Input
                                  type="date"
                                  className="flex-1"
                                  name={`p1-${mhsIndex}-${semesterIndex}`}
                                  value={formatDate(semester.p1)}
                                  onChange={(e) =>
                                    handleChange(
                                      mhsIndex,
                                      semesterIndex,
                                      "p1",
                                      e.target.value
                                    )
                                  }
                                />

                                <Button.Icon
                                  variant="secondary"
                                  icon={
                                    <Icon
                                      icon="bx:edit"
                                      width={20}
                                      height={20}
                                    />
                                  }
                                  onClick={() => {
                                    const updatedData = {
                                      ...semester,
                                    };
                                    handleEdit(
                                      semester.id,
                                      mhsIndex,
                                      semesterIndex,
                                      updatedData
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Pertemuan 2{" "}
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <Form.Input
                                  type="date"
                                  className="flex-1"
                                  name={`p2-${mhsIndex}-${semesterIndex}`}
                                  value={formatDate(semester.p2)}
                                  onChange={(e) =>
                                    handleChange(
                                      mhsIndex,
                                      semesterIndex,
                                      "p2",
                                      e.target.value
                                    )
                                  }
                                />

                                <Button.Icon
                                  variant="secondary"
                                  icon={
                                    <Icon
                                      icon="bx:edit"
                                      width={20}
                                      height={20}
                                    />
                                  }
                                  onClick={() => {
                                    const updatedData = {
                                      ...semester,
                                    };
                                    handleEdit(
                                      semester.id,
                                      mhsIndex,
                                      semesterIndex,
                                      updatedData
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Pertemuan 3{" "}
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <Form.Input
                                  type="date"
                                  className="flex-1"
                                  name={`p1-${mhsIndex}-${semesterIndex}`}
                                  value={formatDate(semester.p3)}
                                  onChange={(e) =>
                                    handleChange(
                                      mhsIndex,
                                      semesterIndex,
                                      "p3",
                                      e.target.value
                                    )
                                  }
                                />

                                <Button.Icon
                                  variant="secondary"
                                  icon={
                                    <Icon
                                      icon="bx:edit"
                                      width={20}
                                      height={20}
                                    />
                                  }
                                  onClick={() => {
                                    const updatedData = {
                                      ...semester,
                                    };
                                    handleEdit(
                                      semester.id,
                                      mhsIndex,
                                      semesterIndex,
                                      updatedData
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Pertemuan 4{" "}
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <Form.Input
                                  type="date"
                                  className="flex-1"
                                  name={`p4-${mhsIndex}-${semesterIndex}`}
                                  value={formatDate(semester.p4)}
                                  onChange={(e) =>
                                    handleChange(
                                      mhsIndex,
                                      semesterIndex,
                                      "p4",
                                      e.target.value
                                    )
                                  }
                                />

                                <Button.Icon
                                  variant="secondary"
                                  icon={
                                    <Icon
                                      icon="bx:edit"
                                      width={20}
                                      height={20}
                                    />
                                  }
                                  onClick={() => {
                                    const updatedData = {
                                      ...semester,
                                    };
                                    handleEdit(
                                      semester.id,
                                      mhsIndex,
                                      semesterIndex,
                                      updatedData
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Catatan
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <Form.Textarea
                                  className="flex-1"
                                  rows="5"
                                  name={`catatan-${mhsIndex}-${semesterIndex}`}
                                  value={semester.catatan || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      mhsIndex,
                                      semesterIndex,
                                      "catatan",
                                      e.target.value
                                    )
                                  }
                                />
                                <Button.Icon
                                  variant="secondary"
                                  icon={
                                    <Icon
                                      icon="bx:edit"
                                      width={20}
                                      height={20}
                                    />
                                  }
                                  onClick={() => {
                                    const updatedData = {
                                      ...semester,
                                    };
                                    handleEdit(
                                      semester.id,
                                      mhsIndex,
                                      semesterIndex,
                                      updatedData
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="flex items-baseline pt-2 gap-3">
                                <Form.Label className="min-w-[18rem]">
                                  Dokumen FRS
                                  <span className="text-danger-600">*</span>
                                </Form.Label>
                                <span>:</span>
                                <embed
                                  src={`${FILE_URL}/${semester.dok_frs}`}
                                  className="w-full h-[256px]"
                                />
                              </Form.Group>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </Accordion>
                ))}
              </div>
            </div>
          </Form.Group>
        </Card.Body>
      </Card>
      <div className="flex mt-8">
        <Button
          as="a"
          href={`${prefix + menu.url}`}
          variant="danger"
          icon={
            <Icon icon="material-symbols:chevron-left" width={20} height={20} />
          }
          iconPosition="left"
          pill
        >
          Kembali
        </Button>
      </div>
    </Layout>
  );
}
