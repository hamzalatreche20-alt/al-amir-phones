import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // السماح بصور Unsplash (التي استخدمناها في البداية كصور وهمية)
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // السماح بجميع صور Supabase الخاصة بك
        protocol: 'https',
        hostname: '*.supabase.co', 
      },
    ],
  },
};

export default nextConfig;