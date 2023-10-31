import useSWR from "swr";

export default function useKategoriHki(deps = []) {
	const API_URL = `${process.env.API_ENDPOINT}/kategori/hki`;
	return useSWR(Array.isArray(deps) && deps.every((value) => value != null) && API_URL);
}
