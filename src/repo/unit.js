import useSWR from 'swr'

export default function useUnit(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/unit/all`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
