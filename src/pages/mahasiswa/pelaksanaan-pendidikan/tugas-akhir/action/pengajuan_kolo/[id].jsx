import { Icon } from "@iconify-icon/react";
import Button from "../../../../../../components/Button";
import Card from "../../../../../../components/Card";
import Form from "../../../../../../components/Form";
import Layout from "../../../../../../components/Layout";
import PageHeader from "../../../../../../components/PageHeader";
import useMenu from "../../../../../../hooks/useMenu";
import useUser from "../../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useDosen from "../../../../../../repo/dosen";
import useCRUD from "../../../../../../hooks/useCRUD";
import { Loading } from "../../../../../../components/Loading";
import date from "../../../../../../utils/date";

export default function PengajuanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen();

  const [defaultData, setDefaultData] = useState({});
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
    kolo_status_pem_1: "",
    kolo_status_pem_2: "",
    kolo_status_pem_3: "",
    evaluator_1: "",
    evaluator_2: "",
    jadwal_pelaksanaan: "",
    file_makalah: "",
    status_kp: "",
    status_sks_ipk: "",
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

  const handlePembimbing1 = (selected) => {
    inputHandler({
      target: { name: "kolo_pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    inputHandler({
      target: { name: "kolo_pembimbing_2", value: selected?.value },
    });
  };

  const handlePembimbing3 = (selected) => {
    inputHandler({
      target: { name: "kolo_pembimbing_3", value: selected?.value },
    });
  };

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/pengajuan-kolokium`;
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

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

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
            <div>Form Pengajuan Kolokium</div>
            <div className="mt-2">
              <span className="font-normal">
                <b>Catatan:</b> Silahkan isi form yang dibintangi saja, data
                akan dilengkapi oleh Tata Usaha Program Studi jika status
                approved dosen pembimbing sudah diceklis.
              </span>
            </div>
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
                Judul Skripsi <span className="text-danger-600">*</span>
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
                name="ho_hp"
                value={form.no_hp}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>
                  Terdaftar sebagai mahasiswa aktif{" "}
                  <span className="text-danger-600">*</span>
                </p>
                <p>dilengkapi dengan bukti pembayaran </p>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="link_dok_mhs_aktif"
                value={form.link_dok_mhs_aktif}
                onChange={inputHandler}
                placeholder="link dokumen"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Telah Melakukan Pembayaran Kolokium{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="link_dok_pembayaran"
                value={form.link_dok_pembayaran}
                onChange={inputHandler}
                placeholder="link dokumen"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                5 Eksternal Proposal Makalah Kolokium{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="file_makalah"
                onChange={inputHandler}
              />
            </Form.Group>
            {form.file_makalah && typeof form.file_makalah !== "object" && (
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[20rem]"></Form.Label>
                <embed
                  src={`${FILE_URL}/${form.file_makalah}`}
                  className="w-full h-[256px]"
                />
              </Form.Group>
            )}

            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Telah Menyelesaikan MK Kerja Praktik
              </Form.Label>
              <span>:</span>

              <Form.Checkbox
                type="checkbox"
                name="status_kp"
                disabled
                checked={form.status_kp}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                <p>Telah Menyelesaikan 138 SKS Dengan</p>
                <p>IPK ≥ 2.00</p>
              </Form.Label>
              <span>:</span>
              <Form.Checkbox
                type="checkbox"
                name="status_sks_ipk"
                disabled
                checked={form.status_sks_ipk}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Jadwal Pelaksanaan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="jadwal_pelaksanaan"
                value={form.jadwal_pelaksanaan}
                placeholder="Diisi oleh admin"
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">Evaluator 1</Form.Label>
              <span>:</span>
              <Form.Select
                name="evaluator_1"
                onChange={inputHandler}
                value={form.evaluator_1}
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
              <Form.Label className="min-w-[20rem]">Evaluator 2</Form.Label>
              <span>:</span>
              <Form.Select
                name="evaluator_2"
                onChange={inputHandler}
                value={form.evaluator_2}
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
                <div>Dosen Terkait</div>
                <div className="mt-2">
                  <span className="font-normal">
                    <b>Catatan:</b> Silahkan isi bagian dosen saja.
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
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 1</span>{" "}
                <span className="text-danger-600">*</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Combobox
                    name="kolo_pembimbing_1"
                    onChange={handlePembimbing1}
                    value={form.kolo_pembimbing_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
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
                    disabled
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 2</span>
                <span className="text-danger-600">*</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Combobox
                    name="kolo_pembimbing_2"
                    onChange={handlePembimbing2}
                    value={form.kolo_pembimbing_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
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
                    disabled
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 3 (optional)</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Combobox
                    name="kolo_pembimbing_3"
                    onChange={handlePembimbing3}
                    value={form.kolo_pembimbing_3}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
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
                    disabled
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
