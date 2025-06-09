"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  AccountInfo,
  AuthenticationResult,
  EventType,
  EventMessage,
  InteractionStatus
} from "@azure/msal-browser";
import { msalInstance, loginRequest, graphConfig } from "@/lib/auth-config";
import { useRouter, usePathname } from "next/navigation";

const AUTHORIZED_GROUP_ID = process.env.NEXT_PUBLIC_AUTHORIZED_GROUP_ID!;

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Iniciando autenticación...");
        
        // Esperar a que MSAL esté listo
        await msalInstance.initialize();
        
        // Manejar la respuesta del redirect
        const response = await msalInstance.handleRedirectPromise();
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
          const isAuth = await checkGroupMembership(response.account);
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
          const accounts = msalInstance.getAllAccounts();
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
                await checkGroupMembership(account);
              }
            } else {
              await checkGroupMembership(account);
            }
          }
        }
      } catch (error) {
        console.error("Error en initAuth:", error);
        setError("Error al inicializar autenticación");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const checkGroupMembership = async (account: AccountInfo): Promise<boolean> => {
    try {
      console.log("=== VERIFICANDO MEMBRESÍA DE GRUPOS ===");
      console.log("Usuario:", account.username);
      console.log("Group ID buscado:", AUTHORIZED_GROUP_ID);
      
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
        forceRefresh: false
      });
      
      console.log("Token obtenido, haciendo llamada a Graph API...");

      const response = await fetch(graphConfig.graphGroupsEndpoint, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Graph API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Grupos encontrados:", data.value.length);
      
      let isMember = false;
      data.value.forEach((group: any) => {
        console.log(`- ${group.displayName} (${group.id})`);
        if (group.id === AUTHORIZED_GROUP_ID) {
          isMember = true;
          console.log("✅ Usuario es miembro del grupo appbip!");
        }
      });
      
      setIsAuthorized(isMember);
      return isMember;
      
    } catch (error) {
      console.error("Error verificando grupos:", error);
      
      // Si falla, intentar renovar el token
      try {
        await msalInstance.acquireTokenRedirect(loginRequest);
      } catch (e) {
        console.error("Error obteniendo token:", e);
      }
      
      return false;
    }
  };

  const login = async () => {
    try {
      setError(null);
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión");
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      msalInstance.logoutRedirect({ account });
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