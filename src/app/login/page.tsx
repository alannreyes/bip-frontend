"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const { login, isAuthenticated, isAuthorized, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si está autenticado Y autorizado
    if (isAuthenticated && isAuthorized) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAuthorized, router]);

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DC63F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
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
            <div className="mb-6">
              <Image 
                src="/images/logoefc.png" 
                alt="EFC" 
                width={120} 
                height={40}
                className="mx-auto"
                priority
              />
            </div>
            
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Acceso Denegado
              </h2>
              <p className="text-sm text-red-700">
                No tienes permisos para acceder a esta aplicación.
              </p>
              <p className="text-xs text-red-600 mt-2">
                Contacta a IT para solicitar acceso al grupo <code className="font-mono bg-red-100 px-1 rounded">appbip</code>
              </p>
            </div>
            
            <Button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }} 
              variant="outline"
              className="w-full"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulario de login
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image 
              src="/images/logoefc.png" 
              alt="EFC" 
              width={120} 
              height={40}
              className="mx-auto mb-4"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Buscador Inteligente de Productos
            </h1>
            <p className="text-sm text-gray-600">
              Sistema de búsqueda semántica con IA
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          
          {/* Login button */}
          <Button 
            onClick={login} 
            className="w-full bg-[#8DC63F] hover:bg-[#7ab52f] text-white font-semibold py-3"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0H0V10H10V0Z" fill="#F25022"/>
              <path d="M21 0H11V10H21V0Z" fill="#7FBA00"/>
              <path d="M10 11H0V21H10V11Z" fill="#00A4EF"/>
              <path d="M21 11H11V21H21V11Z" fill="#FFB900"/>
            </svg>
            Iniciar sesión con Microsoft
          </Button>
          
          {/* Info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Solo usuarios con correo <code className="font-mono bg-blue-100 px-1 rounded">@efc.com.pe</code> tienen acceso.
            </p>
          </div>
          
          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            © 2025 EFC - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}