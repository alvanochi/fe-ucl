import classnames from "classnames";

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
	<label className={classnames("block text-sm font-bold text-gray-900", className)} {...props}>
		{children}
	</label>
);

Form.Input = ({ type, className, ...props }) => <input type={type} className={classnames("form-input", className)} {...props} />;

Form.Select = ({ options, className, emptyStateLabel = "-- Pilih --", ...props } = {}) => (
	<select className={classnames("form-select", className)} {...props}>
		<option value="">{emptyStateLabel}</option>
		{options &&
			options.map((option, index) => (
				<option key={`${props.name}-option-${index}`} value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			))}
	</select>
);

Form.Checkbox = ({ className, ...props }) => <input type="checkbox" className={classnames("form-checkbox", className)} {...props} />;
Form.Radio = ({ className, ...props }) => <input type="radio" className={classnames("form-radio", className)} {...props} />;

Form.Textarea = ({ className, ...props }) => <textarea className={classnames("form-input", className)} {...props} />;

Form.Group.displayName = "FormGroup";
Form.Label.displayName = "FormLabel";
Form.Input.displayName = "FormInput";
Form.Select.displayName = "FormSelect";
Form.Checkbox.displayName = "FormCheckbox";
Form.Radio.displayName = "FormRadio";
Form.Textarea.displayName = "FormTextarea";

export default Form;
