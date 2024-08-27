import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import Button from "../../../components/Button";
import { Icon } from "@iconify-icon/react";
import useDatatableAbsensi from "../../../hooks/useDataTableAbsensi";
import useCRUD from "../../../hooks/useCRUD";
import Form from "../../../components/Form";
import ShowQr from "./showQr";
import { Loading } from "../../../components/Loading";
import Filter from "./filter";

export default function JadwalRapat() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/meet/meeting`;
  const DELETE_URL = `${process.env.API_ENDPOINT_ABSEN}/meeting/delete`;
  const {
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    setPageAbsensi,
    canPrevAbsensi,
    canNextAbsensi,
    refreshAbsensi,
    sortBy,
    getSortBy,
    recordsTotal,
    filter,
    setFilter,
  } = useDatatableAbsensi(DATA_URL);

  console.log(dataAbsensi);

  const { destroy } = useCRUD(DELETE_URL);

  if ([user, menu, loadingAbsensi].some((item) => item == null))
    return <Loading />;
  return (
    <Layout>
      <PageHeader
        title="Jadwal Kegiatan"
        icon={menu.icon}
        items={menu.submenus}
        handler={setActive}
      />
      <div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
          <Filter filter={filter} handler={setFilter} />

          <Button
            onClick={() =>
              window.open(`${`${prefix + menu.url}/create`}`, "_blank")
            }
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Tambah Jadwal
          </Button>
          <Button
            onClick={() =>
              window.open(`${`${prefix + menu.url}/sebaran`}`, "_blank")
            }
            variant="success"
            icon={<Icon icon="logos:google-maps" width={20} height={20} />}
            pill
          >
            Sebaran
          </Button>
        </div>
        <table
          className="w-full border-collapse rounded-2xl overflow-hidden shadow"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">No</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Tipe Kegiatan
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  Nama Kegiatan
                </div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Nararumber
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2">Ruangan</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2">Tgl</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                <div className="flex items-center gap-2">Waktu</div>
              </th>
              <th className="text-sm border-2 border-white bg-gray-200">
                Status
              </th>
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
              dataAbsensi.map((row, index) => {
                const startNumber = (pageAbsensi - 1) * 10 + 1;

                const rowNumber = startNumber + index;
                return (
                  <tr key={`row-${index}`}>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {rowNumber}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.tipe_kegiatan}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.nm_kegiatan}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.narsum}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.ruangan}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.tanggal}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {`${row.waktu} - ${row.waktu_end}`}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50">
                      {row.status_ruangan === 1
                        ? "ONLINE"
                        : row.status_ruangan === 0
                        ? "OFFLINE"
                        : "HYBRID"}
                    </td>
                    <td className="text-sm border-2 border-white bg-gray-50 max-w-[8rem] truncate mx-auto">
                      <div className="flex items-stretch gap-1">
                        <Button.Icon
                          as="a"
                          href={`https://absen.ft.uika-bogor.ac.id/storage/generatePamplet/${row.nm_kegiatan} - ${row.narsum} (${row.tanggal}).png`}
                          variant="success"
                          icon={
                            <Icon
                              icon="game-icons:target-poster"
                              width={15}
                              height={15}
                            />
                          }
                        />
                        <Button.Icon
                          as="a"
                          href={`${prefix + menu.url}/invite/${row.id}`}
                          variant="primary"
                          icon={
                            <Icon
                              icon="bi:person-fill-add"
                              width={15}
                              height={15}
                            />
                          }
                        />
                        <ShowQr
                          data={{ token: row.token, kegiatan: row.nm_kegiatan }}
                        />
                        <Button.Icon
                          as="a"
                          href={`${prefix + menu.url}/detail-list/${row.id}`}
                          variant="primary"
                          icon={
                            <Icon
                              icon="bxs:message-square-edit"
                              width={15}
                              height={15}
                            />
                          }
                        />
                        <Button.Icon
                          variant="danger"
                          icon={
                            <Icon
                              icon="solar:trash-bin-2-bold-duotone"
                              width={15}
                              height={15}
                            />
                          }
                          onClick={() =>
                            destroy(row.id).then(() => refreshAbsensi())
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
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
      </div>
    </Layout>
  );
}
