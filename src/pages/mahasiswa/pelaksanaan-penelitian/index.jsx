import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import PenelitianModule from "../../../modules/pelaksanaan-penelitian/penelitian";
import PublikasiKaryaModule from "../../../modules/pelaksanaan-penelitian/publikasi-karya";
import HKIModule from "../../../modules/pelaksanaan-penelitian/hki";

export default function PelaksanaanPenelitian() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, active, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} items={menu.submenus} active={active.url} handler={setActive} />
			<div className="my-8">
				{active.url === "#penelitian" && <PenelitianModule baseURL={prefix + menu.url} />}
				{active.url === "#publikasi-karya" && <PublikasiKaryaModule baseURL={prefix + menu.url} />}
				{active.url === "#hki" && <HKIModule baseURL={prefix + menu.url} />}
			</div>
		</Layout>
	);
}
