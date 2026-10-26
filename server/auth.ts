import type { Request } from "express";
import type { User } from "../drizzle/schema.js";
import { authenticateClerkRequest } from "./_core/clerk.js";

/**
 * Deep Authentication Module
 * Encapsulates Clerk token verification, cookie extraction, database hydration,
 * and role mapping behind a single, minimal interface.
 */
export async function authenticateRequest(req: Request): Promise<User | null> {
  return authenticateClerkRequest(req);
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role === "admin";
}
