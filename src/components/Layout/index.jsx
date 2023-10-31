import useToggle from "../../hooks/useToggle";
import Sidebar from "../Sidebar";

export const Layout = ({ children }) => {
	const [expanded, toggleExpanded] = useToggle(true);

	return (
		<>
			<div className="flex h-screen max-h-screen max-w-full flex-1 grow overflow-hidden">
				<Sidebar {...{ expanded, toggle: toggleExpanded }} />
				<div className="block max-w-full grow overflow-y-auto overflow-x-hidden py-4 pl-2 md:pr-16 pr-6">{children}</div>
			</div>
			{expanded && (
				<div onClick={() => toggleExpanded(false)} className="block md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"></div>
			)}
		</>
	);
};

export default Layout;
