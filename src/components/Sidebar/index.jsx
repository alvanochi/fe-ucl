import { useEffect } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import useMenu from "../../hooks/useMenu";
import useMediaQuery from "../../hooks/useMediaQuery";
import NavlinkExpand from "../Navlink/NavlinkExpand";
import NavbarShrink from "../Navlink/NavlinkShrink";
import useUser from "../../hooks/useUser";

export const Sidebar = ({ expanded, toggle }) => {
	const router = useRouter();
	const { logout } = useUser();
	const { prefix, menu: mn, allowed } = useMenu();
	const isMobile = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		isMobile === true && toggle(false);
	}, [router, isMobile]);

	return (
		<div
			className={classNames("flex flex-col shrink-0 transition-[width] h-screen max-h-full overflow-x-auto", {
				"fixed z-50 md:relative w-96": expanded,
				"relative w-24": !expanded,
			})}
		>
			<div
				className={classNames("relative z-10 flex justify-center h-14 shrink-0", {
					"w-10/12": expanded,
					"w-7/12": !expanded,
				})}
			>
				{expanded && (
					<div className="flex items-center px-4 grow">
						<img src="/img/app_logo.png" alt="app logo" className={classNames({ hidden: !expanded })} />
					</div>
				)}
				<div className="flex shrink items-center justify-center">
					<button className="flex items-center justify-center px-4 py-4" onClick={toggle}>
						<img
							src="/icon/icon_maximize.svg"
							alt="sidebar control icon"
							className={classNames("h-6 w-6 transition-transform duration-100", {
								"rotate-180": expanded,
								"rotate-0": !expanded,
							})}
						/>
					</button>
				</div>
			</div>
			<div className="relative z-10 flex flex-col grow overflow-x-hidden overflow-y-auto py-6 text-base" style={{ direction: "rtl" }}>
				{expanded && (
					<>
						{allowed?.map((menu, index) => (
							<NavlinkExpand
								key={`expand-menu-${index}`}
								label={menu.label}
								icon={menu.icon}
								url={menu.url}
								active={prefix + mn.url == menu.url}
							/>
						))}
						<NavlinkExpand label="Logout" icon="material-symbols:logout" className="mt-auto" url="#!" onClick={logout} />
					</>
				)}
				{!expanded && (
					<>
						{allowed.map((menu, index) => (
							<NavbarShrink
								key={`shrink-menu-${index}`}
								label={menu.label}
								icon={menu.icon}
								url={menu.url}
								active={prefix + mn.url == menu.url}
							/>
						))}
						<NavbarShrink icon="material-symbols:logout" className="mt-auto" url="#!" onClick={logout} />
					</>
				)}
			</div>
			<div
				className={classNames("absolute inset-0 z-0 bg-motion bg-cover bg-center rounded-br-3xl", {
					"w-10/12": expanded,
					"w-7/12": !expanded,
				})}
			></div>
		</div>
	);
};

export default Sidebar;
