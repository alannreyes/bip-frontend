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
  title: "EFC - Buscador Inteligente de Productos",
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
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src="/images/logoefc.png" 
                  alt="EFC" 
                  width={100} 
                  height={30}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
              {children}
            </div>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}