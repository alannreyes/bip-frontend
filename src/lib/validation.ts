import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().refine(val => val.endsWith("@efc.com.pe"), {
    message: "El email debe ser @efc.com.pe",
  }),
});

export const searchSchema = z.object({
  query: z.string().min(1, "Campo requerido"),
  limit: z.number().min(1).max(100).default(10),
  segment: z.enum(["premium", "economy", "standard"]),
});

export const bulkSchema = z.object({
  queries: z.string().min(1, "Campo requerido").refine(val => val.split("\n").length <= 500, {
    message: "Máximo 500 líneas",
  }),
  limit: z.number().min(1).max(100).default(10),
  segment: z.enum(["premium", "economy", "standard"]),
}); 