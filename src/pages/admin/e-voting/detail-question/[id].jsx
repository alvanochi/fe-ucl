import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import useCRUD from "../../../../hooks/useCRUD";
import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../../../../../tailwind.config";

const BarChart = dynamic(() => import("../../../../components/Chart/bar"), {
  ssr: false,
});

export default function VoteDetail() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/voting/question`;

  const { formdata, show } = useCRUD(API_URL);
  const { form } = formdata;

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...data,
      }),
    });
  }, [router, user]);

  const [valueChart, setValueChart] = useState([]);
  const [labelsChart, setLabelsChart] = useState([]);
  const [barColors, setBarColors] = useState("");

  const config = resolveConfig(twConfig);

  const {
    theme: { colors },
  } = config;

  const generateDynamicColor = (label) => {
    const hash = label
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const dynamicColor = `hsl(${hash % 360}, 70%, 50%)`;

    return dynamicColor;
  };

  const dataUse = {
    labels: labelsChart,
    datasets: [
      {
        fill: true,
        label: "Votes",
        data: valueChart,
        borderColor: colors.primary[600],
        backgroundColor: barColors !== "" ? barColors : colors.primary[600],
      },
    ],
  };

  useEffect(() => {
    if (form && form.realCount) {
      const datas = form.realCount.data;
      const labels = form.realCount.label;

      setValueChart(datas);
      setLabelsChart(labels.map((label) => label.toLowerCase()));

      const dynamicColors = labels.map((label) => generateDynamicColor(label));

      setBarColors(dynamicColors);
    }
  }, [form]);

  if ([user, menu, form].some((item) => item == null)) return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <div className="flex justify-center mt-4"></div>
      <Form>
        <Card className="mt-4">
          <Card.Header className="text-center">Detail Vote</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Deskripsi <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Textarea
                className="flex-1"
                rows="5"
                name="deskripsi"
                value={form?.pertanyaan.deskripsi}
                disabled
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>

              {form?.pertanyaan.status_pertanyaan === 0 ? (
                <>
                  <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    NON ACTIVE
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    ACTIVE
                  </span>
                </>
              )}
            </Form.Group>
          </Card.Body>
        </Card>

        <div
          id="alert-border-1"
          className="flex items-center p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 mt-8"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div className="ms-3 text-lg font-semibold">
            Jumlah Suara Masuk:{" "}
            <span className="underline font-extrabold pl-4">
              {form?.jmlSuara}
            </span>
          </div>
        </div>

        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
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
              <th className="text-sm border-2 border-white bg-gray-200">
                Suara
              </th>
            </tr>
          </thead>
          <tbody>
            {form?.option.map((opt, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {opt.jawaban}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {opt.status_jawaban === 1 ? (
                    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                      NON ACTIVE
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 text-center">
                  {opt.hasil}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Card className="col-span-2 sm:col-span-8 lg:col-span-8 mt-8">
          <Card.Header className="bg-primary-600 text-white text-center text-sm">
            Grafik
          </Card.Header>
          <Card.Body className="">
            <BarChart data={dataUse} />
          </Card.Body>
        </Card>

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
