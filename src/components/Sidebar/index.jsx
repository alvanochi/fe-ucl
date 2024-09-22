import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import useMenu from "../../hooks/useMenu";
import useMediaQuery from "../../hooks/useMediaQuery";
import NavlinkExpand from "../Navlink/NavlinkExpand";
import NavbarShrink from "../Navlink/NavlinkShrink";
import NavLinkDropdown from "../Navlink/NavLinkDropdown";
import NavLinkShrinkDropdown from "../Navlink/NavLinkShrinkDropdown";
import useUser from "../../hooks/useUser";

export const Sidebar = ({ expanded, toggle }) => {
  const router = useRouter();
  const { logout } = useUser();
  const { prefix, menu: mn, allowed } = useMenu();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    isMobile === true && toggle(false);
  }, [router, isMobile]);

  return (
    <div
      className={classNames(
        "flex flex-col shrink-0 transition-[width] h-screen max-h-full overflow-x-auto",
        {
          "fixed z-50 md:relative w-96": expanded, // For larger screens, set width to 96
          "relative w-16 md:w-24": !expanded, // Shrink width on mobile (16) and larger screens (24)
        }
      )}
    >
      <div
        className={classNames(
          "relative z-10 flex justify-center h-14 shrink-0",
          {
            "w-10/12": expanded, // Expanded state width
            "w-6/12 md:w-7/12": !expanded, // Adjust shrink width for mobile (6/12) and larger screens (7/12)
          }
        )}
      >
        {expanded && (
          <div className="flex items-center px-4 grow">
            <img
              src="/img/app_logo.png"
              alt="app logo"
              className={classNames({ hidden: !expanded })}
            />
          </div>
        )}
        <div className="flex shrink-0 items-center justify-center">
          <button
            className="flex items-center justify-center px-4 py-4 sm:px-2 sm:py-2"
            onClick={toggle}
          >
            <img
              src="/icon/icon_maximize.svg"
              alt="sidebar control icon"
              className={classNames(
                "h-6 w-6 transition-transform duration-100",
                {
                  "rotate-180": expanded,
                  "rotate-0": !expanded,
                }
              )}
            />
          </button>
        </div>
      </div>
      <div
        className="relative z-10 flex flex-col grow overflow-x-hidden overflow-y-auto py-6 text-base"
        style={{ direction: "rtl" }}
      >
        {expanded && (
          <>
            {allowed?.map((menu, index) => {
              if (menu.type === "menu-group") {
                return (
                  <NavLinkDropdown
                    key={`expand-menu-${index}`}
                    label={menu.label}
                    icon={menu.icon}
                    submenus={menu.children}
                    active={prefix + mn.url == menu.url}
                    isOpen={openDropdown === index}
                    onToggle={() => handleDropdownToggle(index)}
                  />
                );
              }
              return (
                <NavlinkExpand
                  key={`expand-menu-${index}`}
                  label={menu.label}
                  icon={menu.icon}
                  url={menu.url}
                  active={prefix + mn.url == menu.url}
                />
              );
            })}
            <NavlinkExpand
              label="Logout"
              icon="material-symbols:logout"
              className="mt-auto"
              url="#!"
              onClick={logout}
            />
          </>
        )}
        {!expanded && (
          <>
            {allowed.map((menu, index) => {
              if (menu.type === "menu-group") {
                return (
                  <NavLinkShrinkDropdown
                    key={`shrink-menu-${index}`}
                    label={menu.label}
                    icon={menu.icon}
                    submenus={menu.children}
                    active={prefix + mn.url == menu.url}
                    isOpen={openDropdown === index}
                    onToggle={() => handleDropdownToggle(index)}
                    toggle={toggle}
                  />
                );
              }
              return (
                <NavbarShrink
                  key={`shrink-menu-${index}`}
                  label={menu.label}
                  icon={menu.icon}
                  url={menu.url}
                  active={prefix + mn.url == menu.url}
                />
              );
            })}
            <NavbarShrink
              icon="material-symbols:logout"
              className="mt-auto"
              url="#!"
              onClick={logout}
            />
          </>
        )}
      </div>
      <div
        className={classNames(
          "absolute inset-0 z-0 bg-motion bg-cover bg-center rounded-br-3xl",
          {
            "w-10/12": expanded,
            "w-6/12 md:w-7/12": !expanded, // Adjust background width for mobile (6/12) and larger screens (7/12)
          }
        )}
      ></div>
    </div>
  );
};

export default Sidebar;
