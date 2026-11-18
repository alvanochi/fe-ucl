import axios from "axios";
import { bootstrapCbtToken, clearCbtToken } from "./cbtAuth";

/**
 * Instance axios terpisah ke cbt-api (langsung, bukan lewat tias-backend — "native"
 * integration, sama seperti tias-mobile). Auth: Bearer cbt_token, bukan header `token`
 * yang dipakai tias-backend.
 */
const axiosCbt = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CBT_API_BASE_URL,
});

axiosCbt.interceptors.request.use(async (config) => {
  const cbtToken = await bootstrapCbtToken();
  config.headers.Authorization = `Bearer ${cbtToken}`;
  return config;
});

axiosCbt.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;
    if ((status === 401 || status === 419 || status === 440) && original && !original._cbtRetried) {
      original._cbtRetried = true;
      clearCbtToken();
      const cbtToken = await bootstrapCbtToken();
      original.headers.Authorization = `Bearer ${cbtToken}`;
      return axiosCbt(original);
    }
    return Promise.reject(error);
  }
);

export default axiosCbt;
