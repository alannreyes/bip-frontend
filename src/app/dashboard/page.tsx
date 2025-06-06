"use client";
import { useAuth } from "../../hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchForm from "./components/SearchForm";
import BulkSearchForm from "./components/BulkSearchForm";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (user === undefined) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-primary">Buscador de Productos</h2>
        <Button variant="outline" onClick={logout}>Cerrar sesión</Button>
      </div>
      <div className="max-w-4xl mx-auto mt-8">
        <Tabs defaultValue="individual">
          <TabsList>
            <TabsTrigger value="individual">Búsqueda individual</TabsTrigger>
            <TabsTrigger value="masiva">Búsqueda masiva</TabsTrigger>
          </TabsList>
          <TabsContent value="individual">
            <SearchForm />
          </TabsContent>
          <TabsContent value="masiva">
            <BulkSearchForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}