/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    APP_NAME: "TIAS",
    SESSION_SECRET_KEY: "B1zq1JKpYNcz8dgEeypiPrK3bZdeJZrQ",
    API_ENDPOINT: "http://localhost:5000",
  },
};

module.exports = nextConfig;
