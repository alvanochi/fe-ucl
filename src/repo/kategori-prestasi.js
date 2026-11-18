import useSWR from 'swr'

export default function useKategoriPrestasi(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/prestasi`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
