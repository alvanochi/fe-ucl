import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useCRUD from "../../../../hooks/useCRUD";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";

export default function PendidikanFormalCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kualifikasi/addPend`;
  const INITIAL_FORM = {
    asal: "",
    jenjang_studi: "",
    program_studi: "",
    gelar_akademik: "",
    tahun_masuk: "",
    tahun_lulus: "",
    tgl_lulus: "",
    nomor_induk: "",
    jmlh_semester: "",
    jmlh_sks: "",
    ipk_lulus: "",
    no_sk_penyetaraan: "",
    tgl_sk_penyetaraan: "",
    no_ijazah: "",
    judul_tesis: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "asal", label: "Asal" },
      { field: "jenjang_studi", label: "Jenjang Studi" },
      { field: "program_studi", label: "Program Studi" },
      { field: "gelar_akademik", label: "Gelar Akademik" },
      { field: "tahun_masuk", label: "Tahun Masuk" },
      { field: "tahun_lulus", label: "Tahun Lulus" },
      { field: "nomor_induk", label: "Nomor Induk" },
      { field: "jmlh_semester", label: "Jumlah Semester" },
      { field: "jmlh_sks", label: "Jumlah SKS" },
      { field: "ipk_lulus", label: "IPK Lulus" },
      { field: "no_sk_penyetaraan", label: "Nomor SK Penyetaraan" },
      { field: "tgl_sk_penyetaraan", label: "Tanggal SK Penyetaraan" },
      { field: "no_ijazah", label: "Nomor Ijazah" },
      { field: "judul_tesis", label: "Judul Tesisi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Pendidikan Formal</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jenjang Studi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="jenjang_studi"
                onChange={inputHandler}
                value={form.jenjang_studi}
                options={[
                  { label: "SD", value: "SD" },
                  { label: "SMP", value: "SMP" },
                  { label: "SMA/SMK/MA", value: "SMA/SMK/MA" },
                  { label: "D3", value: "D3" },
                  { label: "S1", value: "S1" },
                  { label: "S2", value: "S2" },
                  { label: "S3", value: "S3" },
                ]}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Asal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="asal"
                onChange={inputHandler}
                value={form.asal}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Program Studi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="program_studi"
                onChange={inputHandler}
                value={form.program_studi}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Gelar Akademik</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="gelar_akademik"
                onChange={inputHandler}
                value={form.gelar_akademik}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Masuk <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_masuk"
                onChange={inputHandler}
                value={form.tahun_masuk}
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i
                ).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Lulus <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="tahun_lulus"
                onChange={inputHandler}
                value={form.tahun_lulus}
                options={Array.from(
                  { length: new Date().getFullYear() - 1970 },
                  (_, i) => new Date().getFullYear() - i
                ).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Tanggal Lulus</Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_lulus"
                onChange={inputHandler}
                value={form.tgl_lulus}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Induk <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="nomor_induk"
                onChange={inputHandler}
                value={form.nomor_induk}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jumlah Semester Tempuh
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="jmlh_semester"
                onChange={inputHandler}
                value={form.jmlh_semester}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jumlah SKS Kelulusan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="jmlh_sks"
                onChange={inputHandler}
                value={form.jmlh_sks}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">IPK Kelulusan</Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="ipk_lulus"
                onChange={inputHandler}
                value={form.ipk_lulus}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penyetaraan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_sk_penyetaraan"
                onChange={inputHandler}
                value={form.no_sk_penyetaraan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penyetaraan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk_penyetaraan"
                onChange={inputHandler}
                value={form.tgl_sk_penyetaraan}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Nomor Ijazah</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="no_ijazah"
                onChange={inputHandler}
                value={form.no_ijazah}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Judul Tesis Disertasi
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="judul_tesis"
                onChange={inputHandler}
                value={form.judul_tesis}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Unggah File <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="file_pend"
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
