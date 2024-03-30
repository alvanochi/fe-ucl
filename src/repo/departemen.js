import useSWR from "swr";

export default function useDepartemen(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/help/departemen`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
