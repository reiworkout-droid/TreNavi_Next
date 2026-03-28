import { NextConfig } from "next"; // 型名を NextConfig にする

const nextConfig: NextConfig = {
  // ここにオプションを記述
  reactStrictMode: true,
  images: {
    domains: ["trenavi.x0.com"],
  },
};

export default nextConfig;