import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import useDatatable from "../../../hooks/useDatatable";
import { useEffect, useState } from "react";
import axios from "axios";
import useDosen from "../../../repo/dosen";
import useMahasiswa from "../../../repo/mahasiswa";
import useForm from "../../../hooks/useForm";
import useCRUD from "../../../hooks/useCRUD";

import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";
import { ROLE_ID_ADMIN } from "../../../config/role";
import { Icon } from "@iconify-icon/react";
import _ from "underscore";
import { Loading } from "../../../components/Loading";
import useGroup from "../../../repo/group";
import useKategoriKegiatan from "../../../repo/kategori-kegiatan";
import useRuangan from "../../../repo/ruangan";
import useUsers from "../../../repo/users";

export default function CreateJadwal() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const STORE_URL = `${process.env.API_ENDPOINT}/meet/store`;

  const INITIAL_PESERTA_DOSEN = {
    nip: "",
  };
  const INITIAL_PESERTA_MHS = {
    npm: "",
  };
  const INITIAL_GROUPS = {
    id: "",
  };

  const INITIAL_FORM = {
    nm_pengundang: "",
    nm_kegiatan: "",
    pertemuan: "",
    ruangan: "",
    status_ruangan: "",
    tanggal: "",
    waktu: "",
    waktu_end: "",
    narsum: "",
    ket_narsum: "",
    link_online: "",
    tipe_kegiatan: "",
    peserta_dosen: [],
    peserta_mahasiswa: [],
    groups: [],
  };

  const { formdata, submitHandler } = useCRUD(STORE_URL, INITIAL_FORM, {
    rules: [
      { field: "nm_pengundang", label: "Nama Pengundang" },
      { field: "nm_kegiatan", label: "Nama Kegiatan" },
      { field: "pertemuan", label: "Pertemuan" },
      { field: "ruangan", label: "Ruangan" },
      { field: "status_ruangan", label: "Status Ruangan" },
      { field: "tanggal", label: "Tanggal" },
      { field: "waktu", label: "Waktu" },
    ],
    transformData: (data) =>
      _.omit(
        {
          ...data,
          peserta: JSON.stringify({
            peserta_mhs: data.peserta_mahasiswa.map((item) =>
              _.omit(item, ["role"])
            ),
            peserta_dosen: data.peserta_dosen.map((item) =>
              _.omit(item, ["role"])
            ),
            groups: data.groups.map((item) => _.omit(item, ["role"])),
          }),
        },
        ["peserta_dosen", "peserta_mahasiswa", "groups"]
      ),
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, setForm } = formdata;
  const { data: listKegiatan, isLoading: isKegiatanLoading } =
    useKategoriKegiatan([user]);
  const { data: listGroup, isLoading: isGroupLoading } = useGroup([user]);
  const { data: listDosen, isLoading: isDosenLoading } = useDosen([user]);
  const { data: listMahasiswa, isLoading: isMahasiswaLoading } = useMahasiswa([
    user,
  ]);
  const { data: listRuangan, isLoading: isRuanganLoading } = useRuangan([user]);
  const { data: listUsers, isLoading: isUsersLoading } = useUsers([user]);

  const removeFromUser = (key, index, role) =>
    setForm((state) => ({
      ...state,
      [key]: state[key].filter(
        (item, idx) => item.role == role && idx != index
      ),
    }));

  if (
    [
      user,
      menu,
      isDosenLoading,
      isMahasiswaLoading,
      isGroupLoading,
      isKegiatanLoading,
      isRuanganLoading,
      isUsersLoading,
    ].some((item) => item == null)
  )
    return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Buat Jadwal Rapat</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Nama Pengundang <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nm_pengundang"
                onChange={inputHandler}
                value={form.nm_pengundang}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Tipe Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                className="border-blue-900"
                name="tipe_kegiatan"
                onChange={(selected) =>
                  inputHandler({
                    target: {
                      attributes: {
                        index: {
                          value: selected?.value,
                        },
                      },
                      name: "tipe_kegiatan",
                      value: selected?.value,
                    },
                  })
                }
                value={form.tipe_kegiatan}
                options={
                  listKegiatan &&
                  Array.isArray(listKegiatan) &&
                  listKegiatan.map((keg) => ({
                    label: keg.nama_kegiatan,
                    value: keg.id,
                  }))
                }
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Judul Kegiatan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nm_kegiatan"
                onChange={inputHandler}
                value={form.nm_kegiatan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Sub Judul <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="sub_tema"
                onChange={inputHandler}
                value={form.sub_tema}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Pertemuan Ke - <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="number"
                className="flex-1"
                name="pertemuan"
                onChange={inputHandler}
                value={form.pertemuan}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Narasumber/Pembicara <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                className="border-blue-900"
                name="narsum"
                onChange={(selected) =>
                  inputHandler({
                    target: {
                      attributes: {
                        index: {
                          value: selected?.value,
                        },
                      },
                      name: "narsum",
                      value: selected?.value,
                    },
                  })
                }
                value={form.narsum}
                options={
                  listUsers &&
                  Array.isArray(listUsers) &&
                  listUsers.map((user) => ({
                    label: `${user.personal_data?.nama_lengkap} - ${
                      user.npm ? user.npm : user.personal_data?.nip
                    }`,
                    value: user.user_id,
                  }))
                }
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Keterangan Narasumber <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="ket_narsum"
                onChange={inputHandler}
                value={form.ket_narsum}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Ruangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Combobox
                className="border-blue-900"
                name="ruangan"
                onChange={(selected) =>
                  inputHandler({
                    target: {
                      attributes: {
                        index: {
                          value: selected?.value,
                        },
                      },
                      name: "ruangan",
                      value: selected?.value,
                    },
                  })
                }
                value={form.ruangan}
                options={
                  listRuangan &&
                  Array.isArray(listRuangan) &&
                  listRuangan.map((ruang) => ({
                    label: ruang.nama_ruangan,
                    value: ruang.id,
                  }))
                }
                menuTarget={document.body}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">Link Online</Form.Label>
              <span>:</span>
              <Form.Input
                type="url"
                className="flex-1"
                name="link_online"
                onChange={inputHandler}
                value={form.link_online}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Tanggal <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="date"
                className="flex-1"
                name="tanggal"
                onChange={inputHandler}
                value={form.tanggal}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Waktu Mulai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="time"
                className="flex-1"
                name="waktu"
                onChange={inputHandler}
                value={form.waktu}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Waktu Selesai <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="time"
                className="flex-1"
                name="waktu_end"
                onChange={inputHandler}
                value={form.waktu_end}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Contact <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="contact"
                onChange={inputHandler}
                value={form.contact}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[14rem]">
                Status <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_ruangan"
                    onChange={inputHandler}
                    value={0}
                  />
                  Offline
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_ruangan"
                    onChange={inputHandler}
                    value={1}
                  />
                  Online
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_ruangan"
                    onChange={inputHandler}
                    value={2}
                  />
                  Hybird
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>

        <div className="flex justify-between">
          <div className="flex-grow">
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
              cellPadding={10}
            >
              <colgroup>
                <col style={{ width: "80%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    Undang Group
                  </th>
                </tr>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Nama Group
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.groups.map((item, index) => (
                  <tr key={`group-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <Form.Combobox
                        index={index}
                        name="groups.id"
                        onChange={(selected) =>
                          inputHandler({
                            target: {
                              attributes: {
                                index: {
                                  value: index,
                                },
                              },
                              name: "groups.id",
                              value: selected?.value,
                            },
                          })
                        }
                        value={form.groups[index].id}
                        options={
                          listGroup &&
                          Array.isArray(listGroup) &&
                          listGroup.map((group) => ({
                            label: group.nama_group,
                            value: group.id,
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
                          onClick={() =>
                            removeFromUser("groups", index, "Groups")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    <Button
                      type="button"
                      variant="primary"
                      className="mx-auto"
                      onClick={() =>
                        setForm((state) => ({
                          ...state,
                          groups: [
                            ...state.groups,
                            { ...INITIAL_GROUPS, role: "Admin" },
                          ],
                        }))
                      }
                    >
                      Tambah Group
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="mr-4 flex-grow">
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
              cellPadding={10}
            >
              <colgroup>
                <col style={{ width: "80%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    Undang Peserta Rapat Pendidik(Dosen)
                  </th>
                </tr>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Nama
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.peserta_dosen.map((item, index) => (
                  <tr key={`peserta-dosen-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <Form.Combobox
                        index={index}
                        name="peserta_dosen.nip"
                        onChange={(selected) =>
                          inputHandler({
                            target: {
                              attributes: {
                                index: {
                                  value: index,
                                },
                              },
                              name: "peserta_dosen.nip",
                              value: selected?.value,
                            },
                          })
                        }
                        value={form.peserta_dosen[index].nip}
                        options={
                          listDosen &&
                          Array.isArray(listDosen) &&
                          listDosen.map((dosen) => ({
                            label: dosen.nama_lengkap,
                            value: dosen.nip,
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
                          onClick={() =>
                            removeFromUser("peserta_dosen", index, "Dosen")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    <Button
                      type="button"
                      variant="primary"
                      className="mx-auto"
                      onClick={() =>
                        setForm((state) => ({
                          ...state,
                          peserta_dosen: [
                            ...state.peserta_dosen,
                            { ...INITIAL_PESERTA_DOSEN, role: "Dosen" },
                          ],
                        }))
                      }
                    >
                      Tambah Peserta
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex-grow">
            <table
              className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-4"
              cellPadding={10}
            >
              <colgroup>
                <col style={{ width: "80%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    Undang Peserta Rapat Mahasiswa
                  </th>
                </tr>
                <tr>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Nama
                  </th>
                  <th className="text-sm border-2 border-white bg-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.peserta_mahasiswa.map((item, index) => (
                  <tr key={`peserta-mahasiswa-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <Form.Combobox
                        index={index}
                        name="peserta_mahasiswa.npm"
                        onChange={(selected) =>
                          inputHandler({
                            target: {
                              attributes: {
                                index: {
                                  value: index,
                                },
                              },
                              name: "peserta_mahasiswa.npm",
                              value: selected?.value,
                            },
                          })
                        }
                        value={form.peserta_mahasiswa[index].npm}
                        options={
                          listMahasiswa &&
                          Array.isArray(listMahasiswa) &&
                          listMahasiswa.map((mahasiswa) => ({
                            label: `${mahasiswa.nama_lengkap} - ${mahasiswa.npm}`,
                            value: mahasiswa.npm,
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
                          onClick={() =>
                            removeFromUser(
                              "peserta_mahasiswa",
                              index,
                              "Mahasiswa"
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={4}
                    className="text-sm border-2 border-white bg-gray-50"
                  >
                    <Button
                      type="button"
                      variant="primary"
                      className="mx-auto"
                      onClick={() =>
                        setForm((state) => ({
                          ...state,
                          peserta_mahasiswa: [
                            ...state.peserta_mahasiswa,
                            { ...INITIAL_PESERTA_MHS, role: "Mahasiswa" },
                          ],
                        }))
                      }
                    >
                      Tambah Peserta
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex gap-4 mt-8 mb-8">
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
