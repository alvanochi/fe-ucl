import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";

export default function TtdModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading } = useDatatable(DATA_URL);

  return (
    <>
      <Card className="mt-4">
        <Card.Header className="text-center">Tanda Tangan</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">TTD</Form.Label>
            <span>:</span>
            {!loading && data.ttd ? (
              <img
                src={data.ttd}
                alt="TTD"
                className="w-100 h-100 object-cover border-2 border-primary-600"
              />
            ) : (
              <span>Belum ada tanda tangan</span>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
}
