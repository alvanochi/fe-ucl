import { Icon } from "@iconify-icon/react";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import useDosen from "../../../../../repo/dosen";
import useCRUD from "../../../../../hooks/useCRUD";
import { Loading } from "../../../../../components/Loading";
import axios from "axios";
import { MySwal, toastAlert } from "../../../../../lib/sweetalert";
import date from "../../../../../utils/date";
import EditNilai from "../../../../../components/EditPenilaian/edit-nilai";
import Link from "next/link";
import Accordion from "../../../../../components/Accordion";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-penilaian-kolo`;

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
    statusDosen: "",
    penilaian_1: "",
    penilaian_2: "",
    penilaian_3: "",
    penilaian_4: "",
    penilaian_5: "",
    komentar_singkat: "",
    dosen_id: "",
    penilaian_kolo: null,
    nilai_akhir: {},
    judul: "",
    link_dok_makalah: "",
    nama: "",
    npm: "",
    tempat: "",
    judul: "",
    tanggal: "",
    waktu: "",
    tempat: "",
    pembimbing_1: "",
    pembimbing_2: "",
    evaluator_1: "",
    evaluator_2: "",
    komentar: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
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
      target: { name: "pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    inputHandler({
      target: { name: "pembimbing_2", value: selected?.value },
    });
  };

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

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/nilai-akhir-kolo`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.kolo_id}`,
    method: "PUT",
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        jadwal_pelaksanaan: data.jadwal_pelaksanaan
          ? date.formatToInput(data.jadwal_pelaksanaan)
          : "",
        pembimbing_1: data.nilai_akhir.pembimbing_1,
        pembimbing_2: data.nilai_akhir.pembimbing_2,
        evaluator_1: data.nilai_akhir.evaluator_1,
        evaluator_2: data.nilai_akhir.evaluator_2,
        komentar: data.nilai_akhir.komentar,
        nama: data.nilai_akhir.nama,
        judu: data.nilai_akhir.judul,
        npm: data.nilai_akhir.npm,
        tempat: data.nilai_akhir.tempat,
        waktu: data.nilai_akhir.waktu,
        tanggal: data.nilai_akhir.tanggal,
      }),
    });
  }, [router, user]);

  const [selectedPeran, setSelectedPeran] = useState("");
  const peranUnik = [
    ...new Set(form?.penilaian_kolo?.map((item) => item.peran)),
  ];
  const selectedContent = form?.penilaian_kolo?.filter(
    (item) => item.peran === selectedPeran
  );

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>
            BERITA ACARA DAN PENILAIAN SEMINAR PROPOSAL / KOLOKIUM SKRIPSI
            MAHASISWA
          </div>
        </Card.Header>
      </Card>
      <div className="flex-1 block">
        <div className="space-y-2 mt-4">
          <Accordion title="Summary">
            <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
              <Card.Body className="mx-6">
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">Nama</Form.Label>
                  <span>:</span>
                  <Form.Input
                    type="text"
                    className="flex-1"
                    name="nama"
                    value={form.nama}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">NPM</Form.Label>
                  <span>:</span>
                  <Form.Input
                    type="text"
                    className="flex-1"
                    name="npm"
                    value={form.npm}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">Judul</Form.Label>
                  <span>:</span>
                  <Form.Input
                    type="text"
                    className="flex-1"
                    name="judul"
                    value={form.judul}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">
                    Jadwal Pelaksanaan
                  </Form.Label>
                  <span>:</span>
                  <Form.Input
                    type="date"
                    className="flex-1"
                    name="tanggal"
                    value={form.tanggal && date.formatToInput(form.tanggal)}
                    placeholder="Diisi oleh admin"
                  />
                  <Form.Input
                    type="time"
                    className="flex-1"
                    name="waktu"
                    value={form.waktu}
                    placeholder="Diisi oleh admin"
                    onChange={inputHandler}
                  />
                  <Form.Input
                    type="text"
                    className="flex-1"
                    name="tempat"
                    value={form.tempat}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">
                    Pembimbing yang diusulkan
                  </Form.Label>
                  <span>:</span>
                  <Form.Combobox
                    name="pembimbing_1"
                    value={form.pembimbing_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handlePembimbing1}
                  />
                  <Form.Combobox
                    name="pembimbing_2"
                    value={form.pembimbing_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handlePembimbing2}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">Evaluator</Form.Label>
                  <span>:</span>
                  <Form.Combobox
                    name="evaluator_1"
                    value={form.evaluator_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handleEvaluator1}
                  />
                  <Form.Combobox
                    name="evaluator_2"
                    value={form.evaluator_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                    onChange={handleEvaluator2}
                  />
                </Form.Group>
                <Form.Group className="flex items-baseline gap-3 mt-4">
                  <Form.Label className="min-w-[14rem]">
                    Komentar Singkat
                  </Form.Label>
                  <span>:</span>
                  <Form.Textarea
                    className="flex-1 mt-2"
                    rows="5"
                    name="komentar"
                    value={form.komentar}
                    onChange={inputHandler}
                  />
                </Form.Group>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="info"
                    className="w-1/2 h-12 mt-4"
                  >
                    Save
                  </Button>
                </div>
              </Card.Body>
            </Form>
          </Accordion>
        </div>
      </div>
      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
        style={{ marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th
              colSpan={4}
              className="text-sm border-2 border-white bg-gray-50"
            >
              REKAPITULASI SEMINAR PROPOSAL
              <Button
                onClick={() =>
                  window.open(`${form.link_dok_makalah}`, "_blank")
                }
                variant="primary"
                icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                pill
              >
                Link Dokumen Makalah
              </Button>
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200 w-12">
              <div className="flex gap-2">No</div>
            </th>

            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 ">Aspek Penilaian</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 ">Presentase (%)</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="gap-2 ">Nilai</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">1</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Subtansi dan Orientasi Topik Penilitian
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              20%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_1}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">2</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
              Penelitian
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              40%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_2}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">3</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Organisasi, kelengkapan dan Teknik Penulisan Makalah
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_3}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">4</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Penyajian Makalah dan Tampilan Slide
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              10%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_4}
            </td>
          </tr>
          <tr>
            <td className="text-sm border-2 border-white bg-gray-50">5</td>
            <td className="text-sm border-2 border-white bg-gray-50">
              Argumentasi
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              20%
            </td>
            <td className="text-sm border-2 border-white bg-gray-50 text-center">
              {form?.nilai_akhir.penilaian_5}
            </td>
          </tr>
        </tbody>
      </table>
      <Card className="mt-2">
        <div className="p-4 flex flex-col">
          <div className="flex justify-end">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Nilai Akhir :</span>{" "}
              <span>{form?.nilai_akhir.nilai_akhir}</span>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <div className="text-sm font-bold pr-10">
              <span className="mr-2">Huruf Mutu :</span>{" "}
              <span>{form?.nilai_akhir.huruf_mutu}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => setSelectedPeran(e.target.value)}
          value={selectedPeran}
        >
          <option value="">Select Peran</option>
          {peranUnik.map((peran) => (
            <option key={peran} value={peran}>
              {peran}
            </option>
          ))}
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex mt-8">
        {peranUnik.map((peran) => (
          <li className="w-full focus-within:z-10" key={peran}>
            <a
              href="#"
              className={`inline-block w-full p-4 ${
                peran === selectedPeran
                  ? "text-gray-900 bg-gray-300 border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none"
                  : "bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              }`}
              aria-current={peran === selectedPeran ? "page" : undefined}
              onClick={() => setSelectedPeran(peran)}
            >
              {peran}
            </a>
          </li>
        ))}
      </ul>

      <div className="content-tab">
        {selectedContent?.map((item) => (
          <div key={item.id}>
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
              cellPadding={10}
              style={{ marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="flex items-center gap-2 cursor-pointer">
                      No
                    </div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="flex items-center gap-2 cursor-pointer">
                      Aspek Penilaian
                    </div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Presentase (%)</div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Nilai</div>
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    <div className="gap-2 cursor-pointer">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    1
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Subtansi dan Orientasi Topik Penilitian
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    20%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_1}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Subtansi dan Orientasi Topik Penilitian"
                      data={item.penilaian_1}
                      name="penilaian_1"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    2
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    40%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_2}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                      Penelitian"
                      data={item.penilaian_2}
                      name="penilaian_2"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    3
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Organisasi, kelengkapan dan Teknik Penulisan Makalah
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_3}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                      data={item.penilaian_3}
                      name="penilaian_3"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    4
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Penyajian Makalah dan Tampilan Slide
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    10%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_4}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Penyajian Makalah dan Tampilan Slide"
                      data={item.penilaian_4}
                      name="penilaian_4"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    5
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    Argumentasi
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    20%
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 text-center">
                    {item.penilaian_5}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                    <EditNilai
                      title="Argumentasi"
                      data={item.penilaian_5}
                      name="penilaian_5"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_kolokium"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Card className="mt-2">
              <div className="p-4 flex flex-col">
                <div className="flex justify-end">
                  <div className="text-sm font-bold pr-10">
                    <span className="mr-2">Nilai Akhir :</span>{" "}
                    <span>{item.final_nilai}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <div className="text-sm font-bold pr-10">
                    <span className="mr-2">Huruf Mutu :</span>{" "}
                    <span>{item.huruf_mutu}</span>
                  </div>
                </div>
              </div>
            </Card>
            <Form.Textarea
              className="flex-1 mt-2"
              rows="5"
              value={`Komentar Singkat : ${item.komentar_singkat}`}
              disabled
            />
          </div>
        ))}
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
    </Layout>
  );
}
