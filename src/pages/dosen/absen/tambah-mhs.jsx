import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import useModal from "../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import useCRUD from "../../../hooks/useCRUD";

export default function TambahMhs({ data }) {
  const { show, toggle, close } = useModal();

  return (
    <>
      <Button
        variant="primary"
        icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
        onClick={toggle}
        pill
      >
        Tambah
      </Button>
      <Modal title="Tambah Mahasiswa" show={show} handler={toggle}>
        <Form className="space-y-4" type="formdata">
          <Form.Group>
            <Form.Label>
              NPM <span className="text-danger-600">*</span>
            </Form.Label>
            <Form.Input
              type="number"
              name="npm"
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[14rem]">
								Status Absen <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<div className="flex gap-4">
								<Form.Label>
									<Form.Radio name="status" value={0} />
									Alfa
								</Form.Label>
								<Form.Label>
									<Form.Radio name="status" value={1} />
									Masuk
								</Form.Label>
								<Form.Label>
									<Form.Radio name="status" value={2} />
									Sakit
								</Form.Label>
							</div>
						</Form.Group>
          <div className="flex gap-4 mt-4">
            <Button onClick={close} variant="primary" className="w-full h-12">
              SAVE
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
