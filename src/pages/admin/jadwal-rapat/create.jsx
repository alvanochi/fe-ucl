import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useDatatable from "../../../hooks/useDatatable";
import { useEffect, useState } from "react";
import axios from "axios";
import useForm from "../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";

export default function CreateJadwal() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const INITIAL_FORM = {
    nm_pengundang: "",
    nm_kegiatan: "",
    pertemuan: "",
    ruangan: "",
    status_ruangan: "",
    tanggal: "",
    waktu: "",
  }

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [
      { field: "nm_pengundang", label: "Nama Pengundang" },
      { field: "nm_kegiatan", label: "Nama Kegiatan" },
      { field: "pertemuan", label: "Pertemuan" },
      { field: "ruangan", label: "Ruangan" },
      { field: "status_ruangan", label: "Status Ruangan" },
      { field: "tanggal", label: "Tanggal" },
      { field: "waktu", label: "Waktu" },
    ],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
      };

      const request = await axios({
        url: `${process.env.API_ENDPOINT_ABSEN}/meeting/store`,
        method: "POST",
        data: requestData,
      });

      const response = await request.data;

      if(response){
        toastAlert("success", "Make a schedule successfully");
        router.push(prefix + menu.url);
      } 
    } catch (error) {
      toastAlert("error", error.message);
    }
  }



  if ([user, menu].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Buat Jadwal Rapat</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Nama Pengundang <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nm_pengundang"
                onChange={inputHandler}
                value={form.nm_pengundang}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Nama Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nm_kegiatan"
                onChange={inputHandler}
                value={form.nm_kegiatan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Pertemuan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="pertemuan"
                onChange={inputHandler}
                value={form.pertemuan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Ruangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="ruangan"
                onChange={inputHandler}
                value={form.ruangan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Tanggal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tanggal"
                onChange={inputHandler}
                value={form.tanggal}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Waktu <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="time"
                className="flex-1"
                name="waktu"
                onChange={inputHandler}
                value={form.waktu}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio name="status_ruangan" onChange={inputHandler} value={0} />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="status_ruangan" onChange={inputHandler} value={1} />
                  Online
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="status_ruangan" onChange={inputHandler} value={2} />
                  Hybird
                </Form.Label>
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
