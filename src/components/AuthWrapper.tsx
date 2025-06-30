"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario no está definido (aún cargando) no hacemos nada.
    if (user === undefined) return;

    // Si el usuario es null (carga finalizada, sin sesión), redirigir.
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // Mientras carga o si no hay usuario, no renderizar los hijos.
  // Se puede poner un spinner aquí.
  if (user === undefined || user === null) {
    return <div>Loading...</div>;
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