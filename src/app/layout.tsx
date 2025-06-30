import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import Link from 'next/link';
import { AuthWrapper } from "@/components/AuthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EFC - Buscador Inteligente de SKU",
  description: "Sistema de búsqueda semántica de productos con IA",
  icons: {
    icon: "/images/logoefc.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthWrapper>
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Header con logo y título en la misma línea */}
              <div className="flex items-center gap-4 mb-6">
                <Link href="/" className="inline-block">
                  <Image 
                    src="/images/logoefc.png" 
                    alt="EFC" 
                    width={100} 
                    height={30}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
                <div className="border-l border-gray-300 h-8 mx-2"></div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Buscador Inteligente de SKU
                  </h1>
                  <p className="text-xs text-gray-500">Sistema de búsqueda semántica</p>
                </div>
              </div>
              {children}
            </div>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}