import { Icon } from "@iconify-icon/react";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";
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
import axios from "axios";
import { MySwal, toastAlert } from "../../../../../../lib/sweetalert";
import date from "../../../../../../utils/date";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen();

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-penilaian-kolo`;
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
  };

  const { formdata, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "link_dok_mhs_aktif", label: "Link Dokumen Mahasiswa Aktif" },
      { field: "link_dok_pembayaran", label: "Link Dokumen Pembayaran" },
      { field: "file_makalah", label: "file_makalah" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form } = formdata;

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
              Nilai Akhir
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
