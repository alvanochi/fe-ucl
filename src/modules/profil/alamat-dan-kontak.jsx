import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";

export default function AlamatDanKontakModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading } = useDatatable(DATA_URL);

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/alamat-dan-kontak/edit`}
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Card className="mt-4">
        <Card.Header className="text-center">Alamat Dan Kontak</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Email</Form.Label>
            <span>:</span>
            <p>{!loading && data.email}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Alamat</Form.Label>
            <span>:</span>
            <p>{!loading && data.alamat}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">RT</Form.Label>
            <span>:</span>
            <p>{!loading && data.rt}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">RW</Form.Label>
            <span>:</span>
            <p>{!loading && data.rw}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Desa/Kelurahan</Form.Label>
            <span>:</span>
            <p>{!loading && data.desa_kelurahan}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Kota/Kabupaten</Form.Label>
            <span>:</span>
            <p>{!loading && data.kota_kabupaten}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Kode POS</Form.Label>
            <span>:</span>
            <p>{!loading && data.kode_pos}</p>
          </Form.Group>

          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Nomor HP</Form.Label>
            <span>:</span>
            <p>{!loading && data.no_hp}</p>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
}
