"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface AuthContextType {
  user: { email: string } | null;
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
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación simple: verificar si hay un usuario en localStorage
    const savedUser = localStorage.getItem('simpleAuth');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('simpleAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const isAuthorized = user?.email?.toLowerCase().endsWith('@efc.com.pe') ?? false;

  const login = async () => {
    // Simulación simple: pedir email y validar dominio
    const email = prompt('Ingresa tu email EFC:');
    if (email && email.toLowerCase().endsWith('@efc.com.pe')) {
      const userData = { email };
      setUser(userData);
      localStorage.setItem('simpleAuth', JSON.stringify(userData));
    } else {
      alert('Solo usuarios @efc.com.pe pueden acceder');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simpleAuth');
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
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);