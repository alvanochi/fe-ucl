import { useRouter } from "next/router";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import date from "../../../../../utils/date";

export default function PendidikanFormalEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/kualifikasi/detailPend`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-pendFormal`;

  const INITIAL_FORM = {
    pend_id: "",
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
    file: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/kualifikasi/editDataPend`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.pend_id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;

    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tgl_lulus: data.tgl_lulus ? date.formatToInput(data.tgl_lulus) : "",
        tgl_sk_penyetaraan: data.no_sk_penyetaraan
          ? date.formatToInput(data.tgl_sk_penyetaraan)
          : "",
      }),
    });
  }, [router, user]);

  if ([user, menu, form].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
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
              <Form.Label className="min-w-[18rem]">
                Program Studi <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[18rem]">
                Gelar Akademik <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[18rem]">
                Tanggal Lulus <span className="text-danger-600">*</span>
              </Form.Label>
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
                type="text"
                className="flex-1"
                name="nomor_induk"
                onChange={inputHandler}
                value={form.nomor_induk}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jumlah Semester Tempuh{" "}
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="jmlh_semester"
                onChange={inputHandler}
                value={form.jmlh_semester}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Jumlah SKS Kelulusan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="jmlh_sks"
                onChange={inputHandler}
                value={form.jmlh_sks}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                IPK Kelulusan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="ipk_lulus"
                onChange={inputHandler}
                value={form.ipk_lulus}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penyetaraan <span className="text-danger-600">*</span>
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
                Tanggal SK Penyetaraan{" "}
                <span className="text-danger-600">*</span>
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
              <Form.Label className="min-w-[18rem]">
                Nomor Ijazah <span className="text-danger-600">*</span>
              </Form.Label>
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
                Judul Tesis Disertasi <span className="text-danger-600">*</span>
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
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="file_pend"
                  onChange={inputHandler}
                />
                <embed
                  src={`${FILE_URL}/${form.file}`}
                  className="w-full h-[256px]"
                />
              </div>
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
