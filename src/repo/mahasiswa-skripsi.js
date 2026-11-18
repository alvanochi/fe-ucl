import useSWR from 'swr'

export default function useMahasiswaSkripsi(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/all-mhs-skripsi`
  return useSWR(Array.isArray(deps) && deps.every(value => value != null) && API_URL)
}
