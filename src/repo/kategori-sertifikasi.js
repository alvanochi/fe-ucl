import useSWR from "swr";

export default function useKategoriSertifikasi(deps = []) {
	const API_URL = `${process.env.API_ENDPOINT}/kategori/sertifikasi`;
	return useSWR(Array.isArray(deps) && deps.every((value) => value != null) && API_URL);
}
