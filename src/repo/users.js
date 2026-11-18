import useSWR from 'swr'

export default function useUsers(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/all-users`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
