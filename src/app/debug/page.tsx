"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function DebugPage() {
  const { user, isAuthenticated, isAuthorized, isLoading, error } = useAuth();

  useEffect(() => {
    console.log("Debug - Estado actual:", {
      user: user?.username,
      isAuthenticated,
      isAuthorized,
      isLoading,
      error,
      groupId: process.env.NEXT_PUBLIC_AUTHORIZED_GROUP_ID
    });
  }, [user, isAuthenticated, isAuthorized, isLoading, error]);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Debug Auth</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({
          user: user?.username || "No user",
          isAuthenticated,
          isAuthorized,
          isLoading,
          error,
          groupId: process.env.NEXT_PUBLIC_AUTHORIZED_GROUP_ID || "NO DEFINIDO"
        }, null, 2)}
      </pre>
    </div>
  );
}