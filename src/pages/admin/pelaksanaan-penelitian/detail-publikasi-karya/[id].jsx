import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../hooks/useCRUD";
import _ from "underscore";
import useDosen from "../../../../repo/dosen";
import useMahasiswa from "../../../../repo/mahasiswa";
import { useEffect } from "react";
import date from "../../../../utils/date";
import { ROLE_ID_DOSEN, ROLE_ID_MAHASISWA } from "../../../../config/role";
import Accordion from "../../../../components/Accordion";
import useKategoriPublikasi from "../../../../repo/kategori-publikasi";

export default function PublikasiKaryaDetail() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/penelitian/publikasi-karya/detailPublikasi`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-publikasi-karya`;

  const INITIAL_FORM = {
    publikasi_id: "",
    kategori_id: "",
    judul_artikel: "",
    jenis: "",
    kategori_capain: "",
    nama_jurnal: "",
    tautan_jurnal: "",
    tgl_terbit: "",
    penerbit: "",
    tautan_eksternal: "",
    keterangan: "",
    nama_dok: "",
    keterangan_dok: "",
    tautan_dok: "",
    point: "",
    tingkatan: "",
    penulis_dosen: [],
    penulis_mahasiswa: [],
    docs: [],
  };

  const { formdata, show } = useCRUD(API_URL, INITIAL_FORM, {
    transformData: (data) =>
      _.omit(
        {
          ...data,
          penulis: JSON.stringify([
            ...data.penulis_dosen.map((item) => _.omit(item, ["role"])),
            ...data.penulis_mahasiswa.map((item) => _.omit(item, ["role"])),
          ]),
        },
        ["penulis_dosen", "penulis_mahasiswa"]
      ),
    success: () => router.push(prefix + menu.url),
  });

  const { form, setForm } = formdata;

  const { data: kategoriPublikasi, isLoading: isLoadingKategoriPublikasi } =
    useKategoriPublikasi([user]);
  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...INITIAL_FORM,
        ...data.dataPublikasi[0],
        tgl_terbit: date.formatToInput(data.dataPublikasi[0].tgl_terbit),
        penulis_dosen: data.dataPenulis.filter(
          (item) => item.role == ROLE_ID_DOSEN
        ),
        penulis_mahasiswa: data.dataPenulis.filter(
          (item) => item.role == ROLE_ID_MAHASISWA
        ),
        docs: data.dataDokumen,
      }),
    });
  }, [router, user]);

  if (
    [
      user,
      menu,
      isDosenLoading,
      isMahasiswaLoading,
      isLoadingKategoriPublikasi,
    ].some((item) => item == null)
  )
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Publikasi Karya</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Publikasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                options={
                  kategoriPublikasi &&
                  kategoriPublikasi.map((item) => ({
                    label: `${item.nama_kategori} - ${item.tingkatan}`,
                    value: item.id,
                  }))
                }
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Point <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="point"
                value={form.point}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Artikel <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_artikel"
                value={form.judul_artikel}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenis <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenis"
                value={form.jenis}
                options={[
                  {
                    label: "Jurnal internasional",
                    value: "Jurnal internasional",
                  },
                  {
                    label: "Jurnal internasional bereputasi",
                    value: "Jurnal internasional bereputasi",
                  },
                  {
                    label: "Makalah ilmiah",
                    value: "Makalah ilmiah",
                  },
                  {
                    label: "Tulisan ilmiah",
                    value: "Tulisan ilmiah",
                  },
                  {
                    label: "Prosiding seminar internasional",
                    value: "Prosiding seminar internasional",
                  },
                  {
                    label: "Artikel ilmiah",
                    value: "Artikel ilmiah",
                  },
                  {
                    label: "Buku referensi",
                    value: "Buku referensi",
                  },
                  {
                    label: "Buku lainnya",
                    value: "Buku lainnya",
                  },
                ]}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Capain <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_capain"
                value={form.kategori_capain}
                options={[
                  {
                    label: "Pembicara",
                    value: "Pembicara",
                  },
                  {
                    label: "Visiting Scientist",
                    value: "Visiting Scientist",
                  },
                  {
                    label: "Produk Teknologi Tepat Guna",
                    value: "Produk Teknologi Tepat Guna",
                  },
                  {
                    label: "Jenis Luaran Lainnya",
                    value: "Jenis Luaran Lainnya",
                  },
                  {
                    label: "Publikasi",
                    value: "Publikasi",
                  },
                  {
                    label: "HKI",
                    value: "HKI",
                  },
                  {
                    label: "Buku",
                    value: "Buku",
                  },
                ]}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Jurnal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_jurnal"
                value={form.nama_jurnal}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tautan Jurnal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="tautan_jurnal"
                value={form.tautan_jurnal}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal Terbit <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_terbit"
                value={form.tgl_terbit}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tautan Eksternal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="tautan_eksternal"
                value={form.tautan_eksternal}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Penerbit <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="penerbit"
                value={form.penerbit}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Keterangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="keterangan"
                value={form.keterangan}
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
                          defaultValue={doc.keterangan_dok}
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
                colSpan={6}
                className="text-sm border-2 border-white bg-gray-50"
              >
                Penulis Dosen
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Urutan
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Affiliasi
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Peran
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Corresponding Author
              </th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.penulis_dosen.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="penulis_dosen.user_id"
                    value={form.penulis_dosen[index].user_id}
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
                  <Form.Input
                    type="number"
                    min="0"
                    index={index}
                    name="penulis_dosen.urutan"
                    value={form.penulis_dosen[index].urutan}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Input
                    type="text"
                    index={index}
                    name="penulis_dosen.afiliasi"
                    value={form.penulis_dosen[index].afiliasi}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="penulis_dosen.peran"
                    value={form.penulis_dosen[index].peran}
                    options={[
                      { label: "Penulis", value: "Penulis" },
                      { label: "Editor", value: "Editor" },
                      { label: "Penerjemah", value: "Penerjemah" },
                      { label: "Penemu/Inventor", value: "Penemu/Inventor" },
                    ]}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="penulis_dosen.correspond"
                      checked={form.penulis_dosen[index].correspond}
                      disabled
                    />{" "}
                    Ya
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
                colSpan={6}
                className="text-sm border-2 border-white bg-gray-50"
              >
                Penulis Mahasiswa
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Urutan
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Affiliasi
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Peran
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Corresponding Author
              </th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.penulis_mahasiswa.map((item, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="penulis_mahasiswa.user_id"
                    value={form.penulis_mahasiswa[index].user_id}
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
                  <Form.Input
                    type="number"
                    min="0"
                    index={index}
                    name="penulis_mahasiswa.urutan"
                    value={form.penulis_mahasiswa[index].urutan}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Input
                    type="text"
                    index={index}
                    name="penulis_mahasiswa.afiliasi"
                    value={form.penulis_mahasiswa[index].afiliasi}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Select
                    index={index}
                    name="penulis_mahasiswa.peran"
                    value={form.penulis_mahasiswa[index].peran}
                    options={[
                      { label: "Penulis", value: "Penulis" },
                      { label: "Editor", value: "Editor" },
                      { label: "Penerjemah", value: "Penerjemah" },
                      { label: "Penemu/Inventor", value: "Penemu/Inventor" },
                    ]}
                    disabled
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Label>
                    <Form.Checkbox
                      index={index}
                      name="penulis_mahasiswa.correspond"
                      checked={form.penulis_mahasiswa[index].correspond}
                      disabled
                    />{" "}
                    Ya
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
