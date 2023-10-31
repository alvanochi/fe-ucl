import { Icon } from "@iconify-icon/react";
import classNames from "classnames";
import Link from "next/link";

export const NavlinkExpand = ({
  label,
  icon,
  active,
  url,
  className,
  ...props
}) => {
  return (
    <Link
      href={url}
      style={{ direction: "ltr" }}
      className={classNames(
        "flex shrink-0 w-full items-center hover:bg-white hover:bg-opacity-10 hover:shadow-md justify-start rounded-r-full px-4 py-4 font-medium text-white backdrop-blur-0 hover:backdrop-blur-sm",
        {
          "bg-white bg-opacity-10 shadow-md backdrop-blur-sm": active,
        },
        className
      )}
      {...props}
    >
      <div className="flex items-center text-left w-11/12">
        <Icon icon={icon} width={24} height={24} className="shrink-0 mr-6" />
        {label}
      </div>
    </Link>
  );
};

export default NavlinkExpand;
