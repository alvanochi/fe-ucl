import useSWR from 'swr'

export default function useMahasiswa(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/all-mhs`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
