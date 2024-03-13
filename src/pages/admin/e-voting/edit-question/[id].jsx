import { useRouter } from "next/router";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import { Icon } from "@iconify-icon/react";
import { useEffect, useState } from "react";

export default function CreateQuestion() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const [jawaban, setJawaban] = useState([{ jawaban: "", status_jawaban: 0 }]);

  const API_URL = `${process.env.API_ENDPOINT}/voting/question-detail`;

  const INITIAL_FORM = {
    id: "",
    deskripsi: "",
    status_pertanyaan: "",
    dataOptions: [],
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
  });

  const { form, setForm } = formdata;

  const tambahJawaban = () => {
    const newOption = {
      jawaban: "",
      status_jawaban: 0,
      id_pertanyaan: form.id,
    }; // Sertakan id_pertanyaan saat menambahkan jawaban baru
    setForm((prevForm) => ({
      ...prevForm,
      dataOptions: [...prevForm.dataOptions, newOption],
    }));
  };

  const hapusJawaban = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      dataOptions: prevForm.dataOptions.filter((_, i) => i !== index),
    }));
  };

  const EDIT_URL = `${process.env.API_ENDPOINT}/voting/question`;
  const EDIT_OPTION = {
    url: `${EDIT_URL}/${form.id}`,
    method: "PATCH",
  };

  useEffect(() => {
    if (!router.isReady || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...INITIAL_FORM,
        ...data.dataPertanyaan[0],
        dataOptions: data.dataOptions,
      }),
    });
  }, [router.isReady, user]);



  if (!user || !menu) return <p>Loading...</p>;

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Pertanyaan</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Deskripsi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="deskripsi"
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    deskripsi: e.target.value,
                  }))
                }
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
                    name="status_pertanyaan"
                    value={1}
                    checked={form.status_pertanyaan === 1}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        status_pertanyaan: 1,
                      }))
                    }
                  />
                  ACTIVE
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_pertanyaan"
                    value={0}
                    checked={form.status_pertanyaan === 0}
                    onChange={() =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        status_pertanyaan: 0,
                      }))
                    }
                  />
                  NON ACTIVE
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        <div className="flex justify-between">
          <div className="mr-4 flex-grow">
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
              cellPadding={10}
            >
              <colgroup>
                <col style={{ width: "80%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    Option
                  </th>
                </tr>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Value
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Status
                  </th>
                  {/* <th className="text-sm border-2 border-white bg-gray-200">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {form.dataOptions.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Input
                        type="text"
                        className="flex-1"
                        name="jawaban"
                        value={item.jawaban}
                        onChange={(e) => {
                          const newDataOptions = [...form.dataOptions]; // Gunakan data dari form.dataOptions
                          newDataOptions[index].jawaban = e.target.value;
                          setForm((prevForm) => ({
                            ...prevForm,
                            dataOptions: newDataOptions,
                          }));
                        }}
                        required
                      />
                    </td>
                    <td>
                      <div className="flex gap-4">
                        <Form.Label>
                          <Form.Radio
                            name={`status_jawaban_${index}`}
                            value={1}
                            checked={item.status_jawaban === 1}
                            onChange={() => {
                              const newDataOptions = [...form.dataOptions]; // Gunakan data dari form.dataOptions
                              newDataOptions[index].status_jawaban = 1;
                              setForm((prevForm) => ({
                                ...prevForm,
                                dataOptions: newDataOptions,
                              }));
                            }}
                          />
                          ACTIVE
                        </Form.Label>
                        <Form.Label>
                          <Form.Radio
                            name={`status_jawaban_${index}`}
                            value={0}
                            checked={item.status_jawaban === 0}
                            onChange={() => {
                              const newDataOptions = [...form.dataOptions]; // Gunakan data dari form.dataOptions
                              newDataOptions[index].status_jawaban = 0;
                              setForm((prevForm) => ({
                                ...prevForm,
                                dataOptions: newDataOptions,
                              }));
                            }}
                          />
                          NON ACTIVE
                        </Form.Label>
                      </div>
                    </td>
                    {/* <td>
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
                          onClick={() => hapusJawaban(index)}
                        />
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <Button
                type="button"
                variant="primary"
                className="mx-auto"
                onClick={tambahJawaban}
              >
                Tambah Jawaban
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 mb-8">
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
