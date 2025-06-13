import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// Solo ejecutar logs en el cliente
if (typeof window !== 'undefined') {
  console.log("=== AUTH CONFIG CARGADO ===");
  console.log("Client ID existe:", !!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID);
  console.log("Tenant ID existe:", !!process.env.NEXT_PUBLIC_AZURE_TENANT_ID);
  console.log("Redirect URI:", process.env.NEXT_PUBLIC_REDIRECT_URI);
}

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    //allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (typeof window !== 'undefined') {
          console.log(`[MSAL] ${message}`);
        }
      },
      logLevel: 3, // Info level
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read", "GroupMember.Read.All"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphGroupsEndpoint: "https://graph.microsoft.com/v1.0/me/memberOf",
};

// Crear una instancia singleton de MSAL solo en el cliente
let msalInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (typeof window === 'undefined') {
    // En el servidor, devolver un objeto mock
    return {} as PublicClientApplication;
  }

  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    
    // Inicializar MSAL
    msalInstance.initialize().then(() => {
      console.log("MSAL inicializado correctamente");
    }).catch((error) => {
      console.error("Error inicializando MSAL:", error);
    });
  }

  return msalInstance;
}

// Exportar para compatibilidad con código existente
export { getMsalInstance as msalInstance };