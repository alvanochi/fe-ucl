import { createElement } from "react";
import classNames from "classnames";
import Link from "next/link";

const btnTheme = {
  primary:
    "bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 focus:ring-primary-600 text-white",
  "outline-primary":
    "border-2 border-primary-600 text-primary bg-white focus:ring-primary-600",
  secondary:
    "bg-secondary-600 hover:bg-secondary-700 focus:bg-secondary-700 focus:ring-secondary-600 text-white",
  success:
    "bg-success-600 hover:bg-success-700 focus:bg-success-700 focus:ring-success-600 text-white",
  info: "bg-info-600 hover:bg-info-700 focus:bg-info-700 focus:ring-info-600 text-white",
  danger:
    "bg-danger-600 hover:bg-danger-500 focus:bg-danger-500 focus:ring-danger-500 text-white",
  transparent: "bg-transparent focus:ring-gray-50 text-gray-900",
  "label-primary":
    "bg-primary-100 hover:bg-primary-300 focus:bg-primary-300 focus:ring-primary-300 text-primary-900",
  "label-secondary":
    "bg-secondary-100 hover:bg-secondary-300 focus:bg-secondary-300 focus:ring-secondary-300 text-secondary-900",
  "label-success":
    "bg-success-100 hover:bg-success-300 focus:bg-success-300 focus:ring-success-300 text-success-900",
  "label-info":
    "bg-info-100 hover:bg-info-300 focus:bg-info-300 focus:ring-info-300 text-white",
  "label-danger":
    "bg-danger-600 hover:bg-danger-500 focus:bg-danger-500 focus:ring-danger-500 text-white",
  default:
    "bg-white hover:bg-gray-50 focus:bg-gray-50 focus:ring-gray-50 text-gray-900",
};

const iconTheme = {
  primary: "text-primary-600",
  secondary: "text-secondary-600",
  info: "text-info-600",
  success: "text-success-600",
  danger: "text-danger-600",
  transparent: "text-gray-900",
  default: "text-gray-900",
};

export const Button = ({
  variant,
  pill = false,
  icon,
  className,
  children,
  iconPosition = "left",
  as = "button",
  href = "#",
  ...props
}) => {
  if (as === "a") {
    const elProps = {
      href: href,
      className: classNames(
        "flex items-center pr-4 text-sm font-medium focus:outline-none focus:ring focus:ring-offset-2",
        btnTheme[variant] ?? btnTheme["default"],
        {
          "py-1": icon,
          "py-2 px-4": !icon,
          "pl-1 pr-4": icon && iconPosition == "left",
          "pr-1 pl-4": icon && iconPosition == "right",
          "rounded-full": pill,
          "rounded-xl": !pill,
          shadow: variant != "transparent",
        },
        className
      ),
    };

    return (
      <Link {...elProps}>
        {icon && iconPosition == "left" && (
          <span
            className={classNames(
              "flex items-center mr-2 p-1.5 bg-white",
              iconTheme[variant] ?? iconTheme["primary"],
              {
                "rounded-full": pill,
                "rounded-lg": !pill,
              }
            )}
          >
            {icon}
          </span>
        )}
        <p className="grow text-center">{children}</p>
        {icon && iconPosition == "right" && (
          <span
            className={classNames(
              "flex items-center ml-2 p-1.5 bg-white",
              iconTheme[variant] ?? iconTheme["primary"],
              {
                "rounded-full": pill,
                "rounded-lg": !pill,
              }
            )}
          >
            {icon}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      className={classNames(
        "flex items-center text-sm font-medium focus:outline-none focus:ring focus:ring-offset-2",
        btnTheme[variant] ?? btnTheme["default"],
        {
          "py-1": icon,
          "py-2 px-4": !icon,
          "pl-1 pr-4": icon && iconPosition == "left",
          "pr-1 pl-4": icon && iconPosition == "right",
          "rounded-full": pill,
          "rounded-xl": !pill,
          shadow: variant != "transparent",
        },
        className
      )}
      {...props}
    >
      {icon && iconPosition == "left" && (
        <span
          className={classNames(
            "flex items-center mr-2 p-1.5 bg-white",
            iconTheme[variant] ?? iconTheme["primary"],
            {
              "rounded-full": pill,
              "rounded-lg": !pill,
            }
          )}
        >
          {icon}
        </span>
      )}
      <p className="grow text-center">{children}</p>
      {icon && iconPosition == "right" && (
        <span
          className={classNames(
            "flex items-center ml-2 p-1.5 bg-white",
            iconTheme[variant] ?? iconTheme["primary"],
            {
              "rounded-full": pill,
              "rounded-lg": !pill,
            }
          )}
        >
          {icon}
        </span>
      )}
    </button>
  );
};

Button.Icon = ({
  variant,
  pill = false,
  icon,
  className,
  as = "button",
  href = "#",
  ...props
}) => {
  if (as === "a") {
    const elProps = {
      href: href,
      className: classNames(
        "flex items-center justify-center p-1.5 text-sm font-medium focus:outline-none focus:ring focus:ring-offset-2",
        btnTheme[variant] ?? btnTheme["default"],
        {
          "rounded-full": pill,
          "rounded-lg": !pill,
          shadow: variant != "transparent",
        },
        className
      ),
    };

    return <Link {...elProps}>{icon}</Link>;
  }

  return (
    <button
      className={classNames(
        "flex items-center justify-center p-1.5 text-sm font-medium focus:outline-none focus:ring focus:ring-offset-2",
        btnTheme[variant] ?? btnTheme["default"],
        {
          "rounded-full": pill,
          "rounded-lg": !pill,
          shadow: variant != "transparent",
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

Button.Icon.displayName = "IconButton";

export default Button;
