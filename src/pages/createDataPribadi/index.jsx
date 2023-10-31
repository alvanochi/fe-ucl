import Head from "next/head";
import Button from "../../components/Button";

import Form from "../../components/Form";
import useForm from "../../hooks/useForm";
import axios from "axios";
import useCRUD from "../../hooks/useCRUD";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";

const CreateDataPribadi = () => {
  const router = useRouter();

  const { user } = useUser({ redirectTo: "/login" });

  const INITIAL_FORM = {
    nama_lengkap: "",
    ibu_kandung: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenkel: "",
    nik: "",
    agama: "",
    warga_negara: "",
    email: "",
    alamat: "",
    rt: "",
    rw: "",
    desa_kelurahan: "",
    kota_kabupaten: "",
    provinsi: "",
    kode_pos: "",
    no_hp: "",
    status_kawin: "",
  };

  const API_URL = `${process.env.API_ENDPOINT}/profile/createData`;

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_lengkap", label: "Nama Lengkap" },
      { field: "ibu_kandung", label: "Nama Ibu Kandung" },
      { field: "tanggal_lahir", label: "Tanggal Lahir" },
      { field: "tempat_lahir", label: "Tempat Lahir" },
      { field: "jenkel", label: "Jenis Kelamin" },
      { field: "nik", label: "NIK" },
      { field: "agama", label: "Agama" },
      { field: "warga_negara", label: "Warga Negara" },
      { field: "email", label: "Email" },
      { field: "alamat", label: "Alamat" },
      { field: "rt", label: "RT" },
      { field: "rw", label: "RW" },
      { field: "desa_kelurahan", label: "Desa/Kelurahan" },
      { field: "kota_kabupaten", label: "Kota/Kabupaten" },
      { field: "provinsi", label: "Provinsi" },
      { field: "kode_pos", label: "Kode Pos" },
      { field: "no_hp", label: "Nomor Telp." },
      { field: "status_kawin", label: "Status Kawin" },
    ],
    success: () => router.push("/"),
  });

  const { form, inputHandler } = formdata;

  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const request = await axios({
  //       url: `${process.env.API_ENDPOINT}/profile/createData`,
  //       method: "POST",
  //       data: form
  //     })

  //     const response = await request;

  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  if ([user].some((item) => item == null)) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>{`Data Pribadi - ${process.env.APP_NAME}`}</title>
      </Head>
      <div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat bg-fixed ">
        <form
          onSubmit={submitHandler}
          className="flex items-center justify-center w-3/5  bg-white m-auto rounded-3xl "
        >
          <div className="block w-4/5 ">
            <div className="block mb-12 mt-6">
              <h1 className="block text-2xl text-center font-bold text-primary-600">
                Membuat Data Pribadi
              </h1>
              <p className="block text-gray-600 text-center  text-sm">
                Silahkan Masukan Data Diri Anda
              </p>
            </div>
            <div className="block mb-4">
              <h2 className="block text-4md  font-bold text-primary-600">
                Profile
              </h2>
            </div>

            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="nama_lengkap"
                  onChange={inputHandler}
                  value={form.nama_lengkap}
                  required
                />
              </div>
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Nama Ibu Kandung
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="ibu_kandung"
                  onChange={inputHandler}
                  value={form.ibu_kandung}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="tempat_lahir"
                  onChange={inputHandler}
                  value={form.tempat_lahir}
                  required
                />
              </div>
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  className="form-input"
                  name="tanggal_lahir"
                  onChange={inputHandler}
                  value={form.tanggal_lahir}
                  required
                />
              </div>
            </div>
            <div className="block mb-6 ">
              <label className="block text-sm font-medium mb-1">
                Jenis Kelamin
              </label>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio name="jenkel" value="L" onChange={inputHandler} />
                  Laki-Laki
                </Form.Label>
                <Form.Label>
                  <Form.Radio name="jenkel" value="P" onChange={inputHandler} />
                  Perempuan
                </Form.Label>
              </div>
            </div>

            <div className="block mb-4">
              <h2 className="block text-4md  font-bold text-primary-600">
                Kependudukan
              </h2>
            </div>

            <div className="flex flex-row gap-3 items-center justify-center">
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">NIK</label>
                <input
                  type="number"
                  className="form-input"
                  name="nik"
                  onChange={inputHandler}
                  value={form.nik}
                  required
                />
              </div>
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">Agama</label>
                <input
                  type="text"
                  className="form-input"
                  name="agama"
                  onChange={inputHandler}
                  value={form.agama}
                  required
                />
              </div>
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">
                  Warga Negara
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="warga_negara"
                  onChange={inputHandler}
                  value={form.warga_negara}
                  required
                />
              </div>
            </div>

            <div className="block mb-4">
              <h2 className="block text-4md font-bold text-primary-600">
                Alamat dan Kontak
              </h2>
            </div>

            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  onChange={inputHandler}
                  value={form.email}
                  required
                />
              </div>
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Nomor Telp.
                </label>
                <input
                  type="number"
                  className="form-input"
                  name="no_hp"
                  onChange={inputHandler}
                  value={form.no_hp}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="block mb-6 basis-1/4">
                <label className="block text-sm font-medium mb-1">RT</label>
                <input
                  type="number"
                  className="form-input"
                  name="rt"
                  onChange={inputHandler}
                  value={form.rt}
                  required
                />
              </div>
              <div className="block mb-6 basis-1/4">
                <label className="block text-sm font-medium mb-1">RW</label>
                <input
                  type="number"
                  className="form-input"
                  name="rw"
                  onChange={inputHandler}
                  value={form.rw}
                  required
                />
              </div>
              <div className="block mb-6 basis-3/5">
                <label className="block text-sm font-medium mb-1">
                  Desa/Kelurahan
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="desa_kelurahan"
                  onChange={inputHandler}
                  value={form.desa_kelurahan}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 items-center justify-center">
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">
                  Kota/Kabupaten
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="kota_kabupaten"
                  onChange={inputHandler}
                  value={form.kota_kabupaten}
                  required
                />
              </div>
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="provinsi"
                  onChange={inputHandler}
                  value={form.provinsi}
                  required
                />
              </div>
              <div className="block mb-6 basis-2/5">
                <label className="block text-sm font-medium mb-1">
                  Kode Pos
                </label>
                <input
                  type="number"
                  className="form-input"
                  name="kode_pos"
                  onChange={inputHandler}
                  value={form.kode_pos}
                  required
                />
              </div>
            </div>

            <div className="block mb-6">
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input
                type="text"
                className="form-input"
                name="alamat"
                onChange={inputHandler}
                value={form.alamat}
                required
              />
            </div>
            <div className="block mb-6 ">
              <label className="block text-sm font-medium mb-1">
                Status Kawin
              </label>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_kawin"
                    value="0"
                    onChange={inputHandler}
                  />
                  Belum Menikah
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kawin"
                    value="1"
                    onChange={inputHandler}
                  />
                  Sudah Menikah
                </Form.Label>
              </div>
            </div>

            <Button variant="primary" className="w-full h-12">
              Save
            </Button>
            <div className="block mt-12">
              <p className="block text-sm text-center font-medium text-gray-400"></p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDataPribadi;
