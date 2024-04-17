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
import { useEffect, useState } from "react";
import { Loading } from "../../../../../components/Loading";
import axios from "axios";
import {
  MySwal,
  loadingAlert,
  toastAlert,
} from "../../../../../lib/sweetalert";

export default function PengajuanSkAction() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-for-dosen`;
  const FILE_URL = `${process.env.API_ENDPOINT}/foto-profile`;

  const { formdata, show } = useCRUD(API_URL);
  const { form } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const pembimbing1Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_1
  );
  const pembimbing2Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_2
  );
  const pembimbing3Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_3
  );
  const kepalaLabData = listDosen?.find(
    (dosen) => dosen.user_id === form?.kepala_lab
  );

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isCheckedLab, setIsCheckedLab] = useState(false);

  const handleCheckboxChange = async (event, id) => {
    const { name, checked } = event.target;
    if (name === "status_pem_1") {
      setIsChecked1(checked);
    } else if (name === "status_pem_2") {
      setIsChecked2(checked);
    } else if (name === "status_pem_3") {
      setIsChecked3(checked);
    } else if (name === "status_kepala_lab") {
      setIsCheckedLab(checked);
    }

    try {
      const response = await axios.put(
        `${process.env.API_ENDPOINT}/tugas-akhir/approve/${id}`,
        // Gunakan form.id sebagai bagian dari URL
        {
          [name]: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toastAlert("success", "Successfully approved");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      if (error.name === "AxiosError") {
        toastAlert("error", error.message);
        return;
      }
      loadingAlert();
      MySwal.close();
      toastAlert("error", error.message);
    }
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  useEffect(() => {
    if (form) {
      if (form?.status_pem_1 == true) {
        setIsChecked1(true);
      }
      if (form?.status_pem_2 == true) {
        setIsChecked2(true);
      }
      if (form?.status_pem_3 == true) {
        setIsChecked3(true);
      }
      if (form?.status_kepala_lab == true) {
        setIsCheckedLab(true);
      }
    }
  }, [form]);

  if ([user, menu, form, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Pengajuan SK</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Nama</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_lengkap"
                value={form.nama_lengkap}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">NPM</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="npm"
                value={form.npm}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Judul Skripsi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_skripsi"
                value={form.judul_skripsi}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Semester <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="semester"
                value={form.semester}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Lokasi Kegiatan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lokasi_kegiatan"
                value={form.lokasi_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penugasan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nomor_sk"
                value={form.nomor_sk || "-"}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penugasan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk"
                value={form.tgl_sk}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Link Dokumen SK</Form.Label>
              <span>:</span>
              <Form.Input
                type="link"
                className="flex-1"
                name="link_dokumen_sk"
                value={form.link_dokumen_sk || "-"}
                disabled
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <div className="w-full max-w-md p-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mx-auto">
          <div>
            <span>
              <b>Catatan:</b> Silakan tandai kotak di bawah ini jika Anda
              menyetujui untuk diajukan sebagai Pembimbing / Kepala Lab
              mahasiswa terkait dalam Surat Keputusan (SK).
            </span>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {form.statusDosen === 1 && (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${FILE_URL}/${pembimbing1Data?.image || "-"}`}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Pembimbing {form.statusDosen}
                      </p>
                      <p className="text-md text-gray-500 truncate">
                        {pembimbing1Data?.nama_lengkap || "-"}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={isChecked1}
                        onChange={(event) =>
                          handleCheckboxChange(event, form.id)
                        }
                        name="status_pem_1"
                        disabled={isChecked1}
                      />
                    </div>
                  </div>
                </li>
              )}
              {form.statusDosen === 2 && (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${FILE_URL}/${pembimbing2Data?.image || "-"}`}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Pembimbing {form.statusDosen}
                      </p>
                      <p className="text-md text-gray-500 truncate">
                        {pembimbing2Data?.nama_lengkap || "-"}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={isChecked2}
                        onChange={(event) =>
                          handleCheckboxChange(event, form.id)
                        }
                        name="status_pem_2"
                        disabled={isChecked2}
                      />
                    </div>
                  </div>
                </li>
              )}
              {form.statusDosen === 3 && (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${FILE_URL}/${pembimbing3Data?.image || "-"}`}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Pembimbing {form.statusDosen}
                      </p>
                      <p className="text-md text-gray-500 truncate">
                        {pembimbing3Data?.nama_lengkap || "-"}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={isChecked3}
                        onChange={(event) =>
                          handleCheckboxChange(event, form.id)
                        }
                        name="status_pem_3"
                        disabled={isChecked3}
                      />
                    </div>
                  </div>
                </li>
              )}

              {form.isKepalaLab === true && (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${FILE_URL}/${kepalaLabData?.image || "-"}`}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Kepala Lab
                      </p>
                      <p className="text-md text-gray-500 truncate">
                        {kepalaLabData?.nama_lengkap || "-"}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={isCheckedLab}
                        onChange={(event) =>
                          handleCheckboxChange(event, form.id)
                        }
                        name="status_kepala_lab"
                        disabled={isCheckedLab}
                      />
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
