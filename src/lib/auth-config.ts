import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage", // Cambiar a sessionStorage para evitar problemas de hidratación
    storeAuthStateInCookie: false,
  },
  system: {
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