import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import Button from "../../../components/Button";
import { Icon } from "@iconify-icon/react";
import { DevelopmentPage } from "../../../components/DevelopmentPage";



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
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl m-5">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img className="h-20 w-full object-cover md:w-20" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Event image" />
            </div>
            <div className="pl-8 pt-2 md:flex-grow">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">M Ajis Pratama</div>
              <p className="block mt-1 text-lg leading-tight font-medium text-black">201106040468</p>
            </div>
          </div>
          <div className="flex-shrink-0 pl-8 pt-2 md:pl-0 md:pt-0">
              <h3 className="md:text-right">3450</h3>
            </div>
        </div>
			</div> */}

      <DevelopmentPage />
			
		</Layout>
	);
}