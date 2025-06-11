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