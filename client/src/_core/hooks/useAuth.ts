import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { useClerk, useUser } from "@clerk/clerk-react";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function useClerkAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: isLoaded && Boolean(isSignedIn),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [signOut, utils]);

  const user = useMemo(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return null;
    return {
      id: meQuery.data?.id ?? clerkUser.id,
      clerkId: clerkUser.id,
      name: meQuery.data?.name || clerkUser.fullName || clerkUser.username || "Penulis",
      email: meQuery.data?.email || clerkUser.primaryEmailAddress?.emailAddress || "",
      avatarUrl: meQuery.data?.avatarUrl || clerkUser.imageUrl || "",
      role: meQuery.data?.role ?? ((clerkUser.publicMetadata?.role as "admin" | "user") || "user"),
    };
  }, [isLoaded, isSignedIn, clerkUser, meQuery.data]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (!isLoaded) return;
    if (isSignedIn) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, [isLoaded, isSignedIn, redirectOnUnauthenticated, redirectPath]);

  return {
    user,
    loading: !isLoaded,
    error: meQuery.error ?? null,
    isAuthenticated: Boolean(isSignedIn),
    refresh: () => meQuery.refetch(),
    logout,
  };
}

function useLegacyAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout: never let loading hang more than 2s if backend is unreachable
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      try {
        sessionStorage.removeItem("manus-cookie");
        localStorage.removeItem("manus-runtime-user-info");
      } catch {}
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const cachedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("manus-runtime-user-info");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const user = meQuery.data ?? cachedUser ?? null;
  const loading = !cachedUser && !timedOut && !meQuery.isError && meQuery.isLoading;

  useEffect(() => {
    if (meQuery.data) {
      try {
        localStorage.setItem(
          "manus-runtime-user-info",
          JSON.stringify(meQuery.data)
        );
      } catch {}
    }
  }, [meQuery.data]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading || logoutMutation.isPending) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      startLogin();
    }
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    loading,
    user,
  ]);

  return {
    user: user ?? null,
    loading,
    error: meQuery.error ?? logoutMutation.error ?? null,
    isAuthenticated: Boolean(user),
    refresh: () => meQuery.refetch(),
    logout,
  };
}

export const useAuth = hasClerk ? useClerkAuth : useLegacyAuth;

