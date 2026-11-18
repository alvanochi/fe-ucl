import { Icon } from "@iconify-icon/react";

export default function SortIcon({ sort }) {
	return <Icon icon={sort ? (sort == "desc" ? "iconoir:sort-down" : "iconoir:sort-up") : "iconoir:sort"} width={20} height={20} />;
}
