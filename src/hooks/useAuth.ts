import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      setUser(stored);
    }
  }, []);

  const login = (email: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", email);
      setUser(email);
      router.push("/dashboard");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    }
  };

  return { user, login, logout };
}