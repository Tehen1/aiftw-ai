/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['qph.cf2.poecdn.net'],
  },
};

module.exports = nextConfig;