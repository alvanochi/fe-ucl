import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Form from "../../components/Form";
import useDatatable from "../../hooks/useDatatable";
import { ROLE_ID_MAHASISWA } from "../../config/role";

export default function LainyaModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/profile/getDataPribadi`;
  const { data, loading } = useDatatable(DATA_URL);

  return (
    <>
      {!loading && data.role == "Mahasiswa" && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <Button
            as="a"
            href={`${baseURL}/lainya/edit`}
            variant="secondary"
            icon={<Icon icon="bx:edit" width={20} height={20} />}
            pill
          >
            Edit
          </Button>
        </div>
      )}

      <Card className="mt-4">
        <Card.Header className="text-center">Lainya</Card.Header>
        <Card.Body className="space-y-4">
          {!loading && data.role == "Mahasiswa" && (
            <>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">Pekerjaan</Form.Label>
                <span>:</span>
                <p>{!loading && data.pekerjaan}</p>
              </Form.Group>
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[18rem]">
                  Alamat Pekerjaan
                </Form.Label>
                <span>:</span>
                <p>{!loading && data.alamat_pekerjaan}</p>
              </Form.Group>
            </>
          )}

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
