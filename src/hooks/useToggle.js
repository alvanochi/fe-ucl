import { useState } from "react";

export const useToggle = (initialState = false, cb = false) => {
	const [active, setActive] = useState(initialState);
	const toggle = (state = null) => {
		if (typeof cb == "function") cb(active);
		if (typeof state == "boolean") return setActive(state);
		return setActive((state) => !state);
	};

	return [active, toggle];
};

export default useToggle;
