"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, isAuthorized, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isAuthorized) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAuthorized, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Buscador Inteligente de Productos
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Inicia sesión con tu cuenta corporativa
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          
          <Button onClick={login} className="w-full">
            Iniciar sesión con Microsoft
          </Button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800">
              Solo usuarios del grupo <code className="font-mono">appbip</code> tienen acceso.
              Para solicitar acceso, contacta a IT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}