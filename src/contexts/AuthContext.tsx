"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "@/lib/auth-config";

// Crear instancia única de MSAL
let msalInstance: PublicClientApplication | null = null;

function getMsalInstance(): PublicClientApplication {
  if (typeof window === 'undefined') {
    throw new Error('MSAL can only be used in the browser');
  }
  
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMsal = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const instance = getMsalInstance();
        await instance.initialize();
        
        // Handle redirect response
        const response = await instance.handleRedirectPromise();
        
        if (response && response.account) {
          setUser(response.account);
        } else {
          // Check for existing accounts
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            setUser(accounts[0]);
          }
        }
      } catch (err) {
        console.error('MSAL initialization error:', err);
        setError(err instanceof Error ? err.message : 'MSAL initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initMsal();
  }, []);

  const isAuthenticated = !!user;
  const isAuthorized = user?.username?.toLowerCase().endsWith('@efc.com.pe') ?? false;

  const login = async () => {
    try {
      setError(null);
      const instance = getMsalInstance();
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = () => {
    try {
      const instance = getMsalInstance();
      if (user) {
        instance.logoutRedirect({ account: user });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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