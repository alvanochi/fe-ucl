import useSWR from "swr";

export default function useMatakuliah(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/kategori/matakuliah/all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
