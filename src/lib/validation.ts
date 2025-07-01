import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().refine(val => val.endsWith("@efc.com.pe"), {
    message: "El email debe ser @efc.com.pe",
  }),
});

export const userSchema = z.object({
  email: z.string().email(),
  groups: z.array(z.string()).optional(),
  isAuthorized: z.boolean(),
});

export const searchSchema = z.object({
  query: z.string().min(1, "Campo requerido"),
  limit: z.string().min(1, "Campo requerido"),
  segment: z.enum(["premium", "economy", "standard"]),
});

export const bulkSchema = z.object({
  queries: z.string().min(1, "Campo requerido").refine(val => val.split("\n").length <= 500, {
    message: "Máximo 500 líneas",
  }),
  limit: z.string().min(1, "Campo requerido"),
  segment: z.enum(["premium", "economy", "standard"]),
});

// Tipos para la nueva respuesta enriquecida del backend
export interface QueryInfo {
  similitud: string;
  total_candidates: number;
  search_time_ms: number;
}

export interface Product {
  codigo: string;
  descripcion: string;
  marca: string;
  segment: "premium" | "economy" | "standard";
  rank?: number; // Solo presente en alternatives
  has_stock: boolean;
  has_cost_agreement: boolean;
  boost_total_percent?: number; // Solo en selected_product
  boost_reasons?: string[]; // Solo en selected_product
  boost_percent?: number; // Solo en alternatives
  boost_tags?: string[]; // Solo en alternatives
}

export interface BoostSummary {
  products_with_stock: string[];
  products_with_pricing: string[];
  segment_matches: string[];
  boost_weights_used: {
    segmentPreferred: number;
    segmentCompatible: number;
    stock: number;
    costAgreement: number;
    brandExact: number;
    modelExact: number;
    sizeExact: number;
  };
}

export interface Timings {
  embedding_time_ms: number;
  vector_search_time_ms: number;
  gpt_selection_time_ms: number;
  total_time_ms: number;
}

export interface ApiResponse {
  query_info: QueryInfo;
  selected_product: Product | null;
  alternatives: Product[];
  boost_summary: BoostSummary;
  selection_method: string;
  timings: Timings;
  normalizado: unknown;
}

// Tipo para los resultados procesados que se muestran en la tabla
export interface ProcessedResult {
  consulta: string;
  codigoRecomendado: string;
  descripcionRecomendada: string;
  codigo1: string;
  descripcion1: string;
  codigo2: string;
  descripcion2: string;
  codigo3: string;
  descripcion3: string;
  codigo4: string;
  descripcion4: string;
  codigo5: string;
  descripcion5: string;
  codigo6: string;
  descripcion6: string;
  codigo7: string;
  descripcion7: string;
  codigo8: string;
  descripcion8: string;
  codigo9: string;
  descripcion9: string;
  codigo10: string;
  descripcion10: string;
  // Metadata para colores
  boostSummary: BoostSummary;
} 