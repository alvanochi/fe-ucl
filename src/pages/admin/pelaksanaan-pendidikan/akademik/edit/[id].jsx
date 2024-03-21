import { Icon } from "@iconify-icon/react";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../../../hooks/useCRUD";
import useDosen from "../../../../../repo/dosen";
import useMahasiswa from "../../../../../repo/mahasiswa";
import date from "../../../../../utils/date";
import { useEffect } from "react";
import _ from "underscore";

export default function AkademikEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik`;

  const INITIAL_MHS = {
    mhs_id: "",
  };

  const INITIAL_FORM = {
    id: "",
    dosen_id: "",
    tahun_angkatan: "",
    mhs_bimbingan: [],
  };

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    transformData: (data) =>
      _.omit({
        ...data,
        mhs_bimbingan: JSON.stringify(data.mhs_bimbingan),
      }),
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, setForm } = formdata;

  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);

  const EDIT_OPTION = {
    url: `${API_URL}/${form.id}`,
    method: "PATCH",
  };

  const findInUser = (lists, id) =>
    lists.find((item) => item.user_id == id) ?? null;

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {
      transformData: (data) => ({
        ...INITIAL_FORM,
        ...data.dataBimbingan,
        mhs_bimbingan: data.mhsBimbingan,
      }),
    });
  }, [router, user]);

  const DELETE_MHS = `${process.env.API_ENDPOINT}/bimbingan-akademik/mhs-bimbingan`;

  const { destroy } = useCRUD(DELETE_MHS);

  if (
    [user, menu, isDosenLoading, isMahasiswaLoading].some(
      (item) => item == null
    )
  )
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader
        title={`Edit ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Penelitian</Card.Header>
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
            {form.mhs_bimbingan.map((item, index) => {
              return (
                <tr key={`anggota-dosen-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {user?.user_id == item.user_id &&
                      listMahasiswa &&
                      findInUser(listMahasiswa, item.user_id)?.nama_lengkap}
                    {user?.user_id != item.user_id && (
                      <Form.Combobox
                        index={index}
                        name="mhs_bimbingan.mhs_id"
                        onChange={(selected) =>
                          inputHandler({
                            target: {
                              attributes: {
                                index: {
                                  value: index,
                                },
                              },
                              name: "mhs_bimbingan.mhs_id",
                              value: selected?.value,
                            },
                          })
                        }
                        value={form.mhs_bimbingan[index].mhs_id || ""}
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
                    )}
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
                        onClick={() =>
                          destroy(item.id).then(() =>
                            router.push(prefix + menu.url)
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
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
