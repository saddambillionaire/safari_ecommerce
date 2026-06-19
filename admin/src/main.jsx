import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for data fetching, caching, and server state management

import { ClerkProvider } from "@clerk/clerk-react"; // Authentication provider from Clerk
import { BrowserRouter } from "react-router"; // Enables routing/navigation in the app
import * as Sentry from "@sentry/react"; // Error monitoring and session replay tool

// Read Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Stop the app if the Clerk key is missing
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Create a React Query client instance
const queryClient = new QueryClient();

// // Initialize Sentry monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Project identifier for Sentry

  // Send extra user-related information (IP, browser data, etc.)
  sendDefaultPii: true,

  // Enable Sentry logs
  enableLogs: true,

  // Record user sessions for debugging
  integrations: [Sentry.replayIntegration()],

  // Record 100% of user sessions
  replaysSessionSampleRate: 1.0,

  // Record 100% of sessions that contain errors
  replaysOnErrorSampleRate: 1.0,
});

// Render the React application
createRoot(document.getElementById("root")).render(
  <StrictMode> {/* Helps detect potential React issues during development */}
    
    <BrowserRouter> {/* Makes routing available throughout the app */}
      
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}> {/* Provides authentication context */}
        
        <QueryClientProvider client={queryClient}> {/* Provides React Query features */}
          
          <App /> {/* Main application component */}
          
        </QueryClientProvider>
        
      </ClerkProvider>
      
    </BrowserRouter>
    
  </StrictMode>
);

// Most important concepts
// BrowserRouter → allows pages like /login, /dashboard, /products.
// ClerkProvider → makes authentication data available everywhere (useUser(), useAuth(), etc.).
// QueryClient → the central manager for React Query.
// QueryClientProvider → gives all components access to React Query features such as:
// fetching data from APIs
// caching responses
// automatic refetching
// loading/error states

