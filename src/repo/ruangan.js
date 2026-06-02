import useSWR from 'swr'

export default function useRuangan(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/ruangan/all`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
