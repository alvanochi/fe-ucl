import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useDatatable from "../../../../hooks/useDatatable";
import { useEffect, useState } from "react";
import axios from "axios";
import useForm from "../../../../hooks/useForm";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";
import { Loading } from "../../../../components/Loading";
import useMahasiswa from "../../../../repo/mahasiswa";
import useMatakuliah from "../../../../repo/matakuliah";

export default function GenerateQrCode() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading, refresh } = useDatatable(DATA_URL);

  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);
  const { data: listMatkul, isLoading: isMatkulLoading } = useMatakuliah([
    user,
  ]);
  const [selectedMatkul, setSelectedMatkul] = useState("");
  const [selectedMhs, setSelectedMhs] = useState("");
  const [pertemuanData, setPertemuanData] = useState(null);

  const handleMatkulChange = (selected) => {
    setSelectedMatkul(selected?.value);
  };
  const handleMhsChange = (selected) => {
    setSelectedMhs(selected?.value);
  };

  const INITIAL_FORM = {
    id_dosen: "",
    status_kelas: 0,
    nik_dosen: "",
    id_matkul: "",
    pertemuan: "",
    kelas: "",
    rps_dasar: "",
    rps_pelaksanaan: "",
    npm_komti: "",
  };

  const { form, inputHandler } = useForm(INITIAL_FORM, {
    rules: [{ field: "status_kelas", label: "status_kelas" }],
  });

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const requestData = {
        ...form,
        id_matkul: selectedMatkul,
        npm_komti: selectedMhs,
        nik_dosen: data.nip,
        id_dosen: data.user_id,
        pertemuan: pertemuanData,
      };

      if (
        !requestData.id_matkul ||
        !requestData.npm_komti ||
        !requestData.nik_dosen ||
        !requestData.id_dosen
      ) {
        toastAlert("error", "Pleas fill in all the required fields.");

        return;
      }
      const request = await axios({
        url: `${process.env.API_ENDPOINT}/absensi-external/pembelajaran`,
        method: "POST",
        data: requestData,
      });
      const response = await request.data;

      if (response.isSuccess) {
        (form.id_dosen = ""),
          (form.status_kelas = 0),
          (form.nik_dosen = ""),
          (form.pertemuan = ""),
          (form.kelas = ""),
          (form.rps_dasar = ""),
          (form.rps_pelaksanaan = ""),
          setSelectedMatkul("");
        setSelectedMhs("");

        toastAlert("success", "QRCODE created successfully");
        router.push(prefix + menu.url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchPertemuan = async () => {
      try {
        if (selectedMatkul) {
          const response = await axios.get(
            `${process.env.API_ENDPOINT}/absensi-external/pembelajaran/check-pertemuan`,
            {
              params: {
                id_dosen: data.user_id,
                id_matkul: selectedMatkul,
              },
            }
          );

          setPertemuanData(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching pertemuan:", error);
      }
    };

    fetchPertemuan();
  }, [selectedMatkul, data.user_id]);

  if (
    [user, menu, loading, isMahasiswaLoading, isMatkulLoading].some(
      (item) => item == null
    )
  )
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Generate QRCODE</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                NIK <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                onChange={inputHandler}
                name="nik_dosen"
                value={data.nip}
                readOnly
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Matakuliah <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="kurikulum"
                onChange={handleMatkulChange}
                value={selectedMatkul}
                options={listMatkul?.map((item) => ({
                  label: item.nama_matakuliah,
                  value: item.id,
                }))}
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
                value={pertemuanData}
                onChange={inputHandler}
                readOnly
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={0}
                  />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={1}
                  />
                  Online
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelas"
                    onChange={inputHandler}
                    value={2}
                  />
                  Hybird
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Dasar</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_dasar"
                value={form.rps_dasar}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">RPS Pelaksanaan</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="rps_pelaksanaan"
                value={form.rps_pelaksanaan}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Komti Kelas <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="npm_komti"
                onChange={handleMhsChange}
                value={selectedMhs}
                options={listMahasiswa?.map((mhs) => ({
                  label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                  value: mhs.npm,
                }))}
                menuTarget={document.body}
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
    </Layout>
  );
}
