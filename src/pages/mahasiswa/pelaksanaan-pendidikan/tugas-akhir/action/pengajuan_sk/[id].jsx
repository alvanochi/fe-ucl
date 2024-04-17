import { Icon } from "@iconify-icon/react";
import Button from "../../../../../../components/Button";
import Card from "../../../../../../components/Card";
import Form from "../../../../../../components/Form";
import Layout from "../../../../../../components/Layout";
import PageHeader from "../../../../../../components/PageHeader";
import useMenu from "../../../../../../hooks/useMenu";
import useUser from "../../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../../hooks/useCRUD";
import useDosen from "../../../../../../repo/dosen";
import useMahasiswa from "../../../../../../repo/mahasiswa";
import { useEffect } from "react";
import date from "../../../../../../utils/date";
import { Loading } from "../../../../../../components/Loading";

export default function PengajuanSkAction() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail`;
  const FILE_URL = `${process.env.API_ENDPOINT}/foto-profile`;

  const { formdata, show } = useCRUD(API_URL);
  const { form } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);

  const pembimbing1Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_1
  );
  const pembimbing2Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_2
  );
  const pembimbing3Data = listDosen?.find(
    (dosen) => dosen.user_id === form?.pembimbing_3
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
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Pengajuan SK</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Nama</Form.Label>
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
              <Form.Label className="min-w-[18rem]">NPM</Form.Label>
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
              <Form.Label className="min-w-[18rem]">Judul Skripsi</Form.Label>
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
              <Form.Label className="min-w-[18rem]">
                Semester <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
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
                className="flex-1"
                name="lokasi_kegiatan"
                value={form.lokasi_kegiatan}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nomor SK Penugasan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nomor_sk"
                value={form.nomor_sk || "-"}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tanggal SK Penugasan
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tgl_sk"
                value={form.tgl_sk}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">Link Dokumen SK</Form.Label>
              <span>:</span>
              <Form.Input
                type="link"
                className="flex-1"
                name="link_dokumen_sk"
                value={form.link_dokumen_sk || "-"}
                disabled
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
                      checked={form?.status_pem_1 ? true : false}
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
                      checked={form?.status_pem_2 ? true : false}
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
                        checked={form?.status_pem_3 ? true : false}
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
            Kembali
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
