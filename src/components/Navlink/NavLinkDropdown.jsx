import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Link from "next/link";

export const NavLinkDropdown = ({
  label,
  icon,
  active,
  url,
  submenus,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        onClick={handleDropdownToggle}
        style={{ direction: "ltr" }}
        className={classNames(
          "flex items-center w-full hover:bg-white hover:bg-opacity-10 hover:shadow-md justify-start rounded-r-full px-4 py-4 font-medium text-white backdrop-blur-0 hover:backdrop-blur-sm hover:text-base",
          {
            "bg-white bg-opacity-10 shadow-md backdrop-blur-sm text-base":
              active,
          },
          className
        )}
        {...props}
      >
        <div className="flex items-center text-left w-11/12">
          <Icon icon={icon} width={24} height={24} className="shrink-0 mr-6" />
          {label}
        </div>
      </div>
      <ul
        className={classNames("block z-20 top-full left-0", {
          hidden: !isOpen, // Hide submenu when isOpen is false
          visible: isOpen, // Show submenu when isOpen is true
        })}
        style={{
          transition: "height 0.3s", // Apply transition effect on height change
        }}
      >
        {submenus &&
          submenus.map((submenu, index) => (
            <li key={index}>
              <Link href={submenu.url} passHref>
                <div
                  className={classNames(
                    "text-sm hover:bg-white hover:bg-opacity-10 hover:shadow-md rounded-r-full px-4 py-4 font-medium text-white backdrop-blur-0 hover:backdrop-blur-sm hover:text-base",
                    {
                      "bg-white bg-opacity-10 shadow-md backdrop-blur-sm text-base":
                        active,
                    }
                  )}
                  style={{
                    marginRight: "200px",
                  }}
                >
                  {submenu.label}
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NavLinkDropdown;
