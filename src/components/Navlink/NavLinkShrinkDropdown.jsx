import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Link from "next/link";

export const NavLinkShrinkDropdown = ({
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
        className={classNames(
          "flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 hover:shadow-md px-4 py-4 font-medium text-white backdrop-blur-0 hover:backdrop-blur-sm hover:text-base",
          {
            "bg-white bg-opacity-10 shadow-md backdrop-blur-sm text-base":
              active,
          },
          className
        )}
        {...props}
      >
        <div className="flex items-center">
          <Icon icon={icon} width={24} height={24} className="mr-6" />
          {label}
        </div>
        <Icon
          icon="mdi:chevron-down"
          width={24}
          height={24}
          className={classNames("transition-transform", {
            "rotate-180": isOpen,
          })}
        />
      </div>
      {isOpen && submenus && (
        <ul className="absolute z-20 top-full left-0 bg-gray-800 shadow-md py-2 rounded-md">
          {submenus.map((submenu, index) => (
            <li key={index}>
              <Link href={submenu.url} passHref>
                <div
                  className={classNames(
                    "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700",
                    {
                      "bg-gray-700": active,
                    }
                  )}
                >
                  {submenu.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavLinkShrinkDropdown;
