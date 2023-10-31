import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import PengabdianModule from "../../../modules/pelaksanaan-pengabdian/pengabdian";
import PembicaraModule from "../../../modules/pelaksanaan-pengabdian/pembicara";

export default function PelaksanaanPengabdian() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, active, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} items={menu.submenus} active={active.url} handler={setActive} />
			<div className="my-8">
				{active.url === "#pengabdian" && <PengabdianModule baseURL={prefix + menu.url} />}
				{active.url === "#pembicara" && <PembicaraModule baseURL={prefix + menu.url} />}
			</div>
		</Layout>
	);
}
