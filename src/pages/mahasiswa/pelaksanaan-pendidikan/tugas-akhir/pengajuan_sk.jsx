import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useDosen from "../../../../repo/dosen";
import useCRUD from "../../../../hooks/useCRUD";
import { Loading } from "../../../../components/Loading";

export default function BimbinganMahasiswaCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir`;

  const INITIAL_FORM = {
    judul_skripsi: "",
    lokasi_kegiatan: "",
    semester: "",
    sk_pembimbing_1: "",
    sk_pembimbing_2: "",
    sk_pembimbing_3: null,
    kepala_lab: "",
  };

  const handlePembimbing1 = (selected) => {
    inputHandler({
      target: { name: "sk_pembimbing_1", value: selected?.value },
    });
  };

  const handlePembimbing2 = (selected) => {
    inputHandler({
      target: { name: "sk_pembimbing_2", value: selected?.value },
    });
  };

  const handlePembimbing3 = (selected) => {
    inputHandler({
      target: { name: "sk_pembimbing_3", value: selected?.value },
    });
  };

  const handleKepalaLab = (selected) => {
    inputHandler({ target: { name: "kepala_lab", value: selected?.value } });
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "judul_skripsi", label: "Judul Skripsi" },
      { field: "lokasi_kegiatan", label: "Lokasi Kegiatan" },
      { field: "semester", label: "semester" },
      { field: "sk_pembimbing_1", label: "Pembimbing 1" },
      { field: "sk_pembimbing_2", label: "Pembimbing 2" },
      { field: "kepala_lab", label: "Kepala Lab" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, inputHandlerComboBox } = formdata;

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Pengajuan SK</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Skripsi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_skripsi"
                value={form.judul_skripsi}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Lokasi Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lokasi_kegiatan"
                value={form.lokasi_kegiatan}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Semester <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="semester"
                min={7}
                max={14}
                value={form.semester}
                onChange={inputHandler}
                required
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Mahasiswa table */}
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama Mahasasiswa
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm border-2 border-white text-center">
                {user?.nama_lengkap}
              </td>
            </tr>
          </tbody>
        </table>

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
                Dosen Terkait
                <div className="mt-2">
                  <span className="font-normal">
                    <b>Catatan:</b> Pastikan sudah berkomunikasi dengan dosen
                    terkait sebelum mengajukan SK Pembimbing Tugas Akhir.
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
                    name="sk_pembimbing_1"
                    onChange={handlePembimbing1}
                    value={form.sk_pembimbing_1}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
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
                    name="sk_pembimbing_2"
                    onChange={handlePembimbing2}
                    value={form.sk_pembimbing_2}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Pembimbing 3 (Optional)</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Combobox
                    name="sk_pembimbing_3"
                    onChange={handlePembimbing3}
                    value={form.sk_pembimbing_3}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td className="text-sm border-2 border-white text-center font-bold">
                <span>Kepala Lab</span>{" "}
                <span className="text-danger-600">*</span>
              </td>
              <td className="text-sm border-2 border-white">
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Combobox
                    onChange={handleKepalaLab}
                    value={form.kepala_lab}
                    options={listDosen?.map((dosen) => ({
                      label: `${dosen.nama_lengkap} - ${dosen.nip}`,
                      value: dosen.user_id,
                    }))}
                    menuTarget={document.body}
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
