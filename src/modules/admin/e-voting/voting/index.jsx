import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import Filter from "./filter";
import useDatatableAbsensi from "../../../../hooks/useDataTableAbsensi";
import date from "../../../../utils/date";
import Form from "../../../../components/Form";
import useCRUD from "../../../../hooks/useCRUD";

export default function VotingModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/voting/question-all`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/voting/question`;
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
  } = useDatatableAbsensi(DATA_URL);

  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-8">
        <Button
          as="a"
          href={`${baseURL}/create`}
          variant="primary"
          icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
          pill
        >
          Create Vote
        </Button>
        <Filter />
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
                deskripsi
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                status
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Tanggal Dibuat
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200"></th>
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
                  {`${row.deskripsi.split(" ").slice(0, 5).join(" ")}${
                    row.deskripsi.split(" ").length > 5 ? "..." : ""
                  }`}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50">
                  {row.status_pertanyaan === 1 ? (
                    <h5 className="text-green-500 font-bold">ACTIVE</h5>
                  ) : (
                    <h5 className="text-red-500 font-bold">NON ACTIVE</h5>
                  )}
                </td>
                <td className="text-sm border-2 border-white bg-gray-50 ">
                  {date.formatToID(new Date(row.created_at))}
                </td>

                <td className="text-sm border-2 border-white bg-gray-50">
                  <div className="flex items-stretch gap-1">
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/detail-question/${row.id}`}
                      variant="info"
                      icon={
                        <Icon
                          icon="fluent:info-24-filled"
                          width={20}
                          height={20}
                        />
                      }
                    />
                    <Button.Icon
                      as="a"
                      href={`${baseURL}/edit-question/${row.id}`}
                      variant="secondary"
                      icon={<Icon icon="bx:edit" width={20} height={20} />}
                    />
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
