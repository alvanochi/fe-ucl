import useSWR from "swr";

export default function useDosen(deps = []) {
	const API_URL = `${process.env.API_ENDPOINT}/users/getDosen`;
	return useSWR(Array.isArray(deps) && deps.every((value) => value != null) && API_URL);
}
