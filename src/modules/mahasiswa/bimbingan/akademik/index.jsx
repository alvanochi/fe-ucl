import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import { useRouter } from "next/router";
import useUser from "../../../../hooks/useUser";
import useMenu from "../../../../hooks/useMenu";
import Card from "../../../../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import useDosen from "../../../../repo/dosen";

export default function AkademikModule({ baseURL }) {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik/get`;
  const FILE_URL = `${process.env.API_ENDPOINT}/dokumen-frs`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);

  if ([user, menu, isDosenLoading, loading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <>
      <Card className="mt-4">
        <Card.Header className="text-center">Bimbingan Akademik</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Tahun Akademik <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="tahun_akademik"
              value={data?.tahun_akademik}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Dosen <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Select
              className="flex-1"
              name="dosen_id"
              value={data?.dosen_id}
              options={
                listDosen &&
                listDosen.map((dosen) => ({
                  label: dosen.nama_lengkap,
                  value: dosen.user_id,
                }))
              }
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 1 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p1"
              value={data?.p1}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 2 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p2"
              value={data?.p2}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 3 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p3"
              value={data?.p3}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pertemuan 4 <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="date"
              className="flex-1"
              name="p4"
              value={data?.p4}
              disabled
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Catatan<span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Textarea
              className="flex-1"
              rows="5"
              name="catatan"
              value={data?.catatan}
              disabled
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Form>
        <Card className="mt-8 mb-8">
          <Card.Header className="text-center">Dokumen FRS</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <div className="flex-1 block">
                <div className="space-y-2 mt-2">
                  <Form.Group className="mb-4">
                    <Form.Label>Dokumen</Form.Label>
                    <Form.Input type="file" className="flex-1" name="dok_frs" />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <embed
                      src={`${FILE_URL}/${data?.dok_frs}`}
                      className="w-full h-[256px]"
                    />
                  </Form.Group>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-12"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
}
