"use client";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAuthorized, isLoading, error } = useAuth();
  const pathname = usePathname();

  // Si estamos en páginas públicas, renderizar siempre
  if (pathname === '/login' || pathname.startsWith('/login') || pathname === '/auth/callback') {
    return <>{children}</>;
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error de autenticación</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
            Ir a Login
          </a>
        </div>
      </div>
    );
  }

  // Mientras MSAL está cargando
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login (sin useRouter para evitar loops)
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado pero no autorizado
  if (isAuthenticated && !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Acceso Denegado
              </h2>
              <p className="text-sm text-red-700">
                No tienes permisos para acceder a esta aplicación.
              </p>
              <p className="text-xs text-red-600 mt-2">
                Solo usuarios con correo @efc.com.pe tienen acceso.
              </p>
            </div>
            
            <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
              Volver a Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si está autenticado y autorizado, renderizar contenido
  return <>{children}</>;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}