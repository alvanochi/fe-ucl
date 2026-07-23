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
import useCRUD from "../../../../../hooks/useCRUD";
import { Loading } from "../../../../../components/Loading";

export default function PengumpulanSkripsi() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail-dokumen-skripsi`;
  const FILE_URL_SKRIPSI = `${process.env.API_ENDPOINT}/tugas-akhir/final-skripsi`;
  const FILE_URL_PENGESAHAN = `${process.env.API_ENDPOINT}/tugas-akhir/lembar-pengesahan`;

  const INITIAL_FORM = {
    pengajuan_sk_id: "",
    dokumen_id: "",
    nama_lengkap: "",
    npm: "",
    judul_skripsi: "",
    lembar_pengesahan: "",
    dokumen_skripsi: "",
  };

  const { formdata, submitHandler, show } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "lembar_pengesahan", label: "Lembar Pengesahan" },
      { field: "dokumen_skripsi", label: "Dokumen Skripsi" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/upload-final-skripsi`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.dokumen_id}`,
    method: "PATCH",
  };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">
            <div>Form Pengumpulan Final Skripsi</div>
          </Card.Header>

          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Nama <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                NPM <span className="text-danger-600">*</span>
              </Form.Label>
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
              <Form.Label className="min-w-[20rem]">
                Judul Skripsi <span className="text-danger-600">*</span>
              </Form.Label>
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
                Lembar Pengesahan
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="lembar_pengesahan"
                disabled
              />
            </Form.Group>
            {form.lembar_pengesahan &&
              typeof form.lembar_pengesahan !== "object" && (
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Label className="min-w-[20rem]"></Form.Label>
                  <embed
                    src={`${FILE_URL_PENGESAHAN}/${form.lembar_pengesahan}`}
                    className="w-full h-[256px]"
                  />
                </Form.Group>
              )}
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[20rem]">
                Dokumen Skripsi
                <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="dokumen_skripsi"
                disabled
              />
            </Form.Group>
            {form.dokumen_skripsi &&
              typeof form.dokumen_skripsi !== "object" && (
                <Form.Group className="flex items-baseline gap-3">
                  <Form.Label className="min-w-[20rem]"></Form.Label>
                  <embed
                    src={`${FILE_URL_SKRIPSI}/${form.dokumen_skripsi}`}
                    className="w-full h-[256px]"
                  />
                </Form.Group>
              )}
          </Card.Body>
        </Card>
        {/* Dosen Pembimbing table */}

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
