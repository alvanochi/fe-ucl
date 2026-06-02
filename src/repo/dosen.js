import useSWR from 'swr'

export default function useDosen(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/all-dosen`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
