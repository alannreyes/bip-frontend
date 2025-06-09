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
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado sin logo duplicado */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Buscador Inteligente de Productos
            </h1>
            <p className="text-xs text-gray-500">Sistema de búsqueda semántica</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-sm">
            Cerrar sesión
          </Button>
        </div>
      </header>
      
      {/* Contenido principal - usa todo el ancho */}
      <div className="px-6 py-8">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="individual">Búsqueda individual</TabsTrigger>
            <TabsTrigger value="masiva">Búsqueda masiva</TabsTrigger>
          </TabsList>
          <TabsContent value="individual" className="w-full">
            <SearchForm />
          </TabsContent>
          <TabsContent value="masiva" className="w-full">
            <BulkSearchForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}