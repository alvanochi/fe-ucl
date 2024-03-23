import { Icon } from "@iconify-icon/react";
import Button from "../../../../components/Button";
import useDatatable from "../../../../hooks/useDatatable";
import useCRUD from "../../../../hooks/useCRUD";
import Form from "../../../../components/Form";
import { useState } from "react";
import useDataTableBk from "../../../../hooks/useDataTableBk";

export default function AkademikModule({ baseURL }) {
  const DATA_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik/get`;
  const DELETE_URL = `${process.env.API_ENDPOINT}/bimbingan-akademik`;

  const [searchValue, setSearchValue] = useState("");

  const {
    dataAbsensi,
    loadingAbsensi,
    pageAbsensi,
    pageCountAbsensi,
    setPageAbsensi,
    refreshAbsensi,
    canPrevAbsensi,
    canNextAbsensi,
  } = useDataTableBk(DATA_URL, {}, searchValue);
  const { destroy } = useCRUD(DELETE_URL);

  return (
    <>
      <div className="flex mb-8 justify-end items-center">
        <div className="mr-4">
          <Button
            as="a"
            href={`${baseURL}/akademik/create`}
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
                    {row.tahun_angkatan}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    {row.nama_lengkap}
                  </td>
                  <td className="text-sm border-2 border-white bg-gray-50">
                    <div className="flex items-stretch gap-1">
                      <Button.Icon
                        as="a"
                        href={`${baseURL}/akademik/detail/${row.id}`}
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
                        href={`${baseURL}/akademik/edit/${row.id}`}
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
                        onClick={() => destroy(row.id).then(() => refresh())}
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
            disabled={!canPrevAbsensi || pageAbsensi === 1} // Tambahkan kondisi page === 1
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
            disabled={!canNextAbsensi || pageAbsensi === pageCountAbsensi} // Tambahkan kondisi page === pageCount
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
            max={pageCountAbsensi}
            className="w-20"
            value={pageAbsensi}
            onChange={(event) =>
              event.target.valueAsNumber <= pageCountAbsensi &&
              setPageAbsensi(event.target.value)
            }
          />
          of {pageCountAbsensi || 1}
        </div>
      </div>
    </>
  );
}
