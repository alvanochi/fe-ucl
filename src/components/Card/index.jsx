import classNames from "classnames";

export const Card = ({ className, children }) => {
	return <div className={classNames("relative rounded-2xl shadow-md overflow-hidden", className)}>{children}</div>;
};

Card.Header = ({ className, children }) => {
	return <div className={classNames("bg-gray-200 px-4 py-4 font-bold", className)}>{children}</div>;
};

Card.Body = ({ className, children }) => {
	return <div className={classNames("bg-white px-4 py-4", className)}>{children}</div>;
};

Card.Header.displayName = "Card Header";
Card.Body.displayName = "Card Body";

export default Card;
