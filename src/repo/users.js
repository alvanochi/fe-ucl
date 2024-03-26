import useSWR from "swr";

export default function useUsers(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/users/all-users`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
