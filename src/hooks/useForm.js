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
		if (!event || !event.target) {
			console.warn('[useForm] inputHandler dipanggil tanpa event yang valid:', event);
			return;
		}
		const INPUT_NAME = event.target.name;
		let INPUT_VALUE = event.target.value;

			if (INPUT_NAME === "pendapatan") {
				INPUT_VALUE = INPUT_VALUE.replace(/\D/g, '');
				INPUT_VALUE = new Intl.NumberFormat('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
				}).format(INPUT_VALUE);
			}

		switch (event.target.type) {
			case "file":
				INPUT_VALUE = event.target.files && event.target.files[0] ? event.target.files[0] : null;
				break;
			case "checkbox":
				INPUT_VALUE = event.target.checked;
				break;
		}

		const isNested = INPUT_NAME.split(".").length > 1;
		const indexAttr = event.target.attributes?.index?.value;

		return setForm((prev) => {
			let updated = { ...prev, [INPUT_NAME]: INPUT_VALUE };

			if (isNested && indexAttr !== undefined) {
				const [parent, child] = INPUT_NAME.split(".");
				const data = [...(prev[parent] || [])];
				data[indexAttr] = { ...data[indexAttr], [child]: INPUT_VALUE };
				updated = { ...prev, [parent]: data };
			} else if (isNested) {
				const [parent, child] = INPUT_NAME.split(".");
				updated = { ...prev, [parent]: { ...(prev[parent] || {}), [child]: INPUT_VALUE } };
			}

			if (typeof cb == "function") updated = cb(updated, indexAttr);
			return updated;
		});
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
