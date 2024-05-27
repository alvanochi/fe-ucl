import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useDosen from "../../../../../repo/dosen";
import useCRUD from "../../../../../hooks/useCRUD";
import { Loading } from "../../../../../components/Loading";
import date from "../../../../../utils/date";
import axios from "axios";
import { MySwal, toastAlert } from "../../../../../lib/sweetalert";

export default function PengajuanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-pengajuan-kolo`;
  const FILE_URL = `${process.env.API_ENDPOINT}/tugas-akhir/makalah-kolokium`;

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    kolo_id: "",
    nama_lengkap: "",
    semester: "",
    email: "",
    no_hp: "",
    npm: "",
    judul_skripsi: "",
    link_dok_mhs_aktif: "",
    link_dok_pembayaran: "",
    kolo_pembimbing_1: "",
    kolo_pembimbing_2: "",
    kolo_pembimbing_3: null,
    kolo_kepala_lab: "",
    kolo_status_pem_1: "",
    kolo_status_pem_2: "",
    kolo_status_pem_3: "",
    kolo_status_kepala_lab: "",
    evaluator_1: "",
    evaluator_2: "",
    jadwal_pelaksanaan: "",
    file_makalah: "",
    status_kp: "",
    status_sks_ipk: "",
    jumlah_sks: "",
    ipk: "",
    link_dok_makalah: "",
    judul: "",
    status: "",
  };

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "link_dok_mhs_aktif", label: "Link Dokumen Mahasiswa Aktif" },
      { field: "link_dok_pembayaran", label: "Link Dokumen Pembayaran" },
      { field: "file_makalah", label: "file_makalah" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/update-pengajuan-kolokium`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.kolo_id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        jadwal_pelaksanaan: data.jadwal_pelaksanaan
          ? date.formatToInput(data.jadwal_pelaksanaan)
          : "",
      }),
    });
  }, [router, user]);

  const handleEvaluator1 = (selected) => {
    inputHandler({
      target: { name: "evaluator_1", value: selected?.value },
    });
  };

  const handleEvaluator2 = (selected) => {
    inputHandler({
      target: { name: "evaluator_2", value: selected?.value },
    });
  };

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isCheckedLab, setIsCheckedLab] = useState(false);

  const handleCheckboxChange = async (event, id) => {
    const { name, checked } = event.target;
    if (name === "kolo_status_pem_1") {
      setIsChecked1(checked);
    } else if (name === "kolo_status_pem_2") {
      setIsChecked2(checked);
    } else if (name === "kolo_status_pem_3") {
      setIsChecked3(checked);
    } else if (name == "kolo_status_kepala_lab") {
      setIsCheckedLab(checked);
    }

    try {
      const response = await axios.put(
        `${process.env.API_ENDPOINT}/tugas-akhir/approve/${id}`,
        {
          [name]: true,
          db: "ta_pendaftaran_kolokium",
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
    if (form) {
      if (form?.kolo_status_pem_1 == true) {
        setIsChecked1(true);
      }
      if (form?.kolo_status_pem_2 == true) {
        setIsChecked2(true);
      }
      if (form?.kolo_status_pem_3 == true) {
        setIsChecked3(true);
      }
      if (form?.kolo_status_kepala_lab == true) {
        setIsCheckedLab(true);
      }
    }
  }, [form]);

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `${FILE_URL}/${form.file_makalah}`;
    downloadLink.target = "_blank";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />

      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">
            <div>Form Pengajuan Kolokium</div>
          </Card.Header>
          <div
            className="flex items-center p-4 mb-4  mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Catatan!</span> Silahkan isi form
              yang dibintangi saja (<span className="text-danger-600">*</span>),
              jika status approved dosen pembimbing sudah ACC/terceklis.
            </div>
          </div>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Nama</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="nama_lengkap"
                value={form.nama_lengkap}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">NPM</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="npm"
                value={form.npm}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Judul Skripsi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="judul"
                value={form.judul}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Semester</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="semester"
                value={form.semester}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Email</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="email"
                value={form.email}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">No Handphone</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-gray-500"
                name="ho_hp"
                value={form.no_hp}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Terdaftar sebagai mahasiswa aktif </p>
                <p>dilengkapi dengan bukti pembayaran </p>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1 border-gray-500"
                name="link_dok_mhs_aktif"
                value={form.link_dok_mhs_aktif}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Telah Melakukan Pembayaran Kolokium{" "}
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1 border-gray-500"
                name="link_dok_pembayaran"
                value={form.link_dok_pembayaran}
                onChange={inputHandler}
              />
            </Form.Group>
            {/* <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                5 Eksternal Proposal Makalah Kolokium{" "}
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="file_makalah"
                onChange={inputHandler}
              />
              {form.file_makalah && (
                <Button
                  variant="info"
                  icon={
                    <Icon icon="material-symbols:save" width={20} height={20} />
                  }
                  type="button"
                  onClick={handleDownload}
                >
                  Download Dokumen
                </Button>
              )}
            </Form.Group> */}

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Link Dokumen Makalah
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1 border-gray-500"
                name="link_dok_makalah"
                value={form.link_dok_makalah}
                onChange={inputHandler}
                placeholder="link Google Drive"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Telah Menyelesaikan MK Kerja Praktik{" "}
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_kp"
                checked={form.status_kp ? true : false}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Telah Menyelesaikan 138 SKS Dengan</p> <p>IPK ≥ 2.00</p>
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_sks_ipk"
                value={form.status_sks_ipk}
                checked={form.status_sks_ipk}
                onChange={inputHandler}
              />
              <span>SKS: {form.jumlah_sks}</span>|<span>IPK: {form.ipk}</span>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Jadwal Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="jadwal_pelaksanaan"
                value={form.jadwal_pelaksanaan}
                placeholder="Diisi oleh admin"
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Evaluator 1 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                className="border-primary-500"
                name="evaluator_1"
                onChange={handleEvaluator1}
                value={form.evaluator_1}
                options={listDosen?.map((dosen) => ({
                  label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                  value: dosen.user_id,
                }))}
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Evaluator 2 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                className="border-yellow-500"
                name="evaluator_2"
                onChange={handleEvaluator2}
                value={form.evaluator_2}
                options={listDosen?.map((dosen) => ({
                  label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                  value: dosen.user_id,
                }))}
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                name="status"
                onChange={inputHandler}
                value={form.status}
                options={[
                  { label: "pengajuan-sk", value: "pengajuan-sk" },
                  { label: "menuju-kolokium", value: "menuju-kolokium" },
                  { label: "menuju-sidang", value: "menuju-sidang" },
                  {
                    label: "menyelesaikan-revisi",
                    value: "menyelesaikan-revisi",
                  },
                  { label: "selesai", value: "selesai" },
                ]}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        {/* Dosen Pembimbing table */}
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="text-sm border-2 border-white bg-gray-50"
              >
                <div>Mengetahui</div>
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Peran
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Dosen
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 1</span>{" "}
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Select
                    className="border-gray-500"
                    name="kolo_pembimbing_1"
                    value={form.kolo_pembimbing_1}
                    options={
                      listDosen &&
                      listDosen.map((dosen) => ({
                        label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                        value: dosen.user_id,
                      }))
                    }
                    disabled
                  />
                </Form.Group>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-center justify-center gap-3">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={isChecked1}
                    name="kolo_status_pem_1"
                    onChange={(event) =>
                      handleCheckboxChange(event, form.kolo_id)
                    }
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 2</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Select
                    className="border-gray-500"
                    name="kolo_pembimbing_2"
                    value={form.kolo_pembimbing_2}
                    options={
                      listDosen &&
                      listDosen.map((dosen) => ({
                        label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                        value: dosen.user_id,
                      }))
                    }
                    disabled
                  />
                </Form.Group>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-center justify-center gap-3">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={isChecked2}
                    name="kolo_status_pem_2"
                    onChange={(event) =>
                      handleCheckboxChange(event, form.kolo_id)
                    }
                  />
                </Form.Group>
              </td>
            </tr>
            {form.kolo_status_pem_3 && (
              <tr>
                <td className="text-sm border-2 border-white text-center font-bold">
                  <span>Pembimbing 3 (optional)</span>
                </td>
                <td className="text-sm border-2 border-white">
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Select
                      className="border-gray-500"
                      name="kolo_pembimbing_3"
                      value={form.kolo_pembimbing_3}
                      options={
                        listDosen &&
                        listDosen.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                        }))
                      }
                      onChange={(event) =>
                        handleCheckboxChange(event, form.kolo_id)
                      }
                    />
                  </Form.Group>
                </td>
                <td className="text-sm border-2 border-white">
                  <Form.Group className="flex items-center justify-center gap-3">
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      checked={isChecked3}
                      name="kolo_status_pem_3"
                      onChange={(event) =>
                        handleCheckboxChange(event, form.kolo_id)
                      }
                    />
                  </Form.Group>
                </td>
              </tr>
            )}
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Kepala Lab</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Select
                    name="kolo_kepala_lab"
                    value={form.kolo_kepala_lab}
                    options={
                      listDosen &&
                      listDosen.map((dosen) => ({
                        label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                        value: dosen.user_id,
                      }))
                    }
                    disabled
                  />
                </Form.Group>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-center justify-center gap-3">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={isCheckedLab}
                    name="kolo_status_kepala_lab"
                    onChange={(event) =>
                      handleCheckboxChange(event, form.kolo_id)
                    }
                  />
                </Form.Group>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="text-sm border-2 border-white bg-gray-50"
              ></td>
            </tr>
          </tfoot>
        </table>

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
