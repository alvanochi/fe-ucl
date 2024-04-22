import useSWR from "swr";

export default function useMahasiswaSkripsi(deps = []) {
  const API_URL = `${process.env.API_ENDPOINT}/users/all-mhs-skripsi`;
  return useSWR(
    Array.isArray(deps) && deps.every((value) => value != null) && API_URL
  );
}
