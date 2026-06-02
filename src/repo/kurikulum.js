import useSWR from 'swr'

export default function useKurikulum(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/kategori/kurikulum/all`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
