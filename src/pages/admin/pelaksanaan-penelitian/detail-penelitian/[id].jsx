import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../hooks/useCRUD";
import useDosen from "../../../../repo/dosen";
import useMahasiswa from "../../../../repo/mahasiswa";
import date from "../../../../utils/date";
import { useEffect } from "react";
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from "../../../../config/role";
import _ from "underscore";
import Accordion from "../../../../components/Accordion";

export default function DetailPenelitianAdmin() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/penelitian/detailPenelitian`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-penelitian`;

  const INITIAL_FORM = {
    penelitian_id: "",
    judul_kegiatan: "",
    kelompok_bidang: "",
    lokasi_kegiatan: "",
    tahun_usulan: "",
    tahun_kegiatan: "",
    tahun_pelaksanaan: "",
    lama_kegiatan: "",
    no_sk_penugasan: "",
    tgl_sk_penugasan: "",
    nama_dok: "",
    keterangan: "",
    tautan_dok: "",
    anggota_penelitian_dosen: [],
    anggota_penelitian_mahasiswa: [],
    docs: [],
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    transformData: (data) =>
      _.omit(
        {
          ...data,
          anggota_penelitian: JSON.stringify([
            ...data.anggota_penelitian_dosen.map((item) =>
              _.omit(item, ["role"])
            ),
            ...data.anggota_penelitian_mahasiswa.map((item) =>
              _.omit(item, ["role"])
            ),
          ]),
        },
        ["anggota_penelitian_dosen", "anggota_penelitian_mahasiswa"]
      ),
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, setForm } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...INITIAL_FORM,
        ...data.dataPenelitian[0],
        tgl_sk_penugasan: date.formatToInput(
          data.dataPenelitian[0].tgl_sk_penugasan
        ),
        anggota_penelitian_dosen: data.anggotaPenelitian.filter(
          (item) => item.role == ROLE_ID_DOSEN
        ),
        anggota_penelitian_mahasiswa: data.anggotaPenelitian.filter(
          (item) => item.role == ROLE_ID_MAHASISWA
        ),
        docs: data.dataDokumen,
      }),
    });
  }, [router, user]);

  if (
    [user, menu, isDosenLoading, isMahasiswaLoading].some(
      (item) => item == null
    )
  )
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Penelitian</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_kegiatan"
                onChange={inputHandler}
                value={form.judul_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kelompok Bidang <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kelompok_bidang"
                onChange={inputHandler}
                value={form.kelompok_bidang}
                disabled
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
                onChange={inputHandler}
                value={form.lokasi_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Usulan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_usulan"
                onChange={inputHandler}
                value={form.tahun_usulan}
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i
                ).map((item) => ({
                  label: item,
                  value: item,
                }))}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_kegiatan"
                onChange={inputHandler}
                value={form.tahun_kegiatan}
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i
                ).map((item) => ({
                  label: item,
                  value: item,
                }))}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Pelaksanaan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_pelaksanaan"
                onChange={inputHandler}
                value={form.tahun_pelaksanaan}
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i
                ).map((item) => ({
                  label: item,
                  value: item,
                }))}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Lama Kegiatan (Tahun) <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lama_kegiatan"
                onChange={inputHandler}
                value={form.lama_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_sk_penugasan"
                onChange={inputHandler}
                value={form.no_sk_penugasan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk_penugasan"
                onChange={inputHandler}
                value={form.tgl_sk_penugasan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex-1 block">
                <div className="space-y-2 mt-2">
                  {form.docs.map((doc, index) => (
                    <Accordion
                      key={`doc-${index}`}
                      title={`Dokumen ${index + 1}`}
                    >
                      <Form.Group className="mb-4">
                        <Form.Label>Nama Dokumen</Form.Label>
                        <Form.Input
                          type="text"
                          className="flex-1"
                          defaultValue={doc.nama_dok}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Keterangan</Form.Label>
                        <Form.Input
                          type="text"
                          className="flex-1"
                          defaultValue={doc.keterangan}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Tautan Dokumen</Form.Label>
                        <Form.Input
                          type="text"
                          className="flex-1"
                          defaultValue={doc.tautan_dok}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <embed
                          src={`${FILE_URL}/${doc.file}`}
                          className="w-full h-[256px]"
                        />
                      </Form.Group>
                    </Accordion>
                  ))}
                </div>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th
                colSpan={4}
                className="text-sm border-2 border-white bg-gray-50"
              >
                Anggota Dosen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama Peran
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Status
              </th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.anggota_penelitian_dosen.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_dosen.user_id"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_dosen[index].user_id}
                    options={
                      listDosen &&
                      listDosen.map((dosen) => ({
                        label: dosen.nama_lengkap,
                        value: dosen.user_id,
                      }))
                    }
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_dosen.peran"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_dosen[index].peran}
                    options={[
                      { label: "Ketua", value: "ketua" },
                      { label: "Anggota", value: "anggota" },
                    ]}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="anggota_penelitian_dosen.status"
                      onChange={inputHandler}
                      checked={form.anggota_penelitian_dosen[index].status}
                      disabled
                    />{" "}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th
                colSpan={4}
                className="text-sm border-2 border-white bg-gray-50"
              >
                Anggota Mahasiswa
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama Peran
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Status
              </th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.anggota_penelitian_mahasiswa.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_mahasiswa.user_id"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_mahasiswa[index].user_id}
                    options={
                      listMahasiswa &&
                      listMahasiswa.map((dosen) => ({
                        label: dosen.nama_lengkap,
                        value: dosen.user_id,
                      }))
                    }
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="anggota_penelitian_mahasiswa.peran"
                    onChange={inputHandler}
                    value={form.anggota_penelitian_mahasiswa[index].peran}
                    options={[
                      { label: "Ketua", value: "ketua" },
                      { label: "Anggota", value: "anggota" },
                    ]}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="anggota_penelitian_mahasiswa.status"
                      onChange={inputHandler}
                      checked={form.anggota_penelitian_mahasiswa[index].status}
                      disabled
                    />{" "}
                    Aktif
                  </Form.Label>
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1"></div>
                </td>
              </tr>
            ))}
          </tbody>
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
