import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import Button from "../../../components/Button";
import { Icon } from "@iconify-icon/react";
import { DevelopmentPage } from "../../../components/DevelopmentPage";
import styles from './rek-mhs.module.css';
import Form from "../../../components/Form";



export default function Absen() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	if ([user,  menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			{/* <PageHeader title="Rekomendasi Mahasiswa" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-8 mt-8">
            <Button
              as="a"
              href={`${prefix + menu.url}/generate`}
              variant="primary"
              icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
              pill
            >
              Filter
            </Button>
        </div>
        <div>
          <div className={`max-w-md mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5 relative ${styles.card}`}>
            <div className="md:flex relative">
              <div className="md:flex-shrink-0">
                <img className="h-20 w-full object-cover md:w-20" src="/img/azis.jpg" alt="Event image" />
              </div>
              <div className="pl-8 pt-2 pb-2 md:flex-grow relative">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">M Ajis Pratama</div>
                <p className="block mt-1 text-lg leading-tight font-medium text-black">201106040468</p>
                <h1 className="absolute text-right top-1/2 transform -translate-y-1/2 right-8 text-lg font-bold text-blue-900">Qualified | 3450</h1>
              </div>
            </div>
          </div>
          <div className={`max-w-md mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5 relative ${styles.card}`}>
            <div className="md:flex relative">
              <div className="md:flex-shrink-0">
                <img className="h-20 w-full object-cover md:w-20" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Event image" />
              </div>
              <div className="pl-8 pt-2 pb-2 md:flex-grow relative">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">M Ajis Pratama</div>
                <p className="block mt-1 text-lg leading-tight font-medium text-black">201106040468</p>
                <h1 className="absolute text-right top-1/2 transform -translate-y-1/2 right-8 text-lg font-bold text-blue-900">Qualified | 3450</h1>
              </div>
            </div>
          </div>
          <div className={`max-w-md mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5 relative ${styles.card}`}>
            <div className="md:flex relative">
              <div className="md:flex-shrink-0">
                <img className="h-20 w-full object-cover md:w-20" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Event image" />
              </div>
              <div className="pl-8 pt-2 pb-2 md:flex-grow relative">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">M Ajis Pratama</div>
                <p className="block mt-1 text-lg leading-tight font-medium text-black">201106040468</p>
                <h1 className="absolute text-right top-1/2 transform -translate-y-1/2 right-8 text-lg font-bold text-blue-900">Qualified | 3450</h1>
              </div>
            </div>
          </div>
          <div className={`max-w-md mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5 relative ${styles.card}`}>
            <div className="md:flex relative">
              <div className="md:flex-shrink-0">
                <img className="h-20 w-full object-cover md:w-20" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Event image" />
              </div>
              <div className="pl-8 pt-2 pb-2 md:flex-grow relative">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">M Ajis Pratama</div>
                <p className="block mt-1 text-lg leading-tight font-medium text-black">201106040468</p>
                <h1 className="absolute text-right top-1/2 transform -translate-y-1/2 right-8 text-lg font-bold text-blue-900">Qualified | 3450</h1>
              </div>
            </div>
          </div>
          
        </div>

        <div className="flex mt-8">
          <div className="flex gap-1 ml-auto">
            <Button.Icon
              type="button"
              variant="outline-primary"
              icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
              // onClick={() => setPageAbsensi(pageAbsensi - 1)}
              // disabled={pageAbsensi <= 1}
              pill
            />
            <Button
              type="button"
              variant="primary"
              icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
              iconPosition="right"
              // onClick={() => setPageAbsensi(pageAbsensi + 1)}
              // disabled={pageAbsensi >= pageCountAbsensi}
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
              // max={pageCountAbsensi || 1}
              max={1}
              className="w-20"
              value={1}
              // onChange={(event) =>
              //   setPageAbsensi(
              //     Math.max(1, Math.min(event.target.valueAsNumber, pageCountAbsensi || 1))
              //   )
              // }
            />
            of 1
          </div>
        </div>



			</div> */}

      <DevelopmentPage />

		</Layout>
	);
}