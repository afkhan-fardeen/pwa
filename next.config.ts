import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Allow dev server assets / internal routes when opened from LAN IPs (see .env.example). */
  allowedDevOrigins: ["192.168.8.252"],
};

export default nextConfig;
