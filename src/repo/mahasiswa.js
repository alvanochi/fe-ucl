import useSWR from "swr";

export default function useMahasiswa(deps = []) {
	const API_URL = `${process.env.API_ENDPOINT}/users/getMhs`;
	return useSWR(Array.isArray(deps) && deps.every((value) => value != null) && API_URL);
}
