import Head from "next/head";
import { useState } from "react";
import { Footer } from "../../components/LandingPage/Footer";
import Button from "../../components/Button";
import Form from "../../components/Form";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import useNewDataTable from "../../hooks/useNewDataTable";
import date from "../../utils/date";
import HeaderOnPage from "../../components/LandingPage/HeaderOnPage";
import { Breadcrumb } from "../../components/LandingPage/Breadcrumb";
import useDosen from "../../repo/dosen";
import useMahasiswa from "../../repo/mahasiswa";
import ShowQr from "./show-qr";

const ValidasiDokumen = () => {
  const [searchValue, setSearchValue] = useState("");

  const DATA_URL = `${process.env.API_ENDPOINT}/validasi/validasi-dokumen`;

  const {
    dataNew,
    loadingNew,
    pageNew,
    pageCountNew,
    setPageNew,
    canPrevNew,
    canNextNew,
    refreshNew,
    sortByNew,
    getSortByNew,
  } = useNewDataTable(DATA_URL, {}, searchValue);

  return (
    <>
      <Head>
        <title>UCL</title>
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <HeaderOnPage />

        <main>
          <section id="validasi-dokumen" className="bg-color-primary-light">
            <div className="container py-20">
              <Breadcrumb title="Validasi Dokumen" />

              <div className=" relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <div className="flex mb-8 justify-end items-center">
                  <div>
                    <input
                      type="text"
                      id="base-input"
                      style={{ width: "300px" }}
                      className="bg-gray-500 border text-sm rounded-lg  block  p-2.5 border-gray-600 placeholder-gray-400 text-white-700 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search"
                      name="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right  text-gray-400 ">
                  <thead className="text-xs text-white uppercase bg-color-primary-dark">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Dosen
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nama Kegiatan
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Mahasiswa
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center ">Tanggal</div>
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingNew && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-sm border-2 bg-gray-800 border-gray-700 text-center"
                        >
                          Loading...
                        </td>
                      </tr>
                    )}
                    {!loadingNew && dataNew && dataNew.length < 1 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-sm border-2 bg-gray-800 border-gray-700 text-center"
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
                          <tr
                            className={`bg-gray-800 border-gray-700`}
                            key={`row-${index}`}
                          >
                            <td className="px-6 py-4">{rowNumber}</td>
                            <td className="px-6 py-4">{row.nama_dosen}</td>
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium  whitespace-nowrap"
                            >
                              <Link
                                href={`/validasi-dokumen/${row.id}`}
                                className="text-blue-500 hover:text-blue-300"
                              >
                                {`${row.nama_kegiatan
                                  .split(" ")
                                  .slice(0, 5)
                                  .join(" ")}${
                                  row.nama_kegiatan.split(" ").length > 5
                                    ? "..."
                                    : ""
                                }`}
                              </Link>
                            </th>
                            <td className="px-6 py-4">{row.nama_mhs}</td>
                            <td className="px-6 py-4">
                              {date.formatToID(new Date(row.created_at))}
                            </td>
                            <td className="px-6 py-4">
                              <ShowQr
                                data={{
                                  id: row.id,
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
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
                          className="text-color-blob"
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
                      className="w-20 text-color-white"
                      value={pageNew}
                      onChange={(event) =>
                        setPageNew(
                          Math.max(
                            1,
                            Math.min(
                              event.target.valueAsNumber,
                              pageCountNew || 1
                            )
                          )
                        )
                      }
                    />
                    of {pageCountNew || 1}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default ValidasiDokumen;
