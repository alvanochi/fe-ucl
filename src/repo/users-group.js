import useSWR from 'swr'

export default function useUsersGroup(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/get-users-group`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
