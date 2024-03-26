import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import { useRouter } from "next/router";
import useCRUD from "../../../hooks/useCRUD";
import useUsers from "../../../repo/users";
import { useEffect, useState } from "react";
import _ from "underscore";
import useNewDataTable from "../../../hooks/useNewDataTable";
import axios from "axios";
import { MySwal, loadingAlert, toastAlert } from "../../../lib/sweetalert";

export default function AkademikEdit() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const API_URL = `${process.env.API_ENDPOINT}/voting/group-users`;

  const [searchValue, setSearchValue] = useState("");
  const DATA_GROUP_USERS = `${process.env.API_ENDPOINT}/voting/group-users`;
  const {
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    filter,
    setPageAbsensi,
    setFilter,
    canPrevAbsensi,
    canNextAbsensi,
    refreshAbsensi,
    sortBy,
    getSortBy,
  } = useNewDataTable(
    DATA_GROUP_USERS,
    { filter: ["id_group"], filterValue: [router.query.id] },
    searchValue
  );

  const INITIAL_USERS = {
    user_id: "",
    code: "",
  };

  const INITIAL_FORM = {
    id: "",
    nama_group: "",
    users: [],
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    success: () => {
      setForm((state) => ({
        ...state,
        users: [],
      }));
      refreshAbsensi();
    },
    transformData: (data) => ({
      ...data,
      users: JSON.stringify(data.users),
    }),
  });

  const { form, inputHandler, setForm } = formdata;

  const { data: listUsers, isLoading: isUsersLoading } = useUsers([user]);

  const removeFromUser = (key, index) =>
    setForm((state) => ({
      ...state,
      [key]: state[key].filter((_, idx) => idx != index),
    }));

  useEffect(() => {
    if (router.isReady === false || !user) return;

    const fetchData = async () => {
      if (router.query.id) {
        const DATA_URL = `${process.env.API_ENDPOINT}/voting/group-voting/${router.query.id}`;
        const response = await axios.get(DATA_URL);
        const data = response.data.data;

        setForm((state) => ({
          ...state,
          id: data.id,
          nama_group: data.nama_group,
        }));
      }
    };

    fetchData();

    setForm((state) => ({
      ...state,
    }));
  }, [router, user]);

  const deleteHandler = async (user_id, id) => {
    const DELETE_USER = `${process.env.API_ENDPOINT}/voting/group-users/${user_id}`;

    try {
      const request = await axios.put(DELETE_USER, {
        id: id,
      });

      const response = await request.data;

      toastAlert("success", "Successfully removed from group.");
      refreshAbsensi();
    } catch (error) {
      if (error.name === "AxiosError") {
        const { status_code, message, data } = error.response.data;
        toastAlert("error", message);

        return;
      }
      loadingAlert();
      MySwal.close();

      toastAlert("error", error.message);
    }
  };

  if ([user, menu, isUsersLoading].some((item) => item == null))
    return <p>Loading...</p>;
  return (
    <Layout>
      <PageHeader
        title={`Edit ${menu.label}`}
        icon={menu.icon}
        handler={setActive}
      />
      <Form onSubmit={submitHandler}>
        <Card className="mt-4">
          <Card.Header className="text-center">Group Users</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Group <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_group"
                value={form.nama_group}
                readOnly
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
                Add Users
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
            {form.users.map((item, index) => (
              <tr key={`users-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <Form.Combobox
                    index={index}
                    name="users.user_id"
                    onChange={(selected) => {
                      const selectedUser = listUsers.find(
                        (user) => user.user_id === selected.value
                      );
                      const codeValue =
                        selectedUser?.npm || selectedUser?.nip || "";
                      inputHandler({
                        target: {
                          attributes: {
                            index: {
                              value: index,
                            },
                          },
                          name: "users.user_id",
                          value: selected?.value,
                        },
                      });
                      inputHandler({
                        target: {
                          attributes: {
                            index: {
                              value: index,
                            },
                          },
                          name: "users.code",
                          value: codeValue,
                        },
                      });
                    }}
                    value={form.users[index].user_id || ""}
                    options={
                      listUsers &&
                      Array.isArray(listUsers) &&
                      listUsers.map((user) => ({
                        label: `${user.nama_lengkap} - ${
                          user.npm ? user.npm : user.nip
                        }`,
                        value: user.user_id,
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
                      onClick={() => removeFromUser("users", index)}
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
                      users: [...state.users, { ...INITIAL_USERS }],
                    }))
                  }
                >
                  Add
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

      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto mt-8"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th
              colSpan={4}
              className="text-sm border-2 border-white bg-gray-50"
            >
              <span>Users</span>
              <div className="flex mb-8 justify-end items-center">
                <div className="flex-shrink">
                  <Form.Input
                    type="text"
                    name="search"
                    placeholder="Search"
                    style={{ width: "400px" }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">Nama</th>
            <th className="text-sm border-2 border-white bg-gray-200">Code</th>
            <th className="text-sm border-2 border-white bg-gray-200">Role</th>
            <th className="text-sm border-2 border-white bg-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingAbsensi && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Loading...
              </td>
            </tr>
          )}
          {!loadingAbsensi && dataAbsensi && dataAbsensi.length < 1 && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {!loadingAbsensi &&
            dataAbsensi &&
            dataAbsensi.map((user, index) => (
              <tr key={`anggota-dosen-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {user.nama_lengkap}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {user.code}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {user.role}
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
                          onClick={() =>
                            deleteHandler(user.user_id, router.query.id)
                          }
                        />
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex mt-8 mb-8">
        <div className="flex gap-1 ml-auto">
          <Button.Icon
            type="button"
            variant="outline-primary"
            icon={
              <Icon
                icon="material-symbols:chevron-left"
                width={20}
                height={20}
              />
            }
            onClick={() => setPageAbsensi(pageAbsensi - 1)}
            disabled={pageAbsensi <= 1}
            pill
          />
          <Button
            type="button"
            variant="primary"
            icon={
              <Icon
                icon="material-symbols:chevron-right"
                width={20}
                height={20}
              />
            }
            iconPosition="right"
            onClick={() => setPageAbsensi(pageAbsensi + 1)}
            disabled={pageAbsensi >= pageCountAbsensi}
            pill
          >
            Next Page
          </Button>
        </div>
        <div className="ml-auto whitespace-nowrap flex items-center gap-2">
          <p className="">Page</p>
          <Form.Input
            type="number"
            min="1"
            max={pageCountAbsensi || 1}
            className="w-20"
            value={pageAbsensi}
            onChange={(event) =>
              setPageAbsensi(
                Math.max(
                  1,
                  Math.min(event.target.valueAsNumber, pageCountAbsensi || 1)
                )
              )
            }
          />
          of {pageCountAbsensi || 1}
        </div>
      </div>
    </Layout>
  );
}
