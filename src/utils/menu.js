import { APP_MENU } from "../config/menu";

export default {
	getAppMenu() {
		return APP_MENU;
	},
	getAppMenuByRole(role, prefix = "") {
		return APP_MENU.filter((menu) => menu.allowedRoles.includes(role)).map((menu) => {
			if (menu.submenus.length < 1) return { ...menu, url: `${prefix}${menu.url}` };
			return {
				...menu,
				url: `${prefix}${menu.url}`,
				submenus: menu.submenus.filter((submenu) => submenu.allowedRoles.includes(role)),
			};
		});
	},
	getAppMenuByUrl(url, role, prefix = "") {
		const findMenuByUrl = this.getAppMenuByRole(role)
			.flatMap((menu) => [menu, ...menu.submenus])
			.find((menu) => menu.url === url);

		return findMenuByUrl ?? null;
	},
};
