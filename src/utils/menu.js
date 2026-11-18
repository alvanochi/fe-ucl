import { APP_MENU } from "../config/MenuUpdate";

export default {
  getAppMenu() {
    return APP_MENU;
  },

  getAppMenuByRole(role, prefix = "") {
    return APP_MENU.map((menu) => {
      if (menu.type === "menu-group") {
        const filteredChildren = menu.children
          .map((child) => {
            const filteredSubmenus = child.submenus?.filter(
              (submenu) =>
                Array.isArray(submenu.allowedRoles) &&
                submenu.allowedRoles.includes(role)
            );

            return {
              ...child,
              url: prefix + child.url,
              submenus: filteredSubmenus || [],
            };
          })
          .filter((child) => {
            return (
              Array.isArray(child.allowedRoles) &&
              child.allowedRoles.includes(role)
            );
          });

        return {
          ...menu,
          children: filteredChildren,
        };
      }

      const filteredSubmenus = menu.submenus?.filter(
        (submenu) =>
          Array.isArray(submenu.allowedRoles) &&
          submenu.allowedRoles.includes(role)
      );

      return {
        ...menu,
        url: prefix + menu.url,
        submenus: filteredSubmenus || [],
      };
    }).filter((menu) => {
      if (menu.type === "menu-group") {
        return menu.children.length > 0;
      }
      return (
        Array.isArray(menu.allowedRoles) && menu.allowedRoles.includes(role)
      );
    });
  },

  getAppMenuByUrl(url, role, prefix = "") {
    const findMenuByUrl = this.getAppMenuByRole(role, prefix)
      .flatMap((menu) => {
        if (menu.type === "menu-group") {
          return [
            menu,
            ...menu.children.flatMap((child) => {
              return [
                child,
                ...child.submenus.map((submenu) => ({
                  ...submenu,
                  parent: child,
                })),
                ...child.submenus.flatMap((submenu) =>
                  Array.isArray(submenu.submenus) && submenu.submenus.length > 0
                    ? [submenu, ...submenu.submenus]
                    : [submenu]
                ),
              ];
            }),
          ];
        }
        return Array.isArray(menu.submenus) && menu.submenus.length > 0
          ? [menu, ...menu.submenus]
          : [menu];
      })
      .find((menu) => menu.url === url);

    return findMenuByUrl ?? null;
  },
};
