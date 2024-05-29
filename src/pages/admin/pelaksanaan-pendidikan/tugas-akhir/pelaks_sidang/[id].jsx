import { Icon } from "@iconify-icon/react";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
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
import EditNilai from "../../../../../components/EditPenilaian/edit-nilai";
import Link from "next/link";
import Accordion from "../../../../../components/Accordion";
import date from "../../../../../utils/date";

export default function PelaksanaanSidang() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-penilaian-sidang`;
  const FILE_URL = `${process.env.API_ENDPOINT}/ttd`;

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    sidang_id: "",
    nama_lengkap: "",
    semester: "",
    email: "",
    no_hp: "",
    npm: "",
    judul_skripsi: "",
    link_dok_mhs_aktif: "",
    link_dok_pembayaran: "",
    sidang_pembimbing_1: "",
    sidang_pembimbing_2: "",
    sidang_pembimbing_3: null,
    sidang_status_pem_1: "",
    sidang_status_pem_2: "",
    sidang_status_pem_3: "",
    penguji_1: "",
    penguji_2: "",
    // jadwal_pelaksanaan: "",
    statusDosen: "",
    penilaian_1: "",
    penilaian_2: "",
    penilaian_3: "",
    penilaian_4: "",
    penilaian_5: "",
    komentar_singkat: "",
    dosen_id: "",
    penilaian_sidang: null,
    nilai_akhir: {},
    link_draft_final_skripsi: "",
    nama: "",
    npm: "",
    judul: "",
    tanggal: "",
    waktu: "",
    tempat: "",
    ketua_penguji: "",
    pembimbing_1: "",
    pembimbing_2: "",
    penguji_1: "",
    penguji_2: "",
    sekertaris_sidang: "",
    status_kelulusan: "",
    komentar: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    status_kelulusan: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/nilai-akhir-sidang`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.sidang_id}`,
    method: "PUT",
  };

  const [ttd, setTtd] = useState({
    pembimbing_1: "",
    pembimbing_2: "",
    penguji_1: "",
    penguji_2: "",
    ketua_penguji: "",
    sekertaris_sidang: "",
  });

  const handlePembimbing1 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      pembimbing_1: selected?.ttd,
    }));
    inputHandler({
      target: { name: "pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      pembimbing_2: selected?.ttd,
    }));
    inputHandler({
      target: { name: "pembimbing_2", value: selected?.value },
    });
  };

  const handlePenguji1 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      penguji_1: selected?.ttd,
    }));
    inputHandler({
      target: { name: "penguji_1", value: selected?.value },
    });
  };

  const handlePenguji2 = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      penguji_2: selected?.ttd,
    }));
    inputHandler({
      target: { name: "penguji_2", value: selected?.value },
    });
  };

  const handleKetuaPenguji = (selected) => {
    console.log(selected);

    setTtd((prevState) => ({
      ...prevState,
      ketua_penguji: selected?.ttd,
    }));
    inputHandler({
      target: { name: "ketua_penguji", value: selected?.value },
    });
  };

  const handleSekertarisSidang = (selected) => {
    setTtd((prevState) => ({
      ...prevState,
      sekertaris_sidang: selected?.ttd,
    }));
    inputHandler({
      target: { name: "sekertaris_sidang", value: selected?.value },
    });
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        nama: data.nilai_akhir.nama,
        npm: data.nilai_akhir.npm,
        judul: data.nilai_akhir.judul,
        tanggal: data.nilai_akhir.tanggal,
        waktu: data.nilai_akhir.waktu,
        tempat: data.nilai_akhir.tempat,
        ketua_penguji: data.nilai_akhir.ketua_penguji,
        pembimbing_1: data.nilai_akhir.pembimbing_1,
        pembimbing_2: data.nilai_akhir.pembimbing_2,
        penguji_1: data.nilai_akhir.penguji_1,
        penguji_2: data.nilai_akhir.penguji_2,
        sekertaris_sidang: data.nilai_akhir.sekertaris_sidang,
        status_kelulusan: data.nilai_akhir.status_kelulusan,
        komentar: data.nilai_akhir.komentar,
      }),
    });
  }, [router, user]);

  const [selectedPeran, setSelectedPeran] = useState("");
  const peranUnik = [
    ...new Set(form?.penilaian_sidang?.map((item) => item.peran)),
  ];
  const selectedContent = form?.penilaian_sidang?.filter(
    (item) => item.peran === selectedPeran
  );

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>BERITA ACARA PELAKSANAAN UJIAN SKRIPSI</div>
        </Card.Header>

        <Accordion title="Summary" className="mt-4">
          <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
            <Card.Body className="mx-6">
              <h1>
                Pada tanggal {form.tanggal && date.formatToInput(form.tanggal)},
                pukul {form.waktu} WIB sampai dengan selesai bertempat di Ruang
                Sidang Fakultas Teknik UIKA Bogor telah berlangsung Ujian
                Skripsi (Tugas Akhir) pada Sidang Sarjana Jurusan/PS Teknik
                Informatika Fakultas Teknik dan Sains UIKA Bogor dengan
                Kandidat:
              </h1>
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
                <Form.Label className="min-w-[14rem]">
                  Tempat, Tanggal Lahir
                </Form.Label>
                <span>:</span>
                <Form.Input
                  type="text"
                  className="flex-1"
                  name="tempat_lahir"
                  value={form.tempat_lahir}
                  disabled
                />
                <Form.Input
                  type="date"
                  className="flex-1"
                  name="tanggal_lahir"
                  value={
                    form.tanggal_lahir && date.formatToInput(form.tanggal_lahir)
                  }
                  disabled
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
                <Form.Label className="min-w-[14rem]">
                  Judul Tugas Akhir
                </Form.Label>
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
                      Susunan Tim Penguji Ujian Skripsi (Tugas Akhir) pada
                      Sidang Sarjana
                    </th>
                  </tr>
                  <tr>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="flex items-center gap-2 cursor-pointer">
                        Nama
                      </div>
                    </th>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="gap-2 cursor-pointer">Jabatan</div>
                    </th>
                    <th className="text-sm border-2 border-white bg-gray-200">
                      <div className="gap-2 cursor-pointer">TTD</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="ketua_penguji"
                        value={form.ketua_penguji}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handleKetuaPenguji}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Ketua Sidang
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.ketua_penguji}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="pembimbing_1"
                        value={form.pembimbing_1}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePembimbing1}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Pembimbing Utama
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.pembimbing_1}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="pembimbing_2"
                        value={form.pembimbing_2}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePembimbing2}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Pembimbing Pendamping
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.pembimbing_2}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="penguji_1"
                        value={form.penguji_1}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePenguji1}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Penguji 1
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.penguji_1}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="penguji_2"
                        value={form.penguji_2}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handlePenguji2}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Penguji 2
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.penguji_2}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm border-2 border-white bg-gray-50 font-bold">
                      <Form.Combobox
                        name="sekertaris_sidang"
                        value={form.sekertaris_sidang}
                        options={listDosen?.map((dosen) => ({
                          label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                          value: dosen.user_id,
                          ttd: dosen.ttd,
                        }))}
                        menuTarget={document.body}
                        onChange={handleSekertarisSidang}
                      />
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      Sekertaris sidang sebagai notulis
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 text-center">
                      <img
                        src={`${FILE_URL}/${ttd.sekertaris_sidang}`}
                        alt="TTD"
                        className="w-100 h-100 object-cover border-2 border-primary-600"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <h1 className="mt-2">
                Kandidat tersebut memperoleh angka mutu: yang dikonversi ke
                huruf mutu: , sehingga{" "}
                <Form.Label className="mt-2">
                  <Form.Radio
                    name="status_kelulusan"
                    value="LULUS"
                    onChange={inputHandler}
                    checked={form.status_kelulusan === "LULUS" ? true : false}
                  />
                  Lulus
                </Form.Label>
                <Form.Label className="mt-2">
                  <Form.Radio
                    name="status_kelulusan"
                    value="LULUS BERSYARAT"
                    onChange={inputHandler}
                    checked={
                      form.status_kelulusan === "LULUS BERSYARAT" ? true : false
                    }
                  />
                  Lulus Bersyarat
                </Form.Label>
                <Form.Label className="mt-2">
                  <Form.Radio
                    name="status_kelulusan"
                    value="TIDAK LULUS"
                    checked={
                      form.status_kelulusan === "TIDAK LULUS" ? true : false
                    }
                    onChange={inputHandler}
                  />
                  Tidak Lulus
                </Form.Label>
                dengan catatan:
                <Form.Textarea
                  className="flex-1 mt-2"
                  rows="5"
                  name="komentar"
                  value={form.komentar}
                  onChange={inputHandler}
                />
              </h1>
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
      </Card>
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
              REKAPITULASI UJIAN SKRIPSI
              <Form.Group className="flex items-baseline gap-3 mt-4 mb-4">
                <Form.Label className="min-w-[6rem] ml-4">
                  Link Dokumen
                </Form.Label>
                <span>:</span>
                <Link
                  href={`${form.link_draft_final_skripsi}`}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Link Dokumen
                </Link>
              </Form.Group>
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
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
          <div class="flex justify-end">
            <div class="text-sm font-bold pr-10">
              <span className="mr-2">Nilai Akhir :</span>{" "}
              <span>{form?.nilai_akhir.nilai_akhir}</span>
            </div>
          </div>
          <div class="flex justify-end mt-2">
            <div class="text-sm font-bold pr-10">
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
                      db="ta_penilaian_sidang"
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
                      title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi Penelitian"
                      data={item.penilaian_2}
                      name="penilaian_2"
                      id={item.id}
                      onSuccess={() => show(router.query.id)}
                      db="ta_penilaian_sidang"
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
                      db="ta_penilaian_sidang"
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
                      db="ta_penilaian_sidang"
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
                      db="ta_penilaian_sidang"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Card className="mt-2">
              <div className="p-4 flex flex-col">
                <div class="flex justify-end">
                  <div class="text-sm font-bold pr-10">
                    <span className="mr-2">Nilai Akhir :</span>{" "}
                    <span>{item.final_nilai}</span>
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <div class="text-sm font-bold pr-10">
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
