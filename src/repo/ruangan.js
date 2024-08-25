import useSWR from "swr";

export default function useRuangan(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/ruangan/all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
