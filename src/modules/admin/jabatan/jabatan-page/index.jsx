import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import useDatatableAbsensi from "../../../../hooks/useDataTableAbsensi";
import useCRUD from "../../../../hooks/useCRUD";
import Form from "../../../../components/Form";
import EditJabatan from "./editJabatan";
import CreateJabatan from "./createJabatan";

export default function JabatanModules({ baseURL }) {
  const API_URL = `${process.env.API_ENDPOINT}/jabatan`;

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
  } = useDatatableAbsensi(API_URL);

  const { destroy } = useCRUD(API_URL);

  const handleAction = () => {
    refreshAbsensi();
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8">
        <CreateJabatan onAction={handleAction} />
      </div>

      <table
        className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto"
        cellPadding={10}
      >
        <thead>
          <tr>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Nama Jabatan
              </div>
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
            dataAbsensi.map((row, index) => (
              <tr key={`row-${index}`}>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {index + 1}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {row.nama_jabatan}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <EditJabatan id={row.id} onAction={handleAction} />
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
                        destroy(row.id).then(() => refreshAbsensi())
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
    </>
  );
}
