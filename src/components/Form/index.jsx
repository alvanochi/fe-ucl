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
  menuPortalTarget,
  menuPosition = "fixed",
  menuPlacement = "auto",
  maxMenuHeight = 380,
  styles = {},
  onSearch,
  ...props
} = {}) => {
  const config = resolveConfig(twConfig);
  const { theme: { colors } } = config;

  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // Kasih objek option {label,value} (atau null) apa adanya — bukan event
      // sintetis {target:{value}}. Hampir semua pemakai Form.Combobox di seluruh
      // app menulis `onChange={selected => ... selected.value}`, jadi versi
      // sintetis (dari 79149f5, Mar 2024) selama ini selalu ngasih undefined ke
      // mereka; pilihan "nempel" secara visual (state internal di atas sudah
      // benar) tapi nilai yang sampai ke form pemanggil salah/kosong.
      props.onChange(selectedOption);
    }
  };

  const defaultStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(224, 242, 241, 0.25)",
      borderColor: state.isFocused
        ? colors?.primary?.[500] || "#126e63"
        : colors?.primary?.[400] || "#4db6ac",
      borderRadius: "0.5rem",
      minHeight: "42px",
      boxShadow: state.isFocused
        ? `0 0 0 1px ${colors?.primary?.[500] || "#126e63"}`
        : "none",
      "&:hover": {
        borderColor: colors?.primary?.[500] || "#126e63",
      },
      ...(styles.control ? styles.control(base, state) : {}),
    }),
    placeholder: (base, state) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "0.875rem",
      ...(styles.placeholder ? styles.placeholder(base, state) : {}),
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "#111827",
      fontSize: "0.875rem",
      ...(styles.singleValue ? styles.singleValue(base, state) : {}),
    }),
    menu: (base, state) => ({
      ...base,
      borderRadius: "0.5rem",
      zIndex: 99999,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      ...(styles.menu ? styles.menu(base, state) : {}),
    }),
    menuPortal: (base, state) => ({
      ...base,
      zIndex: 99999,
      pointerEvents: "auto",
      ...(styles.menuPortal ? styles.menuPortal(base, state) : {}),
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? colors?.primary?.[500] || "#126e63"
        : state.isFocused
        ? colors?.primary?.[100] || "#e0f2f1"
        : "transparent",
      color: state.isSelected ? "#ffffff" : "#111827",
      fontSize: "0.875rem",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected
          ? colors?.primary?.[500] || "#126e63"
          : colors?.primary?.[100] || "#e0f2f1",
        color: state.isSelected ? "#ffffff" : "#111827",
      },
      "&:active": {
        backgroundColor: colors?.primary?.[500] || "#126e63",
        color: "#ffffff",
      },
      ...(styles.option ? styles.option(base, state) : {}),
    }),
    menuList: (base, state) => ({
      ...base,
      maxHeight: `${maxMenuHeight}px`,
      ...(styles.menuList ? styles.menuList(base, state) : {}),
    }),
    ...styles,
  };

  return (
    <div className="relative w-full max-w-full">
      <Select
        className={className}
        styles={defaultStyles}
        maxMenuHeight={maxMenuHeight}
        value={selected}
        options={options || []}
        onChange={handleChange}
        onInputChange={(newValue, actionMeta) => {
          if (onSearch && actionMeta.action === "input-change") {
            onSearch(newValue);
          }
        }}
        menuPortalTarget={
          menuPortalTarget ||
          menuTarget ||
          (mounted && typeof document !== "undefined" ? document.body : null)
        }
        menuPosition={menuPosition}
        menuPlacement={menuPlacement}
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