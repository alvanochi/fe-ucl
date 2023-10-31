import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useUser from "../../../hooks/useUser";
import SertifikasiModule from "../../../modules/kompetensi/sertifikasi";
import TesModule from "../../../modules/kompetensi/tes";

export default function Kopentensi() {
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, active, setActive } = useMenu();

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title={menu.label} icon={menu.icon} items={menu.submenus} active={active.url} handler={setActive} />
			<div className="my-8">
				{active.url === "#sertifikasi" && <SertifikasiModule baseURL={prefix + menu.url} />}
				{active.url === "#test" && <TesModule baseURL={prefix + menu.url} />}
			</div>
		</Layout>
	);
}
