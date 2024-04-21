import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";
import date from "../../utils/date";

export default function WaliModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading } = useDatatable(DATA_URL);

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/wali/edit`}
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Card className="mt-4">
        <Card.Header className="text-center">Wali</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Wali</Form.Label>
            <span>:</span>
            <p>{!loading && data.wali}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">No. Telp Wali</Form.Label>
            <span>:</span>
            <p>{!loading && data.telp_wali}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Alamat Wali</Form.Label>
            <span>:</span>
            <p>{!loading && data.alamat_wali}</p>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
}
