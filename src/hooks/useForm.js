import { useState } from "react";

const INITIAL_FORM_OPTION = {
	option: { title: "Tambah Data", method: "POST" },
	rules: [],
};

export const useForm = (initialState, initialFormOptionState = INITIAL_FORM_OPTION) => {
	const [form, setForm] = useState(initialState);
	const [option, setOption] = useState(initialFormOptionState.option || INITIAL_FORM_OPTION.option);
	const [validation, setValidation] = useState(null);

	const reset = () => setForm(initialState);
	const resetOption = () => setOption(initialFormOptionState.option || INITIAL_FORM_OPTION.option);

	const validate = () => {
		const rules = initialFormOptionState.rules || INITIAL_FORM_OPTION.rules;

		for (const rule of rules) {
			const fieldValue = form[rule.field];
			if (fieldValue == "") {
				setValidation((state) => ({ ...state, [rule.field]: { error: true, message: `Harap Isi Bidang ${rule.label}` } }));
			}
		}

		return validation;
	};

	const setNestedFormObject = (keys, value) => {
		const [parent, child] = keys;
		return { ...form, [parent]: { ...form[parent], [child]: value } };
	};

	const setNestedFormArray = (keys, index, value) => {
		const [parent, child] = keys;

		let data = form[parent];
		data[index][child] = value;

		return { ...form, [parent]: [...data] };
	};

	const inputHandler = (event, cb) => {
		const INPUT_NAME = event.target.name;
		let INPUT_VALUE = event.target.value;
		switch (event.target.type) {
			case "file":
				INPUT_VALUE = event.target.files[0];
				break;
			case "checkbox":
				INPUT_VALUE = event.target.checked;
				break;
		}

		let formValue = { ...form, [INPUT_NAME]: INPUT_VALUE };

		if (INPUT_NAME.split(".").length > 1 && event.target.attributes.index)
			formValue = setNestedFormArray(INPUT_NAME.split("."), event.target.attributes.index.value, INPUT_VALUE);
		else if (INPUT_NAME.split(".").length > 1) formValue = setNestedFormObject(INPUT_NAME.split("."), INPUT_VALUE);

		if (typeof cb == "function") formValue = cb(formValue, event.target.attributes?.index?.value);
		return setForm(formValue);
	};

	return {
		form,
		option,
		validation,
		setForm,
		setOption,
		inputHandler,
		setNestedFormObject,
		setNestedFormArray,
		reset,
		resetOption,
		validate,
		setValidation,
	};
};

export default useForm;
