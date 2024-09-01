import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";

export const NavLinkShrinkDropdown = ({
  label,
  icon,
  active,
  url,
  submenus,
  className,
  toggle,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={classNames(
          "group flex items-center justify-center transition-transform -translate-x-5",
          { "translate-x-2": active, "hover:translate-x-2": !active },
          className
        )}
        style={{ direction: "ltr" }}
        href={url}
        {...props}
      >
        <button
          onClick={() => toggle(true)}
          className={classNames(
            "flex items-center justify-center px-4 py-4 z-10 text-white",
            {
              "z-[9999]": active,
            }
          )}
        >
          <Icon icon={icon} width={24} height={24} className="shrink-0" />
        </button>
        <div
          className={classNames("absolute transition-transform scale-0", {
            "scale-100": active,
            "group-hover:scale-100": !active,
          })}
        >
          <img
            src="/img/sidebar_shrink_bg.svg"
            alt="bg shrink"
            className="w-16 h-auto"
          />
        </div>
      </div>

      {/* <div className="relative">
        <div
          onClick={handleDropdownToggle}
          className={classNames(
            "flex items-center justify-between w-full px-4 py-4 font-medium text-white backdrop-blur-0 hover:backdrop-blur-sm hover:text-base",
            { "translate-x-2": active, "hover:translate-x-2": !active },
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            <Icon icon={icon} width={24} height={24} className="mr-6" />
          </div>
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
                        "scale-100": active,
                        "group-hover:scale-100": !active,
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
      </div> */}
    </>
  );
};

export default NavLinkShrinkDropdown;
