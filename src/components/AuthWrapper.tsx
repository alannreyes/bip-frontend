export function AuthWrapper({ children }: { children: React.ReactNode }) {
  // Sin autenticación - renderizar directamente
  return <>{children}</>;
}