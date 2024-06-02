import { Icon } from "@iconify-icon/react";
import Card from "../../../../../../components/Card";
import Button from "../../../../../../components/Button";
import Form from "../../../../../../components/Form";
import Layout from "../../../../../../components/Layout";
import PageHeader from "../../../../../../components/PageHeader";
import useMenu from "../../../../../../hooks/useMenu";
import useUser from "../../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCRUD from "../../../../../../hooks/useCRUD";
import { Loading } from "../../../../../../components/Loading";
import date from "../../../../../../utils/date";
import Link from "next/link";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

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
    link_dok_makalah: "",
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

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>Penilaian Seminar Proposal Dan Kolokium</div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Link Dokumen</Form.Label>
            <span>:</span>
            <Link
              href={`${form.link_dok_makalah}`}
              passHref
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Link Dokumen
            </Link>
          </Form.Group>
        </Card.Body>
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
