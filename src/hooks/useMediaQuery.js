import { useState, useEffect } from "react";

export const useMediaQuery = (mediaQuery) => {
	const [isMatch, setIsMatch] = useState(false);

	useEffect(() => {
		if (!window) return;
		const match = window.matchMedia(mediaQuery);
		setIsMatch(match.matches);
	}, [mediaQuery]);

	return isMatch;
};

export default useMediaQuery;
