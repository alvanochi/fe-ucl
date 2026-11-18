import useSWR from 'swr'

export default function useKategoriHki(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/hki`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
