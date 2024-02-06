import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import _ from "underscore";
import RekapAbsensi from "../../../modules/admin/absen/rekap-absensi";


export default function Absen() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, active,  setActive } = useMenu();

	if ([user,  menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} items={menu.submenus} active={active.url} handler={setActive} />
			<div className="my-8">
				{active.url === "#rekap-absensi" && <RekapAbsensi baseURL={prefix + menu.url} user={user} />}
			</div>
			
		</Layout>
	);
}