import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import { Loading } from "../../../../../components/Loading";
import { useRouter } from "next/router";
import useUser from "../../../../../hooks/useUser";
import useMenu from "../../../../../hooks/useMenu";
import { getDateNow } from "../../../../../repo/bulan-tahun";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import useMahasiswaSkripsi from "../../../../../repo/mahasiswa-skripsi";
import useDosen from "../../../../../repo/dosen";

export default function CreateNotaDinas() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const FILE_URL = `${process.env.API_ENDPOINT}/ttd`;

  const [data, setData] = useState({
    nomorNota: "",
    lampiran: "",
    perihal: "",
    peserta_mahasiswa: [],
  });

  const handleInputChange = (e) => {
    const { name, value, attributes } = e.target;
    const { index } = attributes;

    if (name.startsWith("peserta_mahasiswa")) {
      const updatedPesertaMahasiswa = [...data.peserta_mahasiswa];
      const [field, subField] = name.split(".");

      if (subField === "npm") {
        const selectedStudent = listMahasiswa.find(
          (mahasiswa) => mahasiswa.npm === value
        );

        if (selectedStudent) {
          updatedPesertaMahasiswa[index.value] = {
            ...updatedPesertaMahasiswa[index.value],
            nama: selectedStudent.nama_lengkap,
            judul_skripsi: selectedStudent.judul_skripsi,
            pembimbing_1: selectedStudent.sk_pembimbing_1,
            pembimbing_2: selectedStudent.sk_pembimbing_2,
          };
        }
      }

      updatedPesertaMahasiswa[index.value] = {
        ...updatedPesertaMahasiswa[index.value],
        [subField]: value,
      };

      setData((prevState) => ({
        ...prevState,
        peserta_mahasiswa: updatedPesertaMahasiswa,
      }));
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const [dataKaprodi, setDataKaprodi] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = `${process.env.API_ENDPOINT}/get-jabatan`;
        const response = await axios.get(API_URL, {
          params: {
            nama_jabatan: "Ka Prodi",
            prodi: "FT_TI",
          },
        });
        setDataKaprodi(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setDataKaprodi]);

  const content = () => {
    return (
      <>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div style={{ margin: "0 auto", maxWidth: "600px" }}>
            <h1
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                margin: "10px 0",
                textDecoration: "underline",
                fontFamily: "Times New Roman",
              }}
            >
              Nota Dinas
            </h1>
            <p
              style={{
                textAlign: "center",
                fontFamily: "Times New Roman",
                fontSize: "12px",
                marginTop: "-13px",
                marginBottom: "40px",
              }}
            >
              Nomor: {data.nomorNota}
            </p>
            <div
              style={{
                marginLeft: "35px",
                marginRight: "35px",
                textAlign: "justify",
              }}
            >
              <span
                style={{
                  fontWeight: "normal",
                  fontFamily: "Times New Roman",
                  marginTop: "30px",
                  fontSize: "12px",
                }}
              >
                Kepada Yth &nbsp;&nbsp;&nbsp;: Dekan Fakultas Teknik dan Sains
              </span>

              <p
                style={{
                  textIndent: "0",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                }}
              >
                Dari
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                : Ketua Program Studi Teknik Informatika
              </p>
              <p
                style={{
                  textIndent: "0",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                }}
              >
                Lampiran &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {data.lampiran}
              </p>
              <p
                style={{
                  textIndent: "0",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                }}
              >
                Perihal
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :{" "}
                {data.perihal}
              </p>
              <p
                style={{
                  textIndent: "0",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginTop: "40px",
                  marginRight: "35px",
                }}
              >
                Assalamu’alaikum Wr. Wb.
              </p>
              <p
                style={{
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                  marginTop: "20px",
                }}
              >
                Semoga Allah S.W.T Selalu melimpahkan rahmat dan hidayah-Nya
                kepada kita semua dalam menjalankan aktivitas sehari-hari.
                Aamiin.
              </p>
              <p
                style={{
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                  marginTop: "20px",
                }}
              >
                Sehubungan dengan tugas akhir mahasiswa Program Studi Teknik
                Informatika, maka dengan ini kami bermaksud untuk mengajukan SK
                Tugas Akhir Mahasiswa, adapun daftar nama Mahasiswa, Judul Tugas
                Akhir, dan Dosen Pembimbing terlampir.
              </p>
              <p
                style={{
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginRight: "35px",
                  marginTop: "20px",
                }}
              >
                Demikian surat ini kami sampaikan, atas perhatian dan perkenan
                Bapak, kami ucapkan terima kasih.
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginTop: "20px",
                  marginRight: "35px",
                }}
              >
                Wassalamu’alaikum Wr. Wb.
              </p>
              <p
                style={{
                  textIndent: "295px",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginTop: "40px",
                }}
              >
                Bogor, {getDateNow({ getNameDay: false })}
              </p>
              <p
                style={{
                  textIndent: "295px",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                  marginTop: "0px",
                }}
              >
                Ketua Program Studi Teknik Informatika.
              </p>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  float: "right",
                  marginRight: "100px",
                }}
              >
                <img
                  src={`${FILE_URL}/${dataKaprodi.ttd}`}
                  alt="TTD"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div style={{ clear: "both" }}></div>
              <p
                style={{
                  textIndent: "295px",
                  fontFamily: "Times New Roman",
                  fontSize: "12px",
                }}
              >
                {dataKaprodi.nama_lengkap}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handlePrint = async () => {
    const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;

    const printContent = ReactDOMServer.renderToString(content());

    const surat = `
      <div style="margin: 0 auto; max-width: 600px;">
        ${printContent}
      </div>
    `;

    const pesertaMahasiswa = `
      <div style="page-break-before: always;">
        <div style="margin: 0 auto; max-width: 600px;">
          <h2 style="text-align: center; font-weight: bold; font-size: 16px; margin: 20px 0; font-family: 'Times New Roman'; text-decoration: underline;">Mahasiswa</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 8px; font-size: 12px;">Nama</th>
                <th style="border: 1px solid black; padding: 8px; font-size: 12px;">NPM</th>
                <th style="border: 1px solid black; padding: 8px; font-size: 12px;">Judul Skripsi</th>
                <th style="border: 1px solid black; padding: 8px; font-size: 12px;">Usulan Dosen 1</th>
                <th style="border: 1px solid black; padding: 8px; font-size: 12px;">Usulan Dosen 2</th>
              </tr>
            </thead>
            <tbody>
              ${data.peserta_mahasiswa
                .map(
                  (mahasiswa, index) => `
                <tr key=${index}>
                  <td style="border: 1px solid black; padding: 8px;">${
                    mahasiswa.nama
                  }</td>
                  <td style="border: 1px solid black; padding: 8px;">${
                    mahasiswa.npm
                  }</td>
                  <td style="border: 1px solid black; padding: 8px;">${
                    mahasiswa.judul_skripsi
                  }</td>
                  <td style="border: 1px solid black; padding: 8px;">
                  ${
                    mahasiswa.pembimbing_1
                      ? `<span>
                        ${
                          listDosen.find(
                            (dosen) => dosen.user_id === mahasiswa.pembimbing_1
                          )?.nama_lengkap || ""
                        }
                      </span>`
                      : ""
                  }
                </td>
                
                <td style="border: 1px solid black; padding: 8px;">
                ${
                  mahasiswa.pembimbing_2
                    ? `<span>
                      ${
                        listDosen.find(
                          (dosen) => dosen.user_id === mahasiswa.pembimbing_2
                        )?.nama_lengkap || ""
                      }
                    </span>`
                    : ""
                }
              </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    var opt = {
      margin: 0,
      filename: "nota_dinas.pdf",
      image: { type: "jpeg", quality: 0.2 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "p" },
    };

    html2pdf()
      .set(opt)
      .from(surat + pesertaMahasiswa)
      .save();
  };

  const { data: listMahasiswa, isLoading: isMahasiswaLoading } =
    useMahasiswaSkripsi([user]);
  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  const removeFromUser = (index) => {
    setData((prevState) => ({
      ...prevState,
      peserta_mahasiswa: prevState.peserta_mahasiswa.filter(
        (item, idx) => idx !== index
      ),
    }));
  };

  const addPesertaMahasiswa = () => {
    setData((prevState) => ({
      ...prevState,
      peserta_mahasiswa: [
        ...prevState.peserta_mahasiswa,
        {
          nama: "",
          npm: "",
          judul_skripsi: "",
          pembimbing_1: "",
          pembimbing_2: "",
        },
      ],
    }));
  };

  if ([user, menu, isMahasiswaLoading].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />

      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">
            <div>Form Cetak Nota Dinas</div>
          </Card.Header>

          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">
                Nomor Nota Dinas
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nomorNota"
                value={data.nomorNota}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Lampiran</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lampiran"
                value={data.lampiran}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[12rem]">Perihal</Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="perihal"
                value={data.perihal}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header className="text-center">Nota Dinas</Card.Header>
          <Card.Body className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div style={{ margin: "0 auto", maxWidth: "600px" }}>
                <h1
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    margin: "10px 0",
                    textDecoration: "underline",
                    fontFamily: "Times New Roman",
                  }}
                >
                  Nota Dinas
                </h1>
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "Times New Roman",
                    fontSize: "12px",
                    marginTop: "-13px",
                    marginBottom: "40px",
                  }}
                >
                  Nomor: {data.nomorNota}
                </p>
                <div
                  style={{
                    marginLeft: "35px",
                    marginRight: "35px",
                    textAlign: "justify",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "normal",
                      fontFamily: "Times New Roman",
                      marginTop: "30px",
                      fontSize: "12px",
                    }}
                  >
                    Kepada Yth &nbsp;&nbsp;&nbsp;:&nbsp;
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                    }}
                  >
                    Dekan Fakultas Teknik dan Sains
                  </span>
                  <p
                    style={{
                      textIndent: "0",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                    }}
                  >
                    Dari
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    : Ketua Program Studi Teknik Informatika
                  </p>
                  <p
                    style={{
                      textIndent: "0",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                    }}
                  >
                    Lampiran &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :{" "}
                    {data.lampiran}
                  </p>
                  <p
                    style={{
                      textIndent: "0",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                    }}
                  >
                    Perihal
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    :{data.perihal}
                  </p>

                  <p
                    style={{
                      textIndent: "0",
                      fontWeight: "bold",
                      fontStyle: "italic",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginTop: "40px",
                      marginRight: "35px",
                    }}
                  >
                    Assalamu’alaikum Wr. Wb.
                  </p>
                  <p
                    style={{
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                      marginTop: "20px",
                    }}
                  >
                    Semoga Allah S.W.T Selalu melimpahkan rahmat dan hidayah-Nya
                    kepada kita semua dalam menjalankan aktivitas sehari-hari.
                    Aamiin.
                  </p>
                  <p
                    style={{
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                      marginTop: "20px",
                    }}
                  >
                    Sehubungan dengan tugas akhir mahasiswa Program Studi Teknik
                    Informatika, maka dengan ini kami bermaksud untuk mengajukan
                    SK Tugas Akhir Mahasiswa, adapun daftar nama Mahasiswa,
                    Judul Tugas Akhir, dan Dosen Pembimbing terlampir.
                  </p>
                  <p
                    style={{
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginRight: "35px",
                      marginTop: "20px",
                    }}
                  >
                    Demikian surat ini kami sampaikan, atas perhatian dan
                    perkenan Bapak, kami ucapkan terima kasih.
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginTop: "20px",
                      marginRight: "35px",
                    }}
                  >
                    Wassalamu’alaikum Wr. Wb
                  </p>
                  <p
                    style={{
                      textIndent: "295px",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginTop: "40px",
                    }}
                  >
                    Bogor, {getDateNow({ getNameDay: false })}
                  </p>
                  <p
                    style={{
                      textIndent: "295px",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                      marginTop: "0px",
                    }}
                  >
                    Ketua Program Studi Teknik Informatika.
                  </p>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      float: "right",
                      marginRight: "100px",
                    }}
                  >
                    <img
                      src={`${FILE_URL}/${dataKaprodi.ttd}`}
                      alt="TTD"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div style={{ clear: "both" }}></div>
                  <p
                    style={{
                      textIndent: "295px",
                      fontFamily: "Times New Roman",
                      fontSize: "12px",
                    }}
                  >
                    {dataKaprodi.nama_lengkap}
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="flex-grow">
          <table
            className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
            cellPadding={10}
          >
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="text-sm font-medium border-2 border-white bg-gray-200">
                  Mahasiswa
                </th>
                <th className="text-sm font-medium border-2 border-white bg-gray-200">
                  Npm
                </th>
                <th className="text-sm font-medium border-2 border-white bg-gray-200">
                  Judul Skripsi
                </th>
                <th className="text-sm font-medium border-2 border-white bg-gray-200">
                  Usulan Dosen 1
                </th>
                <th className="text-sm font-medium border-2 border-white bg-gray-200">
                  Usulan Dosen 2
                </th>
                <th className=" border-2 border-white bg-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {data.peserta_mahasiswa.map((item, index) => (
                <tr key={`peserta-mahasiswa-${index}`}>
                  <td
                    className="text-sm border-2 border-white bg-gray-50"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Form.Combobox
                      index={index}
                      name="peserta_mahasiswa.npm"
                      onChange={(selected) =>
                        handleInputChange({
                          target: {
                            attributes: {
                              index: {
                                value: index,
                              },
                            },
                            name: "peserta_mahasiswa.npm",
                            value: selected?.value,
                          },
                        })
                      }
                      value={data.peserta_mahasiswa[index].npm}
                      options={
                        listMahasiswa &&
                        Array.isArray(listMahasiswa) &&
                        listMahasiswa.map((mahasiswa) => ({
                          label: `${mahasiswa.nama_lengkap}`,
                          value: mahasiswa.npm,
                          judul_skripsi: mahasiswa.judul_skripsi,
                          pembimbing_1: mahasiswa.sk_pembimbing_1,
                          pembimbing_2: mahasiswa.sk_pembimbing_2,
                        }))
                      }
                      menuTarget={document.body}
                    />
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      {data.peserta_mahasiswa[index].npm}
                    </div>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex">
                      {data.peserta_mahasiswa[index].judul_skripsi}
                    </div>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex">
                      {data?.peserta_mahasiswa[index]?.pembimbing_1 && (
                        <span>
                          {
                            listDosen.find(
                              (dosen) =>
                                dosen.user_id ===
                                data?.peserta_mahasiswa[index]?.pembimbing_1
                            )?.nama_lengkap
                          }
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex">
                      {data?.peserta_mahasiswa[index]?.pembimbing_2 && (
                        <span>
                          {
                            listDosen.find(
                              (dosen) =>
                                dosen.user_id ===
                                data?.peserta_mahasiswa[index]?.pembimbing_2
                            )?.nama_lengkap
                          }
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        type="button"
                        variant="danger"
                        icon={
                          <Icon
                            icon="solar:trash-bin-2-bold-duotone"
                            width={20}
                            height={20}
                          />
                        }
                        onClick={() => removeFromUser(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={4}
                  className="text-sm border-2 border-white bg-gray-50"
                >
                  <Button
                    type="button"
                    variant="primary"
                    className="mx-auto"
                    onClick={addPesertaMahasiswa}
                  >
                    Tambah Mahasiswa
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Form>

      <div className="flex gap-4 mt-4">
        <Button
          as="a"
          href={prefix + menu.url}
          variant="secondary"
          className="w-full h-12"
        >
          Kembali
        </Button>
        <Button
          variant="info"
          className="w-full h-12 mb-4"
          onClick={(e) => {
            e.preventDefault();
            handlePrint();
          }}
        >
          Cetak Nota Dinas
        </Button>
      </div>
    </Layout>
  );
}
