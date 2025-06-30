import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // IMPORTANTE: Necesario para Docker
  output: 'standalone',
  
  // Configuración de imágenes si las usas
  images: {
    unoptimized: true,
  },
  
  // Asegurar que los assets se sirvan correctamente
  assetPrefix: undefined,
  basePath: '',
};

export default nextConfig;