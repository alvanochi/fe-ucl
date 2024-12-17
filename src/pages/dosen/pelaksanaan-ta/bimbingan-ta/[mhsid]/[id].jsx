import Card from "../../../../../components/Card";
import Layout from "../../../../../components/Layout";
import PageHeader from "../../../../../components/PageHeader";
import useMenu from "../../../../../hooks/useMenu";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Loading } from "../../../../../components/Loading";
import useNewDataTableNew from "../../../../../hooks/useNewDataTableNew";
import Button from "../../../../../components/Button";
import Form from "../../../../../components/Form";
import SortIcon from "../../../../../components/SortIcon";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import CreateProgresBimbingan from "../create";
import useCRUD from "../../../../../hooks/useCRUD";
import Edit from "../edit";
import BackButton from "../../../../../components/BackButton";

export default function PelaksanaanKolo() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const dataUrl = router.query.id
    ? `${process.env.API_ENDPOINT}/progres-tugas-akhir/list-progres/${router.query.id}`
    : null;

  const DELETE_URL = `${process.env.API_ENDPOINT}/progres-tugas-akhir/delete-progres`;

  const [searchValue, setSearchValue] = useState("");

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    sortByNew,
    getSortByNew,
    refreshNew,
    filterNew,
    setFilterNew,
  } = useNewDataTableNew(dataUrl, {}, searchValue);

  const { destroy } = useCRUD(DELETE_URL);

  useEffect(() => {
    if (!router.isReady || !user || !router.query.id || !router.query.mhsid)
      return;
  }, [router.isReady, user, router.query.id, router.query.mhsid]);

  const handleAction = () => {
    refreshNew();
  };

  const INITIAL_FORM = {
    id: "",
    status_kelulusan: "",
    peran: "",
  };
  const API_URL = `${process.env.API_ENDPOINT}/tugas-akhir/detail`;

  const { formdata, show, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [{ field: "status_kelulusan", label: "Status Kelulusan" }],
    success: () => router.push(prefix + menu.url),
  });
  const { form, inputHandler } = formdata;
  const EDIT_URL = `${process.env.API_ENDPOINT}/tugas-akhir/update-kelulusan`;
  const EDIT_OPTION = { url: `${EDIT_URL}/${form.id}`, method: "PUT" };

  useEffect(() => {
    if (router.isReady === false || !user) return;
    show(router.query.id, {});
  }, [router, user]);

  if ([user, menu, dataUrl].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={menu.label}
        icon={menu.icon}
        handler={setActive}
        leading={<BackButton />}
      />

      <Form onSubmit={(event) => submitHandler(event, EDIT_OPTION)}>
        <Card className="mt-4">
          <Card.Header className="text-center">Anggota Profesi</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Status Kelulusan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="flex gap-4">
                <Form.Label>
                  <Form.Radio
                    name="status_kelulusan"
                    value={0}
                    onChange={inputHandler}
                    checked={form.status_kelulusan == 0}
                  />
                  BELUM LULUS
                </Form.Label>
                <Form.Label>
                  <Form.Radio
                    name="status_kelulusan"
                    value={1}
                    onChange={inputHandler}
                    checked={form.status_kelulusan == 1}
                  />
                  LULUS
                </Form.Label>
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>
      <Card className="mt-8">
        <Card.Header className="text-center">
          <div>Progres Bimbingan Tugas Akhir</div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <div className="flex mb-8 justify-end items-center">
            <div className="mr-4">
              {!/(Evaluator|Penguji)/i.test(form.peran) &&
                (!/Kepala Lab/i.test(form.peran) ||
                  /Pembimbing/i.test(form.peran)) && (
                  <CreateProgresBimbingan
                    onAction={handleAction}
                    id={router.query.id}
                    mhsid={router.query.mhsid}
                  />
                )}
            </div>
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
          <table
            className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
            cellPadding={10}
          >
            <thead>
              <tr>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => sortByNew("id")}
                  >
                    No <SortIcon sort={getSortByNew("id")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => sortByNew("last_tgl")}
                  >
                    Tanggal
                    <SortIcon sort={getSortByNew("last_tgl")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => sortByNew("count")}
                  >
                    Pertemuan
                    <SortIcon sort={getSortByNew("count")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => sortByNew("bab")}
                  >
                    Bab
                    <SortIcon sort={getSortByNew("bab")} />
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">
                    Deskripsi
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  <div className="flex items-center gap-2 cursor-pointer">
                    Pembahasan
                  </div>
                </th>
                <th className="text-sm border-2 border-white bg-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingNew && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-sm border-2 border-white bg-gray-50 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loadingNew && dataNew && dataNew.length < 1 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-sm border-2 border-white bg-gray-50 text-center"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
              {!loadingNew &&
                dataNew &&
                dataNew.map((row, index) => (
                  <tr key={`row-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {index + 1}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 ">
                      {row.last_tgl}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 ">
                      {row.count}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 ">
                      {row.bab}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 ">
                      {row.deskripsi}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 ">
                      {row.pembahasan}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      <div className="flex items-stretch gap-1">
                        <Edit onAction={handleAction} id={row.id} />
                        <Button.Icon
                          variant="danger"
                          icon={
                            <Icon
                              icon="solar:trash-bin-2-bold-duotone"
                              width={20}
                              height={20}
                            />
                          }
                          onClick={() =>
                            destroy(row.id).then(() => refreshNew())
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex mt-8">
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
                onClick={() => setPageNew(pageNew - 1)}
                disabled={pageNew <= 1}
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
                onClick={() => setPageNew(pageNew + 1)}
                disabled={pageNew >= pageCountNew}
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
                max={pageCountNew || 1}
                className="w-20"
                value={pageNew}
                onChange={(event) =>
                  setPageNew(
                    Math.max(
                      1,
                      Math.min(event.target.valueAsNumber, pageCountNew || 1)
                    )
                  )
                }
              />
              of {pageCountNew || 1}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}
