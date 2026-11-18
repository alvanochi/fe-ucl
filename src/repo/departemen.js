import useSWR from 'swr'

export default function useDepartemen(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/help/departemen`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
