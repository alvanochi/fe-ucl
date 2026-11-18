import classnames from "classnames";
import useToggle from "../../hooks/useToggle";

export const Accordion = ({ children, title, className, show = false } = {}) => {
	const [expand, toggle] = useToggle(show);

	return (
		<div className="relative block w-full border rounded-xl">
			<div
				className={`${className} flex w-full cursor-pointer items-center justify-between bg-primary-600 px-4 py-2 text-white rounded-xl`}
				onClick={toggle}
			>
				<h5 className="block text-base font-bold">{title}</h5>
				<button type="button" className="cursor-pointer px-2 py-2" onClick={toggle}>
					{!expand && (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					)}
					{expand && (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
						</svg>
					)}
				</button>
			</div>
			<div
				className={classnames("block w-full overflow-x-hidden bg-white transition-max-height", {
					"max-h-0": !expand,
					"max-h-extra": expand,
				})}
			>
				<div className="px-2 py-2 md:px-4 md:py-4">{children}</div>
			</div>
		</div>
	);
};

export default Accordion;
