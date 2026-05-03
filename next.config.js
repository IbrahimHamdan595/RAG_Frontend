/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In Docker: NEXT_PUBLIC_API_URL = http://backend:8000
    // In dev:    falls back to http://localhost:8000
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    return [
      {
        source:      "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;