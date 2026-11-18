// Dikontrol lewat env var (bukan hardcode) supaya cutover staging->production
// tinggal ganti .env di server + restart, tanpa perlu code change/rebuild dari
// branch terpisah tepat saat momen switch. Default "/staging" menjaga perilaku
// saat ini kalau BASE_PATH belum di-set eksplisit di .env deployment manapun.
const BASE_PATH = process.env.BASE_PATH ?? '/staging';
const BASE_URL = process.env.BASE_URL || `https://ucl.uika-bogor.ac.id${BASE_PATH}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: BASE_PATH,
  swcMinify: false,
  reactStrictMode: true,
  output: 'standalone',
  env: {
    APP_NAME: "UCL",
    API_ENDPOINT_ABSEN: "https://absen.ft.uika-bogor.ac.id/api",
    BASE_URL,
    // Sumber tunggal basePath untuk kode client (lihat src/lib/basePath.js) — sebelumnya
    // <img src="/img/..."> di-hardcode tanpa basePath, jadi 404 di seluruh deployment
    // yang basePath-nya bukan "" (mis. /staging). Next.js hanya auto-prefix basePath utk
    // next/image, next/link, dan chunk JS/CSS miliknya sendiri — bukan <img> biasa.
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

module.exports = nextConfig;
