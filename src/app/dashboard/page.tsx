"use client";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchForm from "./components/SearchForm";
import BulkSearchForm from "./components/BulkSearchForm";

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
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
    </AuthWrapper>
  );
}