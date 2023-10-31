import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Link from "next/link";

export const NavbarShrink = ({
  label,
  icon,
  active,
  url,
  className,
  ...props
}) => {
  return (
    <Link
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
    </Link>
  );
};

export default NavbarShrink;
