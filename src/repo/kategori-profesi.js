import useSWR from "swr";

export default function useKategoriProfesi(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/kategori/profesi`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
