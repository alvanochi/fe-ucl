import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import IpModule from "../../../modules/pelaksanaan-pendidikan/ip/index";
import AkademikModule from "../../../modules/pelaksanaan-pendidikan/akademik";
import KpModule from "../../../modules/pelaksanaan-pendidikan/kp";
import SkripsiModule from "../../../modules/pelaksanaan-pendidikan/skripsi";
import PerkuliahanModule from "../../../modules/pelaksanaan-pendidikan/perkuliahan";

export default function PelaksanaanPendidikan() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, active, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} items={menu.submenus} active={active.url} handler={setActive} />
			<div className="my-8">
				{active.url === "#ip" && <IpModule baseURL={prefix + menu.url} />}
				{active.url === "#perkuliahan" && <PerkuliahanModule baseURL={prefix + menu.url} />}
				{active.url === "#akademik" && <AkademikModule baseURL={prefix + menu.url} />}
				{active.url === "#kp" && <KpModule baseURL={prefix + menu.url} />}
				{active.url === "#skripsi" && <SkripsiModule baseURL={prefix + menu.url} />}
			</div>
		</Layout>
	);
}
