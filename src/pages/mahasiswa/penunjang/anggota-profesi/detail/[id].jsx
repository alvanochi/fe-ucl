import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import BackButton from "../../../../../components/BackButton";
import useCRUD from "../../../../../hooks/useCRUD";
import { useEffect } from "react";
import {
  getMonthOptions,
  getYearOptions,
} from "../../../../../repo/bulan-tahun";
import { Loading } from "../../../../../components/Loading";

export default function AnggotaProfesiDetail() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/penunjang/detailProfesi`;
  const FILE_URL = `${process.env.API_ENDPOINT}/file-profesi`;

  const INITIAL_FORM = {
    prof_id: "",
    nama_organisasi: "",
    peran: "",
    mulai_tahun: "",
    mulai_bulan: "",
    selesai_tahun: "",
    selesai_bulan: "",
    instansi_prof: "",
    file: "",
    nama_kategori: "",
    point: "",
  };

  const { formdata, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_organisasi", label: "Nama Organisasi" },
      { field: "peran", label: "Peran" },
      { field: "mulai_tahun", label: "Mulai Keanggotaan" },
      { field: "mulai_bulan", label: "Mulai Keanggotaan" },
      { field: "selesai_tahun", label: "Selesai Keanggotaan" },
      { field: "selesai_bulan", label: "Selesai Keanggotaan" },
      { field: "instansi_prof", label: "Instansi Profesi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form } = formdata;

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
        title={menu.label}
        icon={menu.icon}
        handler={setActive}
        leading={<BackButton />}
      />
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => window.open(`${prefix + menu.url}/anggota-profesi/edit/${form.prof_id}`,'_blank')}
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Anggota Profesi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_kategori"
                value={form.nama_kategori}
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
                Nama Organisasi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_organisasi"
                value={form.nama_organisasi}
                disabled
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
                value={form.peran}
                disabled
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
                options={tahunOptions}
                disabled
              />
              <Form.Select
                className="flex-1"
                name="mulai_bulan"
                value={form.mulai_bulan}
                options={bulanOptions}
                disabled
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
                options={tahunOptions}
                disabled
              />
              <Form.Select
                className="flex-1"
                name="selesai_bulan"
                value={form.selesai_bulan}
                options={bulanOptions}
                disabled
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
                value={form.instansi_prof}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
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
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
