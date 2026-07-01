import useSWR from 'swr'
import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL
const ALL_USERS_URL = `${BASE}/users/all-users`

async function fetchPegawai() {
  const res = await axios.get(ALL_USERS_URL).then(r => r.data)
  const rawUsers = res?.data
  const users = Array.isArray(rawUsers) ? rawUsers : (rawUsers?.data ?? [])
  return users.filter(u => u.role !== 'Mahasiswa')
}

export default function useAllPegawai() {
  return useSWR(ALL_USERS_URL, fetchPegawai)
}
