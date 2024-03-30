import useSWR from "swr";

export default function useJabatan(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/jabatan`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
