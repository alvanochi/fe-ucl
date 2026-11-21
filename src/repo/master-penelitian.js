import useSWR from 'swr'

export function useKelompokBidang(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/kelompok-bidang`
  return useSWR(Array.isArray(deps) && deps.every(v => v != null) && API_URL)
}

export function useJenisDokumen(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/jenis-dokumen`
  return useSWR(Array.isArray(deps) && deps.every(v => v != null) && API_URL)
}

export function useSkimKegiatan(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/skim-kegiatan`
  return useSWR(Array.isArray(deps) && deps.every(v => v != null) && API_URL)
}

export function useKolaboratorExternal(deps = []) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/penelitian/master/kolaborator-external`
  return useSWR(Array.isArray(deps) && deps.every(v => v != null) && API_URL)
}