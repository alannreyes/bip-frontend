"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  AccountInfo,
  AuthenticationResult,
  EventType,
  EventMessage
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
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        
        // Manejar el redirect
        try {
          const response = await msalInstance.handleRedirectPromise();
          if (response && response.account) {
            console.log("Respuesta de redirect recibida:", response);
            await handleAuthResponse(response);
            return; // Importante: salir aquí para evitar procesar dos veces
          }
        } catch (error) {
          console.error("Error manejando redirect:", error);
        }

        // Si no hay redirect, verificar si hay sesión activa
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          console.log("Cuenta encontrada:", accounts[0]);
          setUser(accounts[0]);
          await checkGroupMembership(accounts[0]);
        }
        
      } catch (error) {
        console.error("Error inicializando MSAL:", error);
        setError("Error al inicializar autenticación");
      } finally {
        setIsLoading(false);
      }
    };

    initializeMsal();
  }, []);

  const handleAuthResponse = async (response: AuthenticationResult) => {
    console.log("Manejando respuesta de autenticación");
    if (response.account) {
      setUser(response.account);
      const authorized = await checkGroupMembership(response.account);
      if (authorized) {
        console.log("Usuario autorizado, redirigiendo a dashboard");
        router.push('/dashboard');
      } else {
        setError("No tienes permisos para acceder a esta aplicación. Debes pertenecer al grupo 'appbip'.");
        // No hacer logout automático para evitar loops
      }
    }
  };

const checkGroupMembership = async (account: AccountInfo): Promise<boolean> => {
  try {
    console.log("=== INICIO VERIFICACIÓN DE GRUPOS ===");
    console.log("Usuario:", account.username);
    console.log("Group ID esperado:", AUTHORIZED_GROUP_ID);
    
    // Verificar que tenemos el GROUP_ID
    if (!AUTHORIZED_GROUP_ID) {
      console.error("❌ ERROR: AUTHORIZED_GROUP_ID no está definido!");
      return false;
    }
    
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
    
    console.log("✅ Token obtenido exitosamente");

    const response = await fetch(graphConfig.graphGroupsEndpoint, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    console.log("Respuesta de Graph API - Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de Graph API:", errorText);
      throw new Error("Error al verificar grupos");
    }

    const data = await response.json();
    console.log("Grupos encontrados:", data.value.length);
    console.log("Lista completa de grupos:");
    
    data.value.forEach((group: any, index: number) => {
      console.log(`${index + 1}. ${group.displayName || 'Sin nombre'}`);
      console.log(`   ID: ${group.id}`);
      console.log(`   Tipo: ${group['@odata.type'] || 'No especificado'}`);
    });
    
    const isMember = data.value.some((group: any) => {
      const match = group.id === AUTHORIZED_GROUP_ID;
      if (match) {
        console.log("✅ MATCH ENCONTRADO con grupo:", group.displayName);
      }
      return match;
    });
    
    console.log("¿Es miembro del grupo autorizado?:", isMember ? "✅ SÍ" : "❌ NO");
    console.log("=== FIN VERIFICACIÓN ===");
    
    setIsAuthorized(isMember);
    return isMember;
    
  } catch (error) {
    console.error("❌ ERROR en checkGroupMembership:", error);
    
    // Si falla, intentar adquirir token con interacción
    try {
      await msalInstance.acquireTokenRedirect(loginRequest);
    } catch (redirectError) {
      console.error("❌ Error al solicitar token:", redirectError);
      setError("Error al verificar permisos");
    }
    
    return false;
  }
};

  const login = async () => {
    try {
      setError(null);
      // Limpiar cualquier estado anterior
      msalInstance.clearCache();
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión");
    }
  };

  const logout = () => {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      msalInstance.logoutRedirect({ account });
    }
    setUser(null);
    setIsAuthorized(false);
  };

  // No renderizar nada mientras se está en el callback
  if (pathname === '/auth/callback' && isLoading) {
    return <div>Procesando autenticación...</div>;
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