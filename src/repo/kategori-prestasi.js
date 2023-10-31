import useSWR from "swr";

export default function useKategoriPrestasi(deps = []) {
	const API_URL = `${process.env.API_ENDPOINT}/kategori/prestasi`;
	return useSWR(Array.isArray(deps) && deps.every((value) => value != null) && API_URL);
}
