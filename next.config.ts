import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
  },
  env: {
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  allowedDevOrigins: ["http://localhost:3000"],
};

export default nextConfig;
