import useSWR from "swr";

export default function useUsersGroup(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/users/get-users-group`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
