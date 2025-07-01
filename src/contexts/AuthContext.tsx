"use client";
import { createContext, useContext, ReactNode } from "react";
import { 
  useMsal, 
  useIsAuthenticated, 
  useAccount,
  MsalProvider,
  AuthenticationResult,
  AccountInfo
} from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "@/lib/auth-config";
import { useRouter } from "next/navigation";

// Crear instancia única de MSAL
let msalInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
}

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

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});
  const router = useRouter();

  // Verificar autorización basado en email
  const isAuthorized = account?.username?.toLowerCase().endsWith('@efc.com.pe') ?? false;

  const login = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const logout = () => {
    if (account) {
      instance.logoutRedirect({ account });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: account,
        isAuthenticated,
        isAuthorized,
        isLoading: false, // MSAL maneja el estado de carga internamente
        login,
        logout,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={getMsalInstance()}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </MsalProvider>
  );
}

export const useAuth = () => useContext(AuthContext);