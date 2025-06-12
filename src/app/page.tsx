export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>BIP - Diagnóstico</h1>
      <h2>Variables de entorno:</h2>
      <ul>
        <li>API URL: {process.env.NEXT_PUBLIC_API_URL || 'NO DEFINIDA'}</li>
        <li>Client ID: {process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'NO DEFINIDA'}</li>
        <li>NODE_ENV: {process.env.NODE_ENV}</li>
      </ul>
      <p>Build time: {new Date().toISOString()}</p>
      <a href="/login">Ir a Login</a>
    </div>
  );
}