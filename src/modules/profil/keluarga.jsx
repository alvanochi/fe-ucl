import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";
import date from "../../utils/date";

export default function KeluargaModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading } = useDatatable(DATA_URL);

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Button
          as="a"
          href={`${baseURL}/keluarga/edit`}
          variant="secondary"
          icon={<Icon icon="bx:edit" width={20} height={20} />}
          pill
        >
          Edit
        </Button>
      </div>
      <Card className="mt-4">
        <Card.Header className="text-center">Keluarga</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Status Perkawinan</Form.Label>
            <span>:</span>
            {data.status_kawin == 1 ? (
              <p>Sudah Menikah</p>
            ) : (
              <p>Belum Menikah</p>
            )}
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">Nama Suami/Istri</Form.Label>
            <span>:</span>
            <p>{!loading && data.nama_pasangan}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">NIP Suami/Istri</Form.Label>
            <span>:</span>
            <p>{!loading && data.nip_pasangan}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Pekerjaan Suami/Istri
            </Form.Label>
            <span>:</span>
            <p>{!loading && data.pekerjaan_pasangan}</p>
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Terhitung Mulai Tanggal PNS Suami/istri
            </Form.Label>
            <span>:</span>
            <p>
              {!loading && data.tanggal_pns_pasangan
                ? date.formatToID(new Date(data.tanggal_pns_pasangan))
                : ""}
            </p>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
}
