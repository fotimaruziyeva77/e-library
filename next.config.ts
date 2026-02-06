import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'library.sifatdev.uz',
      },
      {
        protocol: 'http',
        hostname: 'library.sifatdev.uz',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'dribbble.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // ✅ allow local Django media
      },
      {
        protocol: 'http',
        hostname: 'localhost', // optional if you use localhost instead of 127.0.0.1
      },
    ],
  },
}

export default nextConfig
