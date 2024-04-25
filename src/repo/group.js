import useSWR from "swr";

export default function useGroup(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/voting/group-all`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
