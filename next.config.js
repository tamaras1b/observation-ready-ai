/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['jspdf', 'html2canvas'],
};

module.exports = nextConfig;
