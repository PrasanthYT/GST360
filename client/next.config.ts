import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "helios-i.mashable.com",
      "cdn.moglix.com",
      "5.imimg.com",
      "m.media-amazon.com",
      "randomuser.me",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
