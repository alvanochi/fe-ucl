import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import useKategoriProfesi from "../../../../../repo/kategori-profesi";
import {
  getMonthOptions,
  getYearOptions,
} from "../../../../../repo/bulan-tahun";
import { Loading } from "../../../../../components/Loading";

export default function AnggotaProfesiEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/penunjang/detailProfesi`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-profesi`;

  const INITIAL_FORM = {
    prof_id: "",
    kategori_id: "",
    nama_organisasi: "",
    peran: "",
    mulai_tahun: "",
    mulai_bulan: "",
    selesai_tahun: "",
    selesai_bulan: "",
    instansi_prof: "",
    file: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_organisasi", label: "Nama Organisasi" },
      { field: "kategori_id", label: "Kategori" },
      { field: "peran", label: "Peran" },
      { field: "mulai_tahun", label: "Mulai Keanggotaan" },
      { field: "mulai_bulan", label: "Mulai Keanggotaan" },
      { field: "selesai_tahun", label: "Selesai Keanggotaan" },
      { field: "selesai_bulan", label: "Selesai Keanggotaan" },
      { field: "instansi_prof", label: "Instansi Profesi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const { data: kategoriProfesi, isLoading: isLoadingKategoriProfesi } =
    useKategoriProfesi([user]);

  const EDIT_URL = `${process.env.API_ENDPOINT}/penunjang/editProfesi`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.prof_id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  const bulanOptions = getMonthOptions();
  const tahunOptions = getYearOptions();

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={`Edit ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Anggota Profesi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori Profesi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="kategori_id"
                value={form.kategori_id}
                onChange={inputHandler}
                options={
                  kategoriProfesi &&
                  kategoriProfesi.map((item) => ({
                    label: `${item.nama_kategori}`,
                    value: item.id,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Organisasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_organisasi"
                onChange={inputHandler}
                value={form.nama_organisasi}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Peran <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="peran"
                onChange={inputHandler}
                value={form.peran}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Mulai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="mulai_tahun"
                value={form.mulai_tahun}
                onChange={inputHandler}
                options={tahunOptions}
                required
              />
              <Form.Select
                className="flex-1"
                name="mulai_bulan"
                value={form.mulai_bulan}
                onChange={inputHandler}
                options={bulanOptions}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Selesai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="selesai_tahun"
                value={form.selesai_tahun}
                onChange={inputHandler}
                options={tahunOptions}
                required
              />
              <Form.Select
                className="flex-1"
                name="selesai_bulan"
                value={form.selesai_bulan}
                onChange={inputHandler}
                options={bulanOptions}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Instansi Profesi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="instansi_prof"
                onChange={inputHandler}
                value={form.instansi_prof}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="file_profesi"
                  onChange={inputHandler}
                />
                <embed
                  src={
                    form.file.startsWith("https")
                      ? `${form.file}`
                      : `${FILE_URL}/${form.file}`
                  }
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
