import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  if (!clerkPublishableKey && import.meta.env.VITE_OAUTH_PORTAL_URL) {
    startLogin();
  }
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      async headers() {
        const headers: Record<string, string> = {};
        try {
          // If Clerk is initialized in the browser, forward its session token
          if (typeof window !== "undefined" && (window as any).Clerk?.session) {
            const token = await (window as any).Clerk.session.getToken();
            if (token) {
              headers.Authorization = `Bearer ${token}`;
              return headers;
            }
          }

          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find((s: string) => s.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }
          }
        } catch {
          // fallback
        }
        return headers;
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

function Root() {
  const content = (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );

  if (clerkPublishableKey) {
    return (
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        afterSignOutUrl="/"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#b78a58",
            colorBackground: "#111111",
            colorText: "#f3f0ea",
          },
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}

if (import.meta.env.VITE_ANALYTICS_ENDPOINT && import.meta.env.VITE_ANALYTICS_WEBSITE_ID) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `${import.meta.env.VITE_ANALYTICS_ENDPOINT}/umami`;
  script.setAttribute("data-website-id", import.meta.env.VITE_ANALYTICS_WEBSITE_ID);
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<Root />);


