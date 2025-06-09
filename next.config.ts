import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remueve o comenta esta sección para que no aparezca
  // devIndicators: {
  //   appIsrStatus: false,
  //   buildActivity: false,
  //   buildActivityPosition: 'bottom-right',
  // },
};

export default nextConfig;
