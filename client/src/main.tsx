import { ClerkProvider } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  if (!clerkPublishableKey) {
    startLogin();
  }
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
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
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
        {content}
      </ClerkProvider>
    );
  }

  return content;
}

createRoot(document.getElementById("root")!).render(<Root />);

