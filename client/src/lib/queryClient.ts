import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getValidSession(): Promise<Session> {
  // First try to get the current session
  const { data: { session }, error } = await supabase.auth.getSession();

  // If no session or there's an error, try to refresh
  if (error || !session) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session) {
      // If refresh fails, redirect to auth page
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
      throw new Error('Session expired. Please log in again.');
    }

    return refreshData.session;
  }

  // Check if token is about to expire (within 5 minutes)
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt ? expiresAt - now : 0;

  if (timeUntilExpiry < 300) { // Less than 5 minutes
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session) {
      return session; // Return current session if refresh fails
    }

    return refreshData.session;
  }

  return session;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const session = await getValidSession();

  const res = await fetch(url, {
    method,
    headers: {
      ...(data && { "Content-Type": "application/json" }),
      ...(session && { Authorization: `Bearer ${session.access_token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const session = await getValidSession();

    const res = await fetch(queryKey.join("/") as string, {
      headers: {
        ...(session && { Authorization: `Bearer ${session.access_token}` }),
      },
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
