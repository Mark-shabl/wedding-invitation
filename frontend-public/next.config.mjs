/** @type {import('next').NextConfig} */
const apiInternal = process.env.API_INTERNAL_URL || "http://localhost:8080";

const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternal}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiInternal}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
