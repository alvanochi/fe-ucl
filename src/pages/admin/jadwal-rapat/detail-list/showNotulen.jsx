import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Form from "../../../../components/Form";
import useModal from "../../../../hooks/useModal";
import { Icon } from "@iconify-icon/react";
import { MySwal, loadingAlert, toastAlert } from "../../../../lib/sweetalert";

const ShowNotulen = ({ notulen }) => {
  const { show, toggle, close } = useModal();

  return (
    <>
      <span
        onClick={toggle}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
      >
        Lihat Notulen
      </span>

      <Modal title="Notulen" show={show} handler={toggle} size="xl">
        <Form className="space-y-4">
          <Form.Textarea
            className="flex-1"
            rows="20"
            name="notulen"
            value={notulen}
          />

          <div className="flex gap-4 mt-12 justify-end">
            <Button type="button" variant="secondary" onClick={close}>
              Tutup
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ShowNotulen;
