import React, { useEffect } from "react";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import Form from "../../../../../components/Form";
import Card from "../../../../../components/Card";
import { useRouter } from "next/router";
import useUser from "../../../../../hooks/useUser";
import useMenu from "../../../../../hooks/useMenu";
import useCRUD from "../../../../../hooks/useCRUD";
import Button from "../../../../../components/Button";

const DokumenEdit = () => {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/pengabdian/detailDokumen`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-pengabdian`;

  const INITIAL_FORM = {
    pengabdian_id: "",
    dokumen_id: "",
    nama_dok: "",
    keterangan: "",
    tautan_dok: "",
    file: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_dok", label: "Nama Dokumen" },
      { field: "keterangan", label: "Keterangan" },
      { field: "tautan_dok", label: "Tautan Dokumen" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/pengabdian/editDokumen`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.dokumen_id}`,
    method: "PATCH",
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;

    show(router.query.id, { transformData: (data) => ({ ...data }) });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">
            Edit Dokumen Pengabdian
          </Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Dokumen
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_dok"
                value={form.nama_dok}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Keterangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="keterangan"
                value={form.keterangan}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tautan Dokumen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tautan_dok"
                value={form.tautan_dok}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                File <span className="text-danger-600">*</span>
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
            href={`${prefix + menu.url}/pengabdian/edit/${form.pengabdian_id}`}
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
};

export default DokumenEdit;
