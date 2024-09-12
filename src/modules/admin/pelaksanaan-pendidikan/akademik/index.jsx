import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import useDatatable from "../../../../hooks/useDatatable";
import useCRUD from "../../../../hooks/useCRUD";
import Form from "../../../../components/Form";
import { useState } from "react";
import useDataTableBk from "../../../../hooks/useDataTableBk";
import useNewDataTableNew from "../../../../hooks/useNewDataTableNew";

export default function AkademikModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik/for-admin`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik`;

  const [searchValue, setSearchValue] = useState("");

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTableNew(DATA_URL, {}, searchValue);

  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <Button
            onClick={() =>
              window.open(`${`${baseURL}/akademik/create`}`, "_blank")
            }
            variant="primary"
            icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
            pill
          >
            Tambah Bimbingan
          </Button>
        </div>
        <div className="flex-shrink">
          <Form.Input
            type="text"
            name="search"
            placeholder="Search Mahasiswa"
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
              <div className="flex items-center gap-2 cursor-pointer">No</div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Tahun Angkatan
              </div>
            </th>
            <th className="text-sm border-2 border-white bg-gray-200">
              <div className="flex items-center gap-2 cursor-pointer">
                Dosen
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
            dataNew.map((row, index) => {
              const startNumber = (pageNew - 1) * 10 + 1;

              const rowNumber = startNumber + index;
              return (
                <tr key={`row-${index}`}>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {rowNumber}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.tahun_angkatan}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.personal_data?.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        onClick={() =>
                          window.open(
                            `${baseURL}/akademik/detail/${row.id}`,
                            "_blank"
                          )
                        }
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
                        onClick={() =>
                          window.open(
                            `${baseURL}/akademik/edit/${row.id}`,
                            "_blank"
                          )
                        }
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
    </>
  );
}
