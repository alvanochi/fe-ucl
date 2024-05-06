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
import axios from "axios";
import { MySwal, toastAlert } from "../../../../../lib/sweetalert";
import date from "../../../../../utils/date";
import EditNilai from "../../../../../components/EditPenilaian/edit-nilai";
import EditKomentar from "../../../../../components/EditPenilaian/edit-komentar";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-penilaian-kolo-dosen`;
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
    statusDosen: "",
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

  const CREATE_URL = `${process.env.API_ENDPOINT}/tugas-akhir/penilaian-kolo`;
  const CREATE_OPTION = { url: `${CREATE_URL}`, method: "POST" };

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

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Card className="mt-4">
        <Card.Header className="text-center">
          <div>Penilaian Seminar Proposal Dan Kolokium</div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[20rem]">Nama</Form.Label>
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
            <Form.Label className="min-w-[20rem]">NPM</Form.Label>
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
            <Form.Label className="min-w-[20rem]">Judul Skripsi</Form.Label>
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
            <Form.Label className="min-w-[20rem]">
              {form.statusDosen === "evaluator_1"
                ? "Evaluator 1"
                : form.statusDosen === "evaluator_2"
                ? "Evaluator 2"
                : form.statusDosen === "pembimbing_1"
                ? "Pembimbing 1"
                : form.statusDosen === "pembimbing_2"
                ? "Pembimbing 2"
                : form.statusDosen === "pembimbing_3"
                ? "Pembimbing 3"
                : ""}
            </Form.Label>
            <span>:</span>
            <Form.Select
              name="dosen_id"
              value={
                form.statusDosen === "evaluator_1"
                  ? form.evaluator_1
                  : form.statusDosen === "evaluator_2"
                  ? form.evaluator_2
                  : form.statusDosen === "pembimbing_1"
                  ? form.kolo_pembimbing_1
                  : form.statusDosen === "pembimbing_2"
                  ? form.kolo_pembimbing_2
                  : form.statusDosen === "pembimbing_3"
                  ? form.kolo_pembimbing_3
                  : ""
              }
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

      {form.penilaian_kolo == null &&
        form.statusDosen !== "" &&
        form.statusDosen !== "kepala_lab" && (
          <>
            <Form onSubmit={(event) => submitHandler(event, CREATE_OPTION)}>
              <Card className="mt-4">
                <Card.Header className="text-center">
                  <div>Penilaian (0 - 100)</div>
                </Card.Header>

                <Card.Body className="space-y-4">
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Substansi dan Orientasi Topik Penelitian{" "}
                      <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_1"
                      value={form.penilaian_1}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      <p>Konsistensi Antara Masalah, Tujuan</p>
                      <p>
                        Penelitian dan Metodologi Penelitian{" "}
                        <span className="text-danger-600">*</span>
                      </p>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_2"
                      value={form.penilaian_2}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      <p>Organisasi, Kelengkapan dan Teknis </p>
                      <p>
                        Penulisan Makalah{" "}
                        <span className="text-danger-600">*</span>
                      </p>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_3"
                      value={form.penilaian_3}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Penyajian Makalah dan Tampilan Slide{" "}
                      <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_4"
                      value={form.penilaian_4}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Argumentasi <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Input
                      type="number"
                      className="flex-1"
                      name="penilaian_5"
                      value={form.penilaian_5}
                      onChange={inputHandler}
                      min={1}
                      max={100}
                    />
                  </Form.Group>
                  <Form.Group className="flex items-baseline gap-3">
                    <Form.Label className="min-w-[20rem]">
                      Komentar Singkat{" "}
                      <span className="text-danger-600">*</span>
                    </Form.Label>
                    <span>:</span>
                    <Form.Textarea
                      className="flex-1"
                      rows="5"
                      name="komentar_singkat"
                      value={form.komentar_singkat}
                      onChange={inputHandler}
                    />
                  </Form.Group>
                </Card.Body>
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
                <Button type="submit" variant="primary" className="w-full h-12">
                  Konfirmasi
                </Button>
              </div>
            </Form>
          </>
        )}

      {form.penilaian_kolo && (
        <>
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
                <td className="text-sm border-2 border-white bg-gray-50">1</td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  Subtansi dan Orientasi Topik Penilitian
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  20%
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {form.penilaian_kolo?.penilaian_1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Subtansi dan Orientasi Topik Penilitian"
                    data={form.penilaian_kolo?.penilaian_1}
                    name="penilaian_1"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolo"
                  />
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
                  {form.penilaian_kolo?.penilaian_2}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Konsistensi Antara Masalah, Tujuan Penelitian dan Metodologi
                    Penelitian"
                    data={form.penilaian_kolo?.penilaian_2}
                    name="penilaian_2"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolo"
                  />
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
                  {form.penilaian_kolo?.penilaian_3}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Organisasi, kelengkapan dan Teknik Penulisan Makalah"
                    data={form.penilaian_kolo?.penilaian_3}
                    name="penilaian_3"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolo"
                  />
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
                  {form.penilaian_kolo?.penilaian_4}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Penyajian Makalah dan Tampilan Slide"
                    data={form.penilaian_kolo?.penilaian_4}
                    name="penilaian_4"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolo"
                  />
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
                  {form.penilaian_kolo?.penilaian_5}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 flex justify-center items-center">
                  <EditNilai
                    title="Argumentasi"
                    data={form.penilaian_kolo?.penilaian_5}
                    name="penilaian_5"
                    id={form.penilaian_kolo?.id}
                    onSuccess={() => show(router.query.id)}
                    db="ta_penilaian_kolo"
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
                  <span>{form.penilaian_kolo?.final_nilai}</span>
                </div>
              </div>
              <div class="flex justify-end mt-2">
                <div class="text-sm font-bold pr-10">
                  <span className="mr-2">Huruf Mutu :</span>{" "}
                  <span>{form.penilaian_kolo?.huruf_mutu}</span>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex">
            <div className="relative flex-1">
              <Form.Textarea
                className="mt-2"
                rows="5"
                value={`Komentar Singkat : ${form.penilaian_kolo?.komentar_singkat}`}
                disabled
              />
            </div>
            <div className="ml-4 mt-6">
              <EditKomentar
                title="Komentar Singkat"
                data={form.penilaian_kolo?.komentar_singkat}
                name="komentar_singkat"
                id={form.penilaian_kolo?.id}
                onSuccess={() => show(router.query.id)}
                db="ta_penilaian_kolo"
              />
            </div>
          </div>

          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
            Kembali
          </Button>
        </>
      )}

      {(form.statusDosen == "" || form.statusDosen == "kepala_lab") && (
        <>
          <h1 className="pt-4 text-center">Halaman tidak tersedia</h1>
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
        </>
      )}
    </Layout>
  );
}
