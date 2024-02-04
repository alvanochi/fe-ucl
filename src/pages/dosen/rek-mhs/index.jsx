import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import Button from "../../../components/Button";
import { Icon } from "@iconify-icon/react";
import { DevelopmentPage } from "../../../components/DevelopmentPage";
import styles from './rek-mhs.module.css';
import Form from "../../../components/Form";
import useDatatable from "../../../hooks/useDatatable";
import Link from "next/link";
import Filter from "./filter";

export default function Absen() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

  const DATA_URL = `${process.env.API_ENDPOINT}/users/papan-peringkat`;

  const {
    data,
    loading,
    page,
    pageCount,
    filter,
    setPage,
    setFilter,
    canPrev,
    canNext,
    refresh,
    sortBy,
    getSortBy,
  } = useDatatable(DATA_URL);

	if ([user,  menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title="Rekomendasi Mahasiswa" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
          <Filter filter={filter} handler={setFilter} />
        </div>
        <div>
        {loading && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                <b>Loading...</b>
              </td>
            </tr>
          )}
          {!loading && data && data.length < 1 && (
            <tr>
              <td
                colSpan="6"
                className="text-sm border-2 border-white bg-gray-50 text-center"
              >
                <b>Tidak ada data</b>
              </td>
            </tr>
          )}
          {!loading &&
            data &&
            data.map((row, index) => (
              <Link href={`${prefix + menu.url}/detail-mhs/${row.user_id}`}>
              <div key={`row-${index}`} className={`max-w-md mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5 relative ${styles.card}`}>
                <div className="md:flex relative">
                  <div className="md:flex-shrink-0">
                    <img className="h-20 w-full object-cover md:w-20" src={process.env.API_ENDPOINT + "/foto-profile/" + row.image} alt="Event image" />
                  </div>
                  <div className="pl-8 pt-2 pb-2 md:flex-grow relative">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{row.nama_lengkap}</div>
                    <p className="block mt-1 text-lg leading-tight font-medium text-black">{row.npm}</p>
                    <h1 className="absolute text-right top-1/2 transform -translate-y-1/2 right-8 text-lg font-bold text-blue-900">{row.rank} | {row.total_point}</h1>
                  </div>
                </div>
              </div>
              </Link>
            ))}
        </div>

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
            onClick={() => setPage(page - 1)}
            disabled={!canPrev}
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
            onClick={() => setPage(page + 1)}
            disabled={!canNext}
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
            max={pageCount}
            className="w-20"
            value={page}
            onChange={(event) =>
              event.target.valueAsNumber <= pageCount &&
              setPage(event.target.value)
            }
          />
          of {pageCount || 1}
        </div>
      </div>



			</div>

		</Layout>
	);
}