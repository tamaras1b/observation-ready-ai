/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['jspdf', 'html2canvas'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
