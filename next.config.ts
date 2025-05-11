import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: 'incremental'
  },
  images: {
    domains: ['example.com', 'your-image-domain.com'], // ← remplace par le domaine réel des URLs
  },
};

export default nextConfig;
