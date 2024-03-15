import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import useDosen from "../../../../../repo/dosen";
import date from "../../../../../utils/date";
import { useEffect } from "react";
import _ from "underscore";
import Accordion from "../../../../../components/Accordion";

export default function DetailBimbinganAkademik() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-frs`;

  const INITIAL_FORM = {
    id: "",
    dosen_id: "",
    tahun_akademik: "",
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    catatan: "",
    mhs_bimbingan: [],
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    transformData: (data) =>
      _.omit({
        ...data,
      }),
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, setForm } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const EDIT_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik/edit-dosen`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: "PATCH" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...INITIAL_FORM,
        ...data.dataBimbingan,
        p1: data.dataBimbingan.p1
          ? date.formatToInput(data.dataBimbingan.p1)
          : "",
        p2: data.dataBimbingan.p2
          ? date.formatToInput(data.dataBimbingan.p2)
          : "",
        p3: data.dataBimbingan.p3
          ? date.formatToInput(data.dataBimbingan.p3)
          : "",
        p4: data.dataBimbingan.p4
          ? date.formatToInput(data.dataBimbingan.p4)
          : "",
        mhs_bimbingan: data.mhsBimbingan,
      }),
    });
  }, [router, user]);

  console.log(form);

  if ([user, menu, isDosenLoading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">
            Detail Bimbingan Akademik
          </Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Akademik <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_akademik"
                value={form.tahun_akademik}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Dosen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Select
                className="flex-1"
                name="dosen_id"
                value={form.dosen_id}
                onChange={inputHandler}
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
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pertemuan 1 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="p1"
                onChange={inputHandler}
                value={form.p1}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pertemuan 2 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="p2"
                onChange={inputHandler}
                value={form.p2}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pertemuan 3 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="p3"
                onChange={inputHandler}
                value={form.p3}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Pertemuan 4 <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="p4"
                onChange={inputHandler}
                value={form.p4}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Catatan<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="catatan"
                value={form.catatan}
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

      <Card className="mt-8 mb-8">
        <Card.Header className="text-center">List Mahasiswa</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <div className="flex-1 block">
              <div className="space-y-2 mt-2">
                {form.mhs_bimbingan.map((mhs, index) => (
                  <Accordion
                    key={`mhs-${index}`}
                    title={`${index + 1}. ${mhs.nama_lengkap} - ${mhs.npm}`}
                  >
                    <Form.Group className="mb-4">
                      <embed
                        src={`${FILE_URL}/${mhs.dok_frs}`}
                        className="w-full h-[236px]"
                      />
                    </Form.Group>
                  </Accordion>
                ))}
              </div>
            </div>
          </Form.Group>
        </Card.Body>
      </Card>
    </Layout>
  );
}
