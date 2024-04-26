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
import useDosen from "../../../../../repo/dosen";
import { useEffect } from "react";
import { Loading } from "../../../../../components/Loading";
import date from "../../../../../utils/date";

export default function PengajuanSkAction() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail`;
  const FILE_URL = `${process.env.API_ENDPOINT}/foto-profile`;

  const INITIAL_FORM = {
    id: "",
    mhs_id: "",
    judul_skripsi: "",
    lokasi_kegiatan: "",
    semester: "",
    nomor_sk: "",
    tgl_sk: "",
    link_dokumen_sk: "",
    sk_pembimbing_1: "",
    sk_pembimbing_2: "",
    sk_pembimbing_3: "",
    kepala_lab: "",
    sk_status_pem_1: "",
    sk_status_pem_2: "",
    sk_status_pem_3: "",
    status_kepala_lab: "",
    nama_lengkap: "",
    npm: "",
    nomor_nota_dinas: "",
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nomor_sk", label: "Nomor SK" },
      { field: "tgl_sk", label: "Tanggal SK" },
      { field: "link_dokumen_sk", label: "Link Dokumen Sk" },
    ],
    success: () => router.push(prefix + menu.url),
  });
  const { form, inputHandler } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/update-sk`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.id}`,
    method: "PATCH",
  };

  const pembimbing1Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.sk_pembimbing_1
  );
  const pembimbing2Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.sk_pembimbing_2
  );
  const pembimbing3Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.sk_pembimbing_3
  );
  const kepalaLabData = listDosen?.find(
    (dosen) => dosen.user_id === form?.kepala_lab
  );

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
        tgl_sk: data.tgl_sk ? date.formatToInput(data.tgl_sk) : "",
      }),
    });
  }, [router, user]);

  if ([user, menu, form, isDosenLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Pengajuan SK</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Nama</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-none"
                name="nama_lengkap"
                value={form.nama_lengkap}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">NPM</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-none"
                name="npm"
                value={form.npm}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Judul Skripsi</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-none"
                name="judul_skripsi"
                value={form.judul_skripsi}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Semester</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-none"
                name="semester"
                value={form.semester}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Lokasi Kegiatan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1 border-none"
                name="lokasi_kegiatan"
                value={form.lokasi_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor Nota Dinas
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="link"
                className="flex-1 border-none"
                name="nomor_nota_dinas"
                value={form.nomor_nota_dinas || "-"}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nomor_sk"
                value={form.nomor_sk}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penugasan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk"
                value={form.tgl_sk}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Link Dokumen SK <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="link_dokumen_sk"
                value={form.link_dokumen_sk}
                onChange={inputHandler}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <div className="w-full max-w-md p-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900">
              Mengetahui
            </h5>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={`${FILE_URL}/${pembimbing1Data?.image || "-"}`}
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Pembimbing 1
                    </p>
                    <p className="text-md text-gray-500 truncate">
                      {pembimbing1Data?.nama_lengkap || "-"}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <input
                      type="checkbox"
                      checked={form?.sk_status_pem_1 ? true : false}
                      disabled
                    />
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={`${FILE_URL}/${pembimbing2Data?.image || "-"}`}
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Pembimbing 2
                    </p>
                    <p className="text-md text-gray-500 truncate">
                      {pembimbing2Data?.nama_lengkap || "-"}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <input
                      type="checkbox"
                      checked={form?.sk_status_pem_2 ? true : false}
                      disabled
                    />
                  </div>
                </div>
              </li>
              {pembimbing3Data && (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={`${FILE_URL}/${pembimbing3Data?.image}`}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Pembimbing 3
                      </p>
                      <p className="text-md text-gray-500 truncate">
                        {pembimbing3Data?.nama_lengkap}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={form?.sk_status_pem_3 ? true : false}
                        disabled
                      />
                    </div>
                  </div>
                </li>
              )}

              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={`${FILE_URL}/${kepalaLabData?.image || "-"}`}
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Kepala Lab
                    </p>
                    <p className="text-md text-gray-500 truncate">
                      {kepalaLabData?.nama_lengkap || "-"}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <input
                      type="checkbox"
                      checked={form?.status_kepala_lab ? true : false}
                      disabled
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

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
