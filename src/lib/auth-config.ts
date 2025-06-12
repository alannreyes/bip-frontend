import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// Logs de debug
console.log("=== AUTH CONFIG CARGADO ===");
console.log("Client ID existe:", !!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID);
console.log("Tenant ID existe:", !!process.env.NEXT_PUBLIC_AZURE_TENANT_ID);
console.log("Redirect URI:", process.env.NEXT_PUBLIC_REDIRECT_URI);

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
        console.log(`[MSAL] ${message}`);
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

export const msalInstance = new PublicClientApplication(msalConfig);

// Inicializar MSAL
msalInstance.initialize().then(() => {
  console.log("MSAL inicializado correctamente");
}).catch((error) => {
  console.error("Error inicializando MSAL:", error);
});