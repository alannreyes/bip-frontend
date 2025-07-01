"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("🔍 AuthGuard state:", { user, isLoading, error, pathname });
    
    // Si estamos en /login, no proteger con autenticación
    if (pathname === '/login' || pathname.startsWith('/login')) {
      console.log("🚫 Login page - skipping auth protection");
      return;
    }
    
    // Si el usuario no está definido (aún cargando) no hacemos nada.
    if (user === undefined) return;

    // Si el usuario es null (carga finalizada, sin sesión), redirigir.
    if (user === null) {
      console.log("🔄 Redirecting to login");
      router.push("/login");
    }
  }, [user, router, isLoading, error, pathname]);

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error de autenticación</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => router.push('/login')} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  // Si estamos en /login, renderizar siempre (sin protección)
  if (pathname === '/login' || pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  // Mientras carga o si no hay usuario, no renderizar los hijos.
  if (isLoading || user === undefined || user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Verificando autenticación...</p>
          <p className="mt-2 text-sm text-gray-500">
            {isLoading ? "Conectando con Microsoft..." : "Redirigiendo..."}
          </p>
        </div>
      </div>
    );
  }

  // Si hay usuario, renderizar el contenido protegido.
  return <>{children}</>;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}