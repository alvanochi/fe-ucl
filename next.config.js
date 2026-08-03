/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/staging',
  swcMinify: false,
  reactStrictMode: true,
  output: 'standalone',
  env: {
    APP_NAME: "UCL",
    API_ENDPOINT_ABSEN: "https://absen.ft.uika-bogor.ac.id/api",
    BASE_URL: "https://ucl.uika-bogor.ac.id/staging",
  },
};

module.exports = nextConfig;
