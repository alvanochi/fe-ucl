import useSWR from "swr";

export default function useKategoriKegiatan(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/kategori/kegiatan/all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
