import { useEffect, useState } from "react";
import useUser from "./useUser";
import utils from "../utils/menu";
import Router from "next/router";

export const useMenu = () => {
  const { user } = useUser();

  const [allowed, setAllowed] = useState([]);
  const [menu, setMenu] = useState(null);
  const [active, setActive] = useState(null);
  const [prefix, setPrefix] = useState(null);

  useEffect(() => {
    if (user == null) return;

    const fixedUrl =
      [
        "/admin",
        "/dosen",
        "/mahasiswa",
        "/demo",
        "/dosen_ext",
        "/pegawai",
      ].includes(Router.pathname) === false
        ? `/${Router.pathname.split(`/`).at(2)}`
        : "/";
    let menuPrefix;

    switch (user.role) {
      case "Dosen":
        menuPrefix = "/dosen";
        break;
      case "Mahasiswa":
        menuPrefix = "/mahasiswa";
        break;
      case "Admin":
        menuPrefix = "/admin";
        break;
      case "Demo":
        menuPrefix = "/demo";
        break;
      case "Dosen_Ext":
        menuPrefix = "/dosen_ext";
        break;
      case "Pegawai":
        menuPrefix = "/pegawai";
        break;
    }

    const findMenu = utils.getAppMenuByUrl(fixedUrl, user.role);
    setMenu(() => findMenu);
    const menuByRole = utils.getAppMenuByRole(user.role, menuPrefix);

    const groupedMenu = menuByRole.reduce((groups, item) => {
      const group = item.group || "Other";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});

    const sortedGroups = Object.keys(groupedMenu)
      .sort((a, b) => {
        if (a === "Other") return 1;
        if (b === "Other") return -1;
        return 0;
      })
      .reduce((acc, key) => {
        acc[key] = groupedMenu[key];
        return acc;
      }, {});

    setAllowed(() => sortedGroups);
    setPrefix(menuPrefix);
    setActive(() => findMenu?.submenus?.at(0));
  }, [user, Router]);

  return { menu, allowed, active, prefix, setActive };
};

export default useMenu;
