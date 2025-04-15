import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "grocerymart-server.onrender.com",
      },
    ],
  },
};

export default nextConfig;
