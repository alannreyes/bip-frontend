# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application for an intelligent SKU search system called "EFC - Buscador Inteligente de SKU". The application uses semantic search for product discovery and includes Azure AD authentication for access control.

## Common Development Commands

- `npm run dev` - Start development server on port 3005
- `npm run build` - Build the application for production
- `npm start` - Start production server on port 3005  
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

### Authentication Flow
- Uses Azure MSAL (Microsoft Authentication Library) for SSO
- `AuthContext` manages authentication state globally
- `AuthWrapper` protects routes and enforces authentication
- Users must have `@efc.com.pe` email domain for access (temporary implementation)
- Auth flow: Login → Azure AD → Callback → Group verification → Dashboard access

### Project Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (uses shadcn/ui)
- `/src/contexts` - React contexts (AuthContext for global auth state)
- `/src/hooks` - Custom React hooks (useAuth, useProductSearch)
- `/src/lib` - Utility libraries and configurations

### Key Components
- **SearchForm** - Individual product search interface
- **BulkSearchForm** - Mass product search with Excel upload
- **ResultsTable** - Display search results with export functionality
- **AuthWrapper** - Higher-order component for route protection

### API Integration
- Uses axios for HTTP requests via `/src/lib/api.ts`
- Proxy endpoint at `/src/app/api/proxy-search/route.ts` for external API calls
- Environment variable `NEXT_PUBLIC_API_URL` configures backend connection

### Styling
- TailwindCSS for styling
- shadcn/ui component library
- Custom CSS animations with `tw-animate-css`

### Docker Support
- Configured for standalone deployment
- Images set to unoptimized for Docker compatibility
- Development and production ports: 3005

### State Management
- React Context for authentication state
- React Hook Form with Zod validation for forms
- Local state management in components

### File Processing
- Excel file processing using `xlsx` library
- Export functionality for search results

## Environment Variables Required

- `NEXT_PUBLIC_AZURE_CLIENT_ID` - Azure AD app client ID
- `NEXT_PUBLIC_AZURE_TENANT_ID` - Azure AD tenant ID  
- `NEXT_PUBLIC_REDIRECT_URI` - OAuth redirect URI
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_AUTHORIZED_GROUP_ID` - Azure AD group for authorization

## Development Notes

- The app uses client-side rendering for authenticated components
- Authentication state persists in localStorage
- MSAL instance is created per browser session
- TypeScript is used throughout with strict type checking disabled during builds