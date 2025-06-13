import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Necesario para despliegue en producción con Docker
  output: 'standalone',
  
  // Si tu app está en un subpath, descomenta y configura:
  // basePath: '/app',
  
  // Para servir assets correctamente
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // Configuración para imágenes si las usas
  images: {
    unoptimized: true, // Útil para despliegues estáticos
  },
  
  // Headers de seguridad recomendados
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirecciones si las necesitas
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;