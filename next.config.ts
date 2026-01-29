import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luckmedia.link',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'duel.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
