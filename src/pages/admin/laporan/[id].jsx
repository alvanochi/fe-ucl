import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useCRUD from "../../../hooks/useCRUD";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { Icon } from "@iconify-icon/react/dist/iconify.js";

export default function LaporanEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const [previewImage, setPreviewImage] = useState(null);

  const API_URL = `${process.env.API_ENDPOINT}/laporan`;

  const INITIAL_FORM = {
    id: "",
    kategori_id: "",
    code: "",
    nama: "",
    lat: "",
    long: "",
    deskripsi: "",
    foto: "",
    status: "",
    kategori_laporan: {
      id: "",
      nama_kategori: "",
    },
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "code", label: "code" },
      { field: "nama", label: "nama" },
      { field: "lat", label: "lat" },
      { field: "long", label: "long" },
      { field: "deskripsi", label: "deskripsi" },
      { field: "status", label: "status" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  const EDIT_OPTION = { url: `${API_URL}/${form.id}`, method: "PUT" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      inputHandler(e);
    }
  };

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form
        onSubmit={(event) => submitHandler(event, EDIT_OPTION)}
        type="formdata"
      >
        <Card className="mt-4">
          <Card.Header className="text-center">Laporan</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                NPM <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="code"
                onChange={inputHandler}
                value={form.code}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama"
                onChange={inputHandler}
                value={form.nama}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Kategori <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="kategori_id"
                onChange={inputHandler}
                value={form.kategori_laporan?.nama_kategori}
                disable="true"
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Latitude <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lat"
                onChange={inputHandler}
                value={form.lat}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Longtitude <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="long"
                onChange={inputHandler}
                value={form.long}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Link Maps<span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${form.lat},${form.long}`,
                    "_blank"
                  )
                }
                variant="primary"
                icon={<Icon icon="ic:baseline-link" width={20} height={20} />}
                pill
              >
                Link Maps
              </Button>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Deskripsi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1 mt-2"
                rows="5"
                name="deskripsi"
                value={form.deskripsi}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status"
                    value={0}
                    onChange={inputHandler}
                    checked={form.status == 0}
                  />
                  MULAI
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status"
                    value={1}
                    onChange={inputHandler}
                    checked={form.status == 1}
                  />
                  SELESAI
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Foto <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="foto"
                  onChange={handleImageChange}
                />
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="foto"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  form.foto && (
                    <img
                      src={form.foto}
                      alt="foto"
                      className="w-full h-auto object-cover"
                    />
                  )
                )}
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
