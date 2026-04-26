import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@packalert/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bbystatic.com',
      },
    ],
  },
};

export default nextConfig;
