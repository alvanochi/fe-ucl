import classnames from "classnames";
import { useEffect, useState } from "react";
import Select from "react-select";

import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../../../tailwind.config.js";

export const Form = ({ children, className, ...props }) => (
  <form className={classnames(className)} {...props}>
    {children}
  </form>
);

Form.Group = ({ children, className, ...props }) => (
  <div className={classnames("relative", className)} {...props}>
    {children}
  </div>
);

Form.Label = ({ children, className, ...props }) => (
  <label
    className={classnames(
      "block text-sm font-bold text-gray-900",
      className
    )}
    {...props}
  >
    {children}
  </label>
);

Form.Input = ({ type, className, ...props }) => (
  <input
    type={type}
    className={classnames("form-input", className)}
    {...props}
  />
);

Form.Select = ({ options, className, emptyStateLabel = "-- Pilih --", ...props } = {}) => (
  <select className={classnames("form-select", className)} {...props}>
    <option value="">{emptyStateLabel}</option>
    {options &&
      options.map((option, index) => (
        <option
          key={`${props.name}-option-${index}`}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
  </select>
);

Form.Combobox = ({
  className,
  value,
  required,
  options,
  styles = {},
  ...props
} = {}) => {
  const config = resolveConfig(twConfig);

  const {
    theme: { colors },
  } = config;

  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!options || !Array.isArray(options) || !value) return;
    const find = options.find((item) => item.value == value) ?? null;

    setSelected(find);
  }, [options, value]);

  return (
    <div className="relative w-full max-w-full">
      <Select
        className={className}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, ...styles?.menuPortal }),
          control: (base, state) => ({
            ...base,
            borderWidth: "1px",
            borderColor: colors.gray[500],
            boxShadow: "none !important",
            padding: "0 0.5rem",
            fontSize: "0.875rem",
            "&:disabled": {
              backgroundColor: colors.primary[100],
            },
            "&:hover": {
              borderColor: colors.primary[500],
            },
            ...(state.isDisabled ? { backgroundColor: colors.neutral[100] } : {}),
            ...styles?.control,
            fontSize: "0.875rem",
          }),
          container: (base) => ({
            ...base,
            border: "none",
            ...styles?.container,
            fontSize: "0.875rem",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? colors.primary[100] : colors.white,
            color: colors.primary[900],
            "&:active": {
              backgroundColor: colors.primary[100],
            },
            ...styles?.option,
            fontSize: "0.875rem",
          }),
          valueContainer: (base) => ({
            ...base,
            ...styles?.valueContainer,
            fontSize: "0.875rem",
            padding: 0,
          }),
          singleValue: (base) => ({
            ...base,
            color: "black",
            fontSize: "0.875rem",
          }),
          // New style for the indicator separator
          indicatorsContainer: (base) => ({
            ...base,
            padding: "0.25rem",
            color: colors.gray[400],
          }),
        }}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        defaultValue={selected}
        options={options ?? []}
        placeholder=""
        isClearable
        {...props}
      />
      {required && (
        <input
          autoComplete="off"
          className="absolute inset-0 z-[-1]"
          style={{ border: "none" }}
          onChange={() => true}
          value={value || ""}
          required
        />
      )}
    </div>
  );
};

Form.Checkbox = ({ className, ...props }) => (
  <input type="checkbox" className={classnames("form-checkbox", className)} {...props} />
);
Form.Radio = ({ className, ...props }) => (
  <input type="radio" className={classnames("form-radio", className)} {...props} />
);

Form.Textarea = ({ className, ...props }) => (
  <textarea className={classnames("form-input", className)} {...props} />
);

Form.Group.displayName = "FormGroup";
Form.Label.displayName = "FormLabel";
Form.Input.displayName = "FormInput";
Form.Select.displayName = "FormSelect";
Form.Combobox.displayName = "FormCombobox";
Form.Checkbox.displayName = "FormCheckbox";
Form.Radio.displayName = "FormRadio";
Form.Textarea.displayName = "FormTextarea";

export default Form;
