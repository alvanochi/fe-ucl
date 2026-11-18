import axios from "axios";

/**
 * Bootstrap token CBT via SSO tias-backend (`POST /cbt/auth`) — mirror pola yang sudah
 * terbukti jalan di tias-mobile (CbtAuthController.getCbtToken + CbtUserMapping cache
 * 8 jam di sisi backend). JWT TIAS sudah otomatis terlampir lewat
 * `axios.defaults.headers.common['token']` yang di-set global oleh useUser() (lihat
 * repo/lms.js), jadi cukup pakai instance axios default di sini.
 */

const CBT_AUTH_URL = () => `${process.env.NEXT_PUBLIC_API_URL}/cbt/auth`;
const BUFFER_MS = 5 * 60 * 1000; // jangan pakai token yang sebentar lagi kedaluwarsa

export async function bootstrapCbtToken() {
  const cachedToken = localStorage.getItem("cbt_token");
  const expiresAt = localStorage.getItem("cbt_token_expires_at");
  if (cachedToken && expiresAt && new Date(expiresAt).getTime() > Date.now() + BUFFER_MS) {
    return cachedToken;
  }

  const { data } = await axios.post(CBT_AUTH_URL());
  if (!data?.success) {
    throw new Error(data?.message || "Gagal mendapatkan akses CBT.");
  }

  const { cbt_token, cbt_user_id, expires_at } = data.data;
  localStorage.setItem("cbt_token", cbt_token);
  localStorage.setItem("cbt_user_id", cbt_user_id);
  localStorage.setItem("cbt_token_expires_at", expires_at);
  return cbt_token;
}

export function clearCbtToken() {
  localStorage.removeItem("cbt_token");
  localStorage.removeItem("cbt_user_id");
  localStorage.removeItem("cbt_token_expires_at");
}
