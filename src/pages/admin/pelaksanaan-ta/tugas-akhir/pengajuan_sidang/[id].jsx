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
import {
  MySwal,
  loadingAlert,
  toastAlert,
} from "../../../../../lib/sweetalert";

export default function PengajuanSidang() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-pengajuan-sidang`;
  const FILE_URL = `${process.env.API_ENDPOINT}/tugas-akhir/pas-foto`;
  const FILE_DRAFT_SKRIPSI = `${process.env.API_ENDPOINT}/tugas-akhir/draft-skripsi`;

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    sidang_id: "",
    nama_lengkap: "",
    email: "",
    no_hp: "",
    npm: "",
    tanggal_lahir: "",
    alamat: "",
    pekerjaan: "",
    alamat_pekerjaan: "",
    wali: "",
    alamat_wali: "",
    telp_wali: "",
    status_mk: "",
    max_nilai_d: "",
    link_khs: "",
    status_min_ipk: "",
    pas_foto: "",
    link_ijazah_terakhir: "",
    link_serti_taaruf: "",
    link_serti_lkkm: "",
    link_serti_kkn: "",
    lima_eksemlar_skripsi: "",
    link_serti_kompetensi: "",
    link_bukti_upload_jurnal: "",
    link_serti_toefl: "",
    link_bukti_keuangan: "",
    link_lainya: "",
    status_kp: "",
    jumlah_sks: "",
    link_transkip_nilai: "",
    link_administrasi_sidang: "",
    draft_final_skripsi: "",
    status_form_sidang: "",
    sidang_pembimbing_1: "",
    sidang_pembimbing_2: "",
    sidang_pembimbing_3: null,
    sidang_kepala_lab: "",
    sidang_status_pem_1: "",
    sidang_status_pem_2: "",
    sidang_status_pem_3: "",
    sidang_status_kepala_lab: "",
    jadwal_pelaksanaan: "",
    penguji_1: "",
    penguji_2: "",
    judul_skripsi: "",
    program_studi: "",
    peminatan: "",
    peminatan_lab: "",
    link_draft_final_skripsi: "",
    ipk: "",
    judul: "",
    status: "",
  };

  const handlePenguji1 = (selected) => {
    inputHandler({
      target: { name: "penguji_1", value: selected?.value },
    });
  };

  const handlePenguji2 = (selected) => {
    inputHandler({
      target: { name: "penguji_2", value: selected?.value },
    });
  };

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "pengajuan_sk_id", label: "Pengajuan SK ID" },
      { field: "sidang_id", label: "Sidang ID" },
      { field: "nama_lengkap", label: "Nama Lengkap" },
      { field: "email", label: "Email" },
      { field: "no_hp", label: "Nomor HP" },
      { field: "npm", label: "NPM" },
      { field: "tanggal_lahir", label: "Tanggal Lahir" },
      { field: "alamat", label: "Alamat" },
      { field: "pekerjaan", label: "Pekerjaan" },
      { field: "alamat_pekerjaan", label: "Alamat Pekerjaan" },
      { field: "wali", label: "Wali" },
      { field: "alamat_wali", label: "Alamat Wali" },
      { field: "telp_wali", label: "Telepon Wali" },
      { field: "status_mk", label: "Status MK" },
      { field: "max_nilai_d", label: "Max Nilai D" },
      { field: "link_khs", label: "Link KHS" },
      { field: "status_min_ipk", label: "Status Min IPK" },
      { field: "pas_foto", label: "Pas Foto" },
      { field: "link_ijazah_terakhir", label: "Link Ijazah Terakhir" },
      { field: "link_serti_taaruf", label: "Link Sertifikat Ta'aruf" },
      { field: "link_serti_lkkm", label: "Link Sertifikat LKKM" },
      { field: "link_serti_kkn", label: "Link Sertifikat KKN" },
      { field: "lima_eksemlar_skripsi", label: "Lima Eksemplar Skripsi" },
      { field: "link_serti_kompetensi", label: "Link Sertifikat Kompetensi" },
      { field: "link_bukti_upload_jurnal", label: "Link Bukti Upload Jurnal" },
      { field: "link_serti_toefl", label: "Link Sertifikat TOEFL" },
      { field: "link_bukti_keuangan", label: "Link Bukti Keuangan" },
      { field: "link_lainya", label: "Link Lainnya" },
      { field: "status_kp", label: "Status KP" },
      { field: "jumlah_sks", label: "Jumlah SKS" },
      { field: "link_transkip_nilai", label: "Link Transkrip Nilai" },
      { field: "link_administrasi_sidang", label: "Link Administrasi Sidang" },
      { field: "draft_final_skripsi", label: "Draft Final Skripsi" },
      { field: "status_form_sidang", label: "Status Form Sidang" },
      { field: "sidang_pembimbing_1", label: "Sidang Pembimbing 1" },
      { field: "sidang_pembimbing_2", label: "Sidang Pembimbing 2" },
      { field: "sidang_pembimbing_3", label: "Sidang Pembimbing 3" },
      { field: "sidang_status_pem_1", label: "Sidang Status Pem 1" },
      { field: "sidang_status_pem_2", label: "Sidang Status Pem 2" },
      { field: "sidang_status_pem_3", label: "Sidang Status Pem 3" },
      { field: "penguji_1", label: "Penguji 1" },
      { field: "penguji_2", label: "Penguji 2" },
      { field: "program_studi", label: "Program Studi" },
      { field: "peminatan_lab", label: "Peminatan Lab" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/update-pengajuan-sidang`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.sidang_id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tanggal_lahir: data.tanggal_lahir
          ? date.formatToInput(data.tanggal_lahir)
          : "",
      }),
    });
  }, [router, user]);

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `${FILE_DRAFT_SKRIPSI}/${form.draft_final_skripsi}`;
    downloadLink.target = "_blank";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isCheckedLab, setIsCheckedLab] = useState(false);

  const handleCheckboxChange = async (event, id) => {
    const { name, checked } = event.target;
    if (name === "sidang_status_pem_1") {
      setIsChecked1(checked);
    } else if (name === "sidang_status_pem_2") {
      setIsChecked2(checked);
    } else if (name === "sidang_status_pem_3") {
      setIsChecked3(checked);
    } else if (name === "sidang_status_kepala_lab") {
      setIsCheckedLab(checked);
    }

    try {
      const response = await axios.put(
        `${process.env.API_ENDPOINT}/tugas-akhir/approve/${id}`,
        {
          [name]: true,
          db: "ta_pendaftaran_sidang",
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

  const [activeTab, setActiveTab] = useState("form");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (form) {
      if (form?.sidang_status_pem_1 == true) {
        setIsChecked1(true);
      }
      if (form?.sidang_status_pem_2 == true) {
        setIsChecked2(true);
      }
      if (form?.sidang_status_pem_3 == true) {
        setIsChecked3(true);
      }
      if (form?.sidang_status_kepala_lab == true) {
        setIsCheckedLab(true);
      }
    }
  }, [form]);

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />

      <div className="sm:hidden">
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mt-8"
          onChange={(e) => handleTabClick(e.target.value)}
        >
          <option value="form">Form Pengajuan Sidang</option>
          <option value="link">Link Dokumen</option>
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 mt-8">
        <li className="w-full focus-within:z-10">
          <span
            onClick={() => handleTabClick("form")}
            className={`inline-block w-full p-4 border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4  focus:outline-none cursor-pointer ${
              activeTab === "form"
                ? "bg-white text-gray-700 font-bold"
                : "bg-gray-150"
            }`}
          >
            Form Pengajuan Sidang
          </span>
        </li>
        <li className="w-full focus-within:z-10">
          <span
            onClick={() => handleTabClick("link")}
            className={`inline-block w-full p-4 border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4  focus:outline-none cursor-pointer ${
              activeTab === "link"
                ? "bg-white text-gray-700 font-bold"
                : "bg-gray-50"
            }`}
          >
            Link Dokumen
          </span>
        </li>
      </ul>

      {activeTab === "form" && (
        <Form
          onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
          type="formdata"
        >
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
          <Card className="mt-4">
            <Card.Header className="text-center">
              <div>
                Permohonan Pelaksanaan Ujian Skripsi Pada Sidang Sarjana
              </div>
            </Card.Header>

            <Card.Body className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Nama</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="nama_lengkap"
                  value={form.nama_lengkap}
                  onChange={inputHandler}
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
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Tanggal Lahir</Form.Label>
                <span>:</span>
                <Form.Input
                  type="date"
                  className="flex-1 border-gray-500"
                  name="tanggal_lahior"
                  value={form.tanggal_lahir}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Alamat</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="alamat"
                  value={form.alamat}
                  onChange={inputHandler}
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
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">No Handphone</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="no_hp"
                  value={form.no_hp}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Pekerjaan</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="pekerjaan"
                  value={form.pekerjaan}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Alamat Pekerjaan
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="alamat_pekerjaan"
                  value={form.alamat_pekerjaan}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Nama Wali</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="wali"
                  value={form.wali}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Nomor Telp/HP Wali
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="telp_wali"
                  value={form.telp_wali}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Alamat Wali</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="alamat_wali"
                  value={form.alamat_wali}
                  onChange={inputHandler}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header className="text-center">
              <div>Administrasi AKademik</div>
            </Card.Header>

            <Card.Body className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Melampirkan KHS Kumulatif/Transkip </p>
                  <p>Nilai Sementara</p>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_khs"
                  value={form.link_khs}
                  placeholder="Link Google Drive"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>
                    Pas Foto Berwarna<span className="text-danger-600">*</span>
                  </p>
                  <p className="text-sm font-normal">
                    (Background biru untuk tahun
                  </p>
                  <p className="text-sm font-normal">
                    kelahiran genap dan merah untuk
                  </p>
                  <p className="text-sm font-normal">tahun kelahiran ganjil)</p>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="pas_foto"
                  onChange={inputHandler}
                />
              </Form.Group>
              {form.pas_foto && typeof form.pas_foto !== "object" && (
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Label className="min-w-[20rem]"></Form.Label>
                  <embed
                    src={`${FILE_URL}/${form.pas_foto}`}
                    className="w-65 h-[256px]"
                  />
                </Form.Group>
              )}
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Ijazah Terakhir 1 Lembar{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_ijazah_terakhir"
                  value={form.link_ijazah_terakhir}
                  placeholder="Link Google Drive"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Photocopy Sertifikat Ta aruf{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_serti_taaruf"
                  value={form.link_serti_taaruf}
                  placeholder="Link Google Drive"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Sertifikat Leadership Camp(LKKM) FTS{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_serti_lkkm"
                  value={form.link_serti_lkkm}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Sertifikat KKN
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_serti_kkn"
                  value={form.link_serti_kkn}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              {/* <Form.Group className="flex items-baseline gap-3">
          <Form.Label className="min-w-[20rem]">
            5 Eksemblar Skripsi
          </Form.Label>
          <span>:</span>
          <Form.Input
            type="text"
            className="flex-1 border-gray-500"
            name="lima_eksemlar_skripsi"
            value={form.lima_eksemlar_skripsi}
            onChange={inputHandler}
            placeholder="Otomatis"
            disabled
          />
        </Form.Group> */}
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  2 Sertifikat Kompetensi{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_serti_kompetensi"
                  value={form.link_serti_kompetensi}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Bukti Upload Jurnal/LOA{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_bukti_upload_jurnal"
                  value={form.link_bukti_upload_jurnal}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Photocopy Sertifikat TOFL{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_serti_toefl"
                  value={form.link_serti_toefl}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Telah Melunasi Administrasi Keuangan</p>
                  <p>(SPP, SKS, Konversi) </p>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_bukti_keuangan"
                  value={form.link_bukti_keuangan}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Lainya</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_lainya"
                  value={form.link_lainya}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Lulus Semua Matakuliah Lokal{" "}
                  <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Checkbox
                  type="checkbox"
                  name="status_mk"
                  checked={form.status_mk}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Maksimal Nilai D Berjumlah 1{" "}
                  <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Checkbox
                  type="checkbox"
                  name="max_nilai_d"
                  checked={form.max_nilai_d}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Minimal IPK ≥ 2,00 <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Checkbox
                  type="checkbox"
                  name="status_min_ipk"
                  checked={form.status_min_ipk}
                  onChange={inputHandler}
                />
                <span>IPK: {form.ipk}</span>
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header className="text-center">
              <div>Pendaftaran Sidang </div>
            </Card.Header>

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
                <Form.Label className="min-w-[20rem]">Program Studi</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="program_studi"
                  value={form.program_studi}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Konsentrasi/Peminatan
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="peminatan"
                  value={form.peminatan}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">Judul</Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="judul"
                  value={form.judul}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Telah Mengerjakan Kerja Praktik (KP){" "}
                  <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Checkbox
                  type="checkbox"
                  name="status_kp"
                  checked={form.status_kp}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Jumlah SKS Kumulatif Selain Skripsi
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="number"
                  className="flex-1 border-gray-500"
                  name="jumlah_sks"
                  value={form.jumlah_sks}
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Administrasi Sidang
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_administrasi_sidang"
                  value={form.link_administrasi_sidang}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Nilai IP Kumulatif Selain Skripsi</p>
                  <p>Lampirkan Seluruh Transkip Nilai </p>
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_transkip_nilai"
                  value={form.link_transkip_nilai}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              {/* <Form.Group className="flex items-baseline gap-3">
          <Form.Label className="min-w-[20rem]">
            Draft Final Skripsi Satu Eksemlar
          </Form.Label>
          <span>:</span>
          <Form.Input
            type="file"
            className="flex-1"
            name="draft_final_skripsi"
            onChange={inputHandler}
          />
        </Form.Group>
        {form.draft_final_skripsi &&
          typeof form.draft_final_skripsi !== "object" && (
            <Button
              variant="info"
              icon={
                <Icon icon="material-symbols:save" width={20} height={20} />
              }
              type="button"
              className="ml-[350px]"
              onClick={handleDownload}
            >
              Download Dokumen
            </Button>
          )} */}

              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Link Dokumen Draft Final Skripsi{" "}
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1 border-gray-500"
                  name="link_draft_final_skripsi"
                  value={form.link_draft_final_skripsi}
                  onChange={inputHandler}
                  placeholder="Link Google Drive"
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Mengisi Formulir Permohonan</p>
                  <p>Pelaksanaan Ujian Skripsi Pada</p>
                  <p>
                    Sidang Sarjana <span className="text-danger-600">*</span>
                  </p>
                </Form.Label>
                <span>:</span>
                <Form.Checkbox
                  type="checkbox"
                  name="status_form_sidang"
                  checked={form.status_form_sidang}
                  onChange={inputHandler}
                />
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
                  value={
                    form?.jadwal_pelaksanaan &&
                    date.formatToInput(form.jadwal_pelaksanaan)
                  }
                  placeholder="Diisi oleh admin"
                  onChange={inputHandler}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Penguji 1 <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Combobox
                  name="penguji_1"
                  onChange={handlePenguji1}
                  value={form.penguji_1}
                  options={listDosen?.map((dosen) => ({
                    label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                    value: dosen.user_id,
                  }))}
                  menuTarget={document.body}
                />
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Penguji 2 <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <Form.Combobox
                  name="penguji_2"
                  onChange={handlePenguji2}
                  value={form.penguji_2}
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
                      name="sidang_pembimbing_1"
                      value={form.sidang_pembimbing_1}
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
                      name="sidang_status_pem_1"
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
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
                      name="sidang_pembimbing_2"
                      value={form.sidang_pembimbing_2}
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
                      name="sidang_status_pem_2"
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                    />
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td className="text-sm border-2 border-white text-center font-bold">
                  <span>Kepala Lab</span>
                </td>
                <td className="text-sm border-2 border-white">
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Select
                      name="sidang_kepala_lab"
                      value={form.sidang_kepala_lab}
                      options={
                        listDosen &&
                        listDosen.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                        }))
                      }
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                    />
                  </Form.Group>
                </td>
                <td className="text-sm border-2 border-white">
                  <Form.Group className="flex items-center justify-center gap-3">
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      checked={isCheckedLab}
                      name="sidang_status_kepala_lab"
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                    />
                  </Form.Group>
                </td>
              </tr>
              {form.sidang_status_pem_3 && (
                <tr>
                  <td className="text-sm border-2 border-white text-center font-bold">
                    <span>Pembimbing 3 (optional)</span>
                  </td>
                  <td className="text-sm border-2 border-white">
                    <Form.Group className="flex items-baseline gap-3">
                      <Form.Select
                        name="sidang_pembimbing_3"
                        value={form.sidang_pembimbing_3}
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
                        checked={isChecked3}
                        name="sidang_status_pem_3"
                        onChange={(event) =>
                          handleCheckboxChange(event, form.sidang_id)
                        }
                      />
                    </Form.Group>
                  </td>
                </tr>
              )}
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
      )}

      {activeTab === "link" && (
        <Card className="mt-4">
          <Card.Header className="text-center">
            <div>Link Dokumen Pengajuan Sidang</div>
          </Card.Header>

          <Card.Body className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Melampirkan KHS Kumulatif/Transkip </p>
                  <p>Nilai Sementara</p>
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() => window.open(`${form.link_khs}`, "_blank")}
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Ijazah Terakhir 1 Lembar{" "}
                </Form.Label>
                <span>:</span>

                <Button
                  onClick={() =>
                    window.open(`${form.link_ijazah_terakhir}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Photocopy Sertifikat Ta aruf{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_serti_taaruf}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Sertifikat Leadership Camp(LKKM) FTS{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_serti_lkkm}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Sertifikat KKN
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_serti_kkn}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  2 Sertifikat Kompetensi{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_serti_kompetensi}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
            </div>

            <div className="space-y-4">
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Bukti Upload Jurnal/LOA{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_bukti_upload_jurnal}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Photocopy Sertifikat TOFL{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_serti_toefl}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Telah Melunasi Administrasi Keuangan</p>
                  <p>(SPP, SKS, Konversi) </p>
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_bukti_keuangan}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Administrasi Sidang
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_administrasi_sidang}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  <p>Nilai IP Kumulatif Selain Skripsi</p>
                  <p>Lampirkan Seluruh Transkip Nilai </p>
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_transkip_nilai}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]">
                  Link Dokumen Draft Final Skripsi{" "}
                </Form.Label>
                <span>:</span>
                <Button
                  onClick={() =>
                    window.open(`${form.link_draft_final_skripsi}`, "_blank")
                  }
                  variant="primary"
                  icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                  pill
                >
                  Link
                </Button>
              </Form.Group>
            </div>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
}
