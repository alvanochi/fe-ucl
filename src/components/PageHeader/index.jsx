import { Icon } from "@iconify-icon/react";
import Card from "../Card";
import classNames from "classnames";
import Head from "next/head";

export const PageHeader = ({ icon, title, items = [], active = 0, handler, leading = null }) => (
	<Card>
		<Head>
			<title>
				{title} - {process.env.APP_NAME}
			</title>
		</Head>
		<Card.Header className="flex items-center font-bold text-2xl">
			{leading && <div className="mr-4">{leading}</div>}
			<Icon icon={icon} className="mr-1" />
			{title}
		</Card.Header>
		{items.length > 0 && (
			<Card.Body className="flex gap-1">
				{items.map((item, index) => (
					<a
						key={`submenu-${index}`}
						href={item.url}
						className={classNames("flex-1 text-center", {
							"text-primary-600 font-bold": active == item.url,
							"font-medium": active != item.url,
						})}
						onClick={(event) => {
							event.preventDefault();
							handler(item);
						}}
					>
						{item.label}
					</a>
				))}
			</Card.Body>
		)}
	</Card>
);

export default PageHeader;
