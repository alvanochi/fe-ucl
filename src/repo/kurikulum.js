import useSWR from "swr";

export default function useKurikulum(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/kategori/kurikulum/all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
