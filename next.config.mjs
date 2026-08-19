/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Run用のスタンドアロン出力
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/webrtc/:path*",
        destination: "http://localhost:8889/:path*",
      },
    ];
  },
}

export default nextConfig
