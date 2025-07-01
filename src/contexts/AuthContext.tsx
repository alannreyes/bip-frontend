"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  AccountInfo,
  PublicClientApplication
} from "@azure/msal-browser";
import { getMsalInstance, loginRequest } from "@/lib/auth-config";
import { useRouter, usePathname } from "next/navigation";

// const AUTHORIZED_GROUP_ID = process.env.NEXT_PUBLIC_AUTHORIZED_GROUP_ID;

interface AuthContextType {
  user: AccountInfo | null;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAuthorized: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Iniciando autenticación...");
        
        // Obtener instancia de MSAL
        const instance = getMsalInstance();
        if (!instance) {
          console.log("⚠️ MSAL no disponible en el servidor");
          setIsLoading(false);
          return;
        }
        
        setMsalInstance(instance);
        
        console.log("🔄 Inicializando MSAL...");
        // Esperar a que MSAL esté listo con timeout
        await Promise.race([
          instance.initialize(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('MSAL timeout')), 10000)
          )
        ]);
        
        // Manejar la respuesta del redirect
        const response = await instance.handleRedirectPromise();
        console.log("Respuesta de redirect:", response);
        
        if (response && response.account) {
          console.log("Usuario autenticado desde redirect");
          setUser(response.account);
          
          // Guardar en localStorage para persistencia
          localStorage.setItem('user', JSON.stringify({
            email: response.account.username,
            isAuthorized: false // Se verificará después
          }));
          
          // Verificar grupos
          const isAuth = await checkGroupMembership(response.account, instance);
          if (isAuth) {
            // Actualizar localStorage con autorización
            localStorage.setItem('user', JSON.stringify({
              email: response.account.username,
              isAuthorized: true
            }));
            router.push('/dashboard');
          }
        } else {
          // Verificar si hay una sesión activa
          const accounts = instance.getAllAccounts();
          console.log("Cuentas encontradas:", accounts.length);
          
          if (accounts.length > 0) {
            const account = accounts[0];
            setUser(account);
            
            // Verificar si ya tenemos autorización guardada
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              const parsed = JSON.parse(savedUser);
              if (parsed.isAuthorized) {
                setIsAuthorized(true);
              } else {
                await checkGroupMembership(account, instance);
              }
            } else {
              await checkGroupMembership(account, instance);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error en initAuth:", error);
        setError("Error al inicializar autenticación: " + (error instanceof Error ? error.message : 'Unknown error'));
        // Si hay error, intentar continuar sin autenticación para no bloquear
        router.push('/login');
      } finally {
        console.log("✅ Finalizando inicialización de auth");
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const checkGroupMembership = async (account: AccountInfo, instance: PublicClientApplication): Promise<boolean> => {
    try {
      console.log("=== VERIFICANDO MEMBRESÍA DE GRUPOS ===");
      console.log("Usuario:", account.username);
      
      // TEMPORAL: Auto-aprobar usuarios @efc.com.pe
      if (account.username.toLowerCase().endsWith('@efc.com.pe')) {
        console.log("✅ Usuario de EFC - Acceso concedido automáticamente (TEMPORAL)");
        setIsAuthorized(true);
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify({
          email: account.username,
          isAuthorized: true
        }));
        
        return true;
      }
      
      // Si no es @efc.com.pe, denegar acceso
      console.log("❌ Usuario no es de EFC");
      setIsAuthorized(false);
      return false;
      
    } catch (error) {
      console.error("Error verificando grupos:", error);
      
      // Si falla, intentar renovar el token
      try {
        await instance.acquireTokenRedirect(loginRequest);
      } catch (e) {
        console.error("Error obteniendo token:", e);
      }
      
      return false;
    }
  };

  const login = async () => {
    try {
      setError(null);
      if (msalInstance) {
        await msalInstance.loginRedirect(loginRequest);
      } else {
        setError("MSAL no está inicializado");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión");
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    if (msalInstance) {
      const account = msalInstance.getAllAccounts()[0];
      if (account) {
        msalInstance.logoutRedirect({ account });
      }
    }
  };

  // No mostrar nada mientras se procesa el callback
  if (pathname === '/auth/callback' && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthorized,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);