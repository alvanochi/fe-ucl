import useSWR from 'swr'

export default function useGroup(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/voting/group-all`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
