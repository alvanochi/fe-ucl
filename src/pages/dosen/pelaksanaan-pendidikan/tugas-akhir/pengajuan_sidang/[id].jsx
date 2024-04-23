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
import { toastAlert } from "../../../../../lib/sweetalert";

export default function PengajuanSidang() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen();

  const [defaultData, setDefaultData] = useState({});
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
    sidang_status_pem_1: "",
    sidang_status_pem_2: "",
    sidang_status_pem_3: "",
    penguji_1: "",
    penguji_2: "",
    judul_skripsi: "",
    program_studi: "",
    peminatan_lab: "",
    statusDosen: "",
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

  const handlePembimbing1 = (selected) => {
    inputHandler({
      target: { name: "sidang_pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    inputHandler({
      target: { name: "sidang_pembimbing_2", value: selected?.value },
    });
  };

  const handlePembimbing3 = (selected) => {
    inputHandler({
      target: { name: "sidang_pembimbing_3", value: selected?.value },
    });
  };

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/pengajuan-sidang`;
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

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const handleCheckboxChange = async (event, id) => {
    const { name, checked } = event.target;
    if (name === "sidang_status_pem_1") {
      setIsChecked1(checked);
    } else if (name === "sidang_status_pem_2") {
      setIsChecked2(checked);
    } else if (name === "sidang_status_pem_3") {
      setIsChecked3(checked);
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
    }
  }, [form]);

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
            <div>Permohonan Pelaksanaan Ujian Skripsi Pada Sidang Sarjana</div>
          </Card.Header>

          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Nama <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                NPM <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                Tanggal Lahir <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tanggal_lahior"
                value={form.tanggal_lahir}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Alamat <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="alamat"
                value={form.alamat}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Email <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="email"
                value={form.email}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                No Handphone <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_hp"
                value={form.no_hp}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Pekerjaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="pekerjaan"
                value={form.pekerjaan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Alamat Pekerjaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="alamat_pekerjaan"
                value={form.alamat_pekerjaan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Nama Wali <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="wali"
                value={form.wali}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Nomor Telp/HP Wali<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="telp_wali"
                value={form.telp_wali}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Alamat Wali<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="alamat_wali"
                value={form.alamat_wali}
                disabled
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
                Lulus Semua Matakuliah Lokal
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_mk"
                disabled
                checked={form.status_mk}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Maksimal Nilai D Berjumlah 1
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="max_nilai_d"
                disabled
                checked={form.max_nilai_d}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Melampirkan KHS Kumulatif/Transkip </p>
                <p>
                  Nilai Sementara <span className="text-danger-600">*</span>
                </p>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_khs"
                value={form.link_khs}
                placeholder="Link Google Drive"
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Minimal IPK ≥ 2,00
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_min_ipk"
                disabled
                checked={form.status_min_ipk}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Pas Foto Berwarna
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="pas_foto"
                onChange={inputHandler}
                disabled
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
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_ijazah_terakhir"
                value={form.link_ijazah_terakhir}
                placeholder="Link Google Drive"
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Photocopy Sertifikat Ta aruf{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_serti_taaruf"
                value={form.link_serti_taaruf}
                placeholder="Link Google Drive"
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Sertifikat Leadership Camp(LKKM) FTS{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_serti_lkkm"
                value={form.link_serti_lkkm}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Sertifikat KKN <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_serti_kkn"
                value={form.link_serti_kkn}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                5 Eksemblar Skripsi
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lima_eksemlar_skripsi"
                value={form.lima_eksemlar_skripsi}
                onChange={inputHandler}
                placeholder="Otomatis"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                2 Sertifikat Kompetensi{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_serti_kompetensi"
                value={form.link_serti_kompetensi}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Bukti Upload Jurnal/LOA{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_bukti_upload_jurnal"
                value={form.link_bukti_upload_jurnal}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Photocopy Sertifikat TOFL{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_serti_toefl"
                value={form.link_serti_toefl}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Telah Melunasi Administrasi Keuangan</p>
                <p>
                  (SPP, SKS, Konversi){" "}
                  <span className="text-danger-600">*</span>
                </p>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_bukti_keuangan"
                value={form.link_bukti_keuangan}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Lainya <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_lainya"
                value={form.link_lainya}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header className="text-center">
            <div>Pendaftaran Sidang </div>
          </Card.Header>

          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Nama <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                NPM <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                Program Studi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="program_studi"
                value={form.program_studi}
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Konsentrasi/Peminatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="pemintan_lab"
                value={form.peminatan_lab}
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Judul <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                Telah Mengerjakan Kerja Praktik (KP)
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_kp"
                checked={form.status_kp}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Jumlah SKS Kumulatif Selain Skripsi
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="jumlah_sks"
                value={form.jumlah_sks}
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Administrasi Sidang
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_administrasi_sidang"
                value={form.link_administrasi_sidang}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Nilai IP Kumulatif Selain Skripsi</p>
                <p>
                  Lampirkan Seluruh Transkip Nilai{" "}
                  <span className="text-danger-600">*</span>
                </p>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="link_transkip_nilai"
                value={form.link_transkip_nilai}
                onChange={inputHandler}
                placeholder="Link Google Drive"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Draft Final Skripsi Satu Eksemlar
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="draft_final_skripsi"
                onChange={inputHandler}
                disabled
              />
            </Form.Group>
            {form.draft_final_skripsi &&
              typeof form.draft_final_skripsi !== "object" && (
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Label className="min-w-[20rem]"></Form.Label>
                  <embed
                    src={`${FILE_DRAFT_SKRIPSI}/${form.draft_final_skripsi}`}
                    className="w-full h-[256px]"
                  />
                </Form.Group>
              )}
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Mengisi Formulir Permohonan</p>
                <p>Pelaksanaan Ujian Skripsi Pada</p>
                <p>sidang Sarjana</p>
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_form_sidang"
                checked={form.status_form_sidang}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Penguji 1</Form.Label>
              <span>:</span>
              <Form.Select
                name="penguji_1"
                onChange={inputHandler}
                value={form.penguji_1}
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
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Penguji 2</Form.Label>
              <span>:</span>
              <Form.Select
                name="penguji_2"
                onChange={inputHandler}
                value={form.penguji_2}
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
                <div className="mt-2">
                  <span className="font-normal">
                    <b>Catatan:</b> Silahkan tandai kotak status di bawah ini
                    jika Anda menyetujui untuk diajukan sebagai Pembimbing
                    mahasiswa terkait untuk menuju kolokium.
                  </span>
                </div>
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
            {form.statusDosen === 1 && (
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
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                      name="sidang_status_pem_1"
                      disabled={isChecked1}
                    />
                  </Form.Group>
                </td>
              </tr>
            )}
            {form.statusDosen === 2 && (
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
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                      name="sidang_status_pem_2"
                      disabled={isChecked2}
                    />
                  </Form.Group>
                </td>
              </tr>
            )}

            {form.statusDosen === 3 && (
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
                      onChange={(event) =>
                        handleCheckboxChange(event, form.sidang_id)
                      }
                      name="sidang_status_pem_3"
                      disabled={isChecked3}
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
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
