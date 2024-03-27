import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import { useRouter } from "next/router";
import useDosen from "../../../../repo/dosen";
import useMahasiswa from "../../../../repo/mahasiswa";
import {
  ROLE_ID_ADMIN,
  ROLE_ID_DOSEN,
  ROLE_ID_MAHASISWA,
} from "../../../../config/role";
import useCRUD from "../../../../hooks/useCRUD";
import { useEffect } from "react";
import { Loading } from "../../../../components/Loading";

export default function AkademikCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik/add`;

  const INITIAL_MHS = {
    user_id: "",
  };

  const INITIAL_FORM = {
    dosen_id: "",
    tahun_angkatan: "",
    mhs_bimbingan: [],
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => router.push(prefix + menu.url),
    transformData: (data) => ({
      ...data,
      mhs_bimbingan: JSON.stringify(data.mhs_bimbingan),
    }),
  });

  const { form, inputHandler, setForm } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);

  const removeFromUser = (key, index) =>
    setForm((state) => ({
      ...state,
      [key]: state[key].filter((_, idx) => idx != index),
    }));

  useEffect(() => {
    if (!user) return;
    setForm((state) => ({
      ...state,
    }));
  }, [user]);

  if (
    [user, menu, isDosenLoading, isMahasiswaLoading].some(
      (item) => item == null
    )
  )
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Bimbingan Mahasiswa</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Tahun Angkatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="tahun_angkatan"
                value={form.tahun_angkatan}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Dosen <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                name="dosen_id.user_id"
                className="z-10 absolute"
                onChange={(selected) =>
                  inputHandler({
                    target: {
                      name: "dosen_id",
                      value: selected?.value,
                    },
                  })
                }
                value={form.dosen_id}
                options={
                  listDosen &&
                  Array.isArray(listDosen) &&
                  listDosen.map((dosen) => ({
                    label: dosen.nama_lengkap,
                    value: dosen.user_id,
                  }))
                }
                menuTarget={document.body}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="text-sm border-2 border-white bg-gray-50"
              >
                Mahasiswa Bimbingan
              </th>
            </tr>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nama
              </th>
              <th className="text-sm border-2 border-white bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {form.mhs_bimbingan.map((item, index) => (
              <tr key={`dosen-pembimbing-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    index={index}
                    name="mhs_bimbingan.user_id"
                    onChange={(selected) =>
                      inputHandler({
                        target: {
                          attributes: {
                            index: {
                              value: index,
                            },
                          },
                          name: "mhs_bimbingan.user_id",
                          value: selected?.value,
                        },
                      })
                    }
                    value={form.mhs_bimbingan[index].user_id || ""}
                    options={
                      listMahasiswa &&
                      Array.isArray(listMahasiswa) &&
                      listMahasiswa.map((mhs) => ({
                        label: `${mhs.nama_lengkap} - ${mhs.npm}`,
                        value: mhs.user_id,
                      }))
                    }
                    menuTarget={document.body}
                  />
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      type="button"
                      variant="danger"
                      icon={
                        <Icon
                          icon="solar:trash-bin-2-bold-duotone"
                          width={20}
                          height={20}
                        />
                      }
                      onClick={() => removeFromUser("mhs_bimbingan", index)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="text-sm border-2 border-white bg-gray-50"
              >
                <Button
                  type="button"
                  variant="primary"
                  className="mx-auto"
                  onClick={() =>
                    setForm((state) => ({
                      ...state,
                      mhs_bimbingan: [
                        ...state.mhs_bimbingan,
                        { ...INITIAL_MHS },
                      ],
                    }))
                  }
                >
                  Tambah Mahasiswa
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
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
