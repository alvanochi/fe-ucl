import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useCRUD from "../../../hooks/useCRUD";

export default function GamifyCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

	const API_URL = `${process.env.API_ENDPOINT}/achievments`;

  const INITIAL_FORM = {
    name: "",
    gamify: "",
    start_point: "",
    points: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "name", label: "Name" },
      { field: "gamify", label: "Gamify" },
      { field: "start_point", label: "Start Point" },
      { field: "points", label: "Point" }
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler } = formdata;

  if ([user, menu].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Create Gamify</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Name <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="name"
                onChange={inputHandler}
                value={form.name}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Gamify <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="gamify"
                onChange={inputHandler}
                value={form.gamify}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Start Point <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="start_point"
                onChange={inputHandler}
                value={form.start_point}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Points <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="points"
                onChange={inputHandler}
                value={form.points}
                required
              />
            </Form.Group>
            
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Image <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="file"
                className="flex-1"
                name="image"
                onChange={inputHandler}
                required
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
