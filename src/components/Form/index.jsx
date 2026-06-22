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
    className={classnames("block text-sm font-bold text-gray-900", className)}
    {...props}
  >
    {children}
  </label>
);

Form.LabelFront = ({ children, className, ...props }) => (
  <label
    className={classnames("block text-sm text-primary-700", className)}
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

Form.Select = ({
  options,
  className,
  emptyStateLabel = "-- Pilih --",
  ...props
} = {}) => (
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

Form.Combobox = ({ name, ...props }) => <Combobox name={name} {...props} />;

const Combobox = ({
  className,
  value,
  required,
  options,
  menuTarget,
  styles = {},
  onSearch,
  ...props
} = {}) => {
  const config = resolveConfig(twConfig);
  const { theme: { colors } } = config;

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // value bisa berupa string UUID atau object {label, value} — handle keduanya
    if (!value) {
      setSelected(null);
      return;
    }

    // Kalau value sudah berupa object react-select {label, value}, langsung pakai
    if (typeof value === "object" && value.label && value.value) {
      setSelected(value);
      return;
    }

    // Kalau value berupa string UUID, cari di options
    if (!options || !Array.isArray(options)) return;
    const find = options.find((item) => item.value === value);
    // Hanya update jika ketemu — jangan reset selected yang sudah tampil
    if (find) setSelected(find);
  }, [options, value]);

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: selectedOption ? selectedOption.value : null,
        },
      });
    }
  };

  return (
    <div className="relative w-full max-w-full">
      <Select
        className={className}
        styles={styles}
        value={selected}
        options={options || []}
        onChange={handleChange}
        onInputChange={(newValue, actionMeta) => {
          if (onSearch && actionMeta.action === "input-change") {
            onSearch(newValue);
          }
        }}
        menuPortalTarget={menuTarget || ""}
        {...props}
      />
      {/* Hidden input untuk browser required validation
          invisible total agar tidak muncul ke layar */}
      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          onChange={() => {}}
          value={selected ? selected.value : ""}
          required
          style={{
            opacity: 0,
            width: 0,
            height: 0,
            position: "absolute",
            pointerEvents: "none",
            border: "none",
            padding: 0,
            margin: 0,
          }}
        />
      )}
    </div>
  );
};

Form.Checkbox = ({ className, ...props }) => (
  <input
    type="checkbox"
    className={classnames("form-checkbox", className)}
    {...props}
  />
);

Form.Radio = ({ className, ...props }) => (
  <input
    type="radio"
    className={classnames("form-radio", className)}
    {...props}
  />
);

Form.Textarea = ({ className, ...props }) => (
  <textarea className={classnames("form-input", className)} {...props} />
);

Form.Group.displayName = "FormGroup";
Form.Label.displayName = "FormLabel";
Form.LabelFront.displayName = "FormLabelFront";
Form.Input.displayName = "FormInput";
Form.Select.displayName = "FormSelect";
Form.Combobox.displayName = "FormCombobox";
Form.Checkbox.displayName = "FormCheckbox";
Form.Radio.displayName = "FormRadio";
Form.Textarea.displayName = "FormTextarea";

export default Form;