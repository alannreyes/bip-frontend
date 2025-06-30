"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { isLoading, error, isAuthenticated, isAuthorized } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Si ya está autenticado y autorizado, redirigir
    if (!isLoading && isAuthenticated && isAuthorized) {
      router.push('/dashboard');
    }
    
    // Si hay error o no está autorizado después de cargar
    if (!isLoading && (!isAuthenticated || !isAuthorized)) {
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [mounted, isLoading, isAuthenticated, isAuthorized, router]);

  // Evitar renderizado en servidor
  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error de autenticación</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Serás redirigido al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
        <p className="text-sm text-gray-500 mt-2">Verificando permisos...</p>
      </div>
    </div>
  );
}