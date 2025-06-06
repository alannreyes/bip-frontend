"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/validation";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export default function LoginPage() {
  const { login, user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  if (user === undefined) {
    return <div>Cargando...</div>;
  }

  if (user) {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit(data => login(data.email))}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-primary">Iniciar sesión</h1>
        <Input placeholder="Email" {...register("email")}/>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <Button type="submit" className="w-full mt-4">Entrar</Button>
      </form>
    </div>
  );
}