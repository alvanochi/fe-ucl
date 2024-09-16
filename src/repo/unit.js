import useSWR from "swr";

export default function useUnit(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/kategori/unit/all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
