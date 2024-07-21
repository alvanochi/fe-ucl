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
      ["/admin", "/dosen", "/mahasiswa", "/demo", "/dosen_ext"].includes(
        Router.pathname
      ) === false
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
      case "Dosen_Ext":
        menuPrefix = "/dosen_ext";
    }

    const findMenu = utils.getAppMenuByUrl(fixedUrl, user.role);
    setMenu(() => findMenu);
    setAllowed(() => utils.getAppMenuByRole(user.role, menuPrefix));

    setPrefix(menuPrefix);
    setActive(() => findMenu?.submenus.at(0));
  }, [user, Router]);

  return { menu, allowed, active, prefix, setActive };
};

export default useMenu;
