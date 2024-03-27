import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useCRUD from "../../../hooks/useCRUD";
import { Icon } from "@iconify-icon/react";
import _ from "underscore";
import { useState } from "react";
import { Loading } from "../../../components/Loading";

export default function CreateQuestion() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/voting/question`;

  const [jawaban, setJawaban] = useState([{ jawaban: "" }]);

  const tambahJawaban = () => {
    setJawaban([...jawaban, { jawaban: "" }]);
  };

  const hapusJawaban = (index) => {
    setJawaban(jawaban.filter((_, idx) => idx !== index));
  };

  const INITIAL_FORM = {
    deskripsi: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
    transformData: (data) => {
      const transformedData = {
        ...data,
        jawaban: jawaban.map((item) => item.jawaban),
      };
      return transformedData;
    },
  });

  const { form, inputHandler } = formdata;

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
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
                onChange={inputHandler}
              />
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
                    value
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {jawaban.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Input
                        type="text"
                        className="flex-1"
                        name={`jawaban-${index}`}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setJawaban((prevJawaban) =>
                            prevJawaban.map((jawabanItem, idx) =>
                              idx === index
                                ? { ...jawabanItem, jawaban: newValue }
                                : jawabanItem
                            )
                          );
                        }}
                        value={item.jawaban}
                        required
                      />
                    </td>
                    <td>
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
                    </td>
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
