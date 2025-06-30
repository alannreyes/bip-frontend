"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si todavía está verificando la autenticación, espera
    if (user === undefined) return;
    
    // Si está autenticado, va al dashboard
    if (user) {
      router.push('/dashboard');
    } else {
      // Si no está autenticado, va al login
      router.push('/login');
    }
  }, [user, router]);

  // Mientras verifica la autenticación, muestra un loader
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    </div>
  );
}