/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@peculiar/webcrypto'],
  },
  env: {
    APP_NAME: "UCL",
    // SESSION_SECRET_KEY IS REMOVED FROM HERE FOR SECURITY
    // It will be read natively from process.env / Vercel Environment Variables
    API_ENDPOINT: "http://localhost:4242",
    API_ENDPOINT_ABSEN: "https://absen.ft.uika-bogor.ac.id/api",
    BASE_URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
