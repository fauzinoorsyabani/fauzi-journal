import { createClerkClient, verifyToken } from "@clerk/backend";
import type { Request } from "express";
import { parse as parseCookieHeader } from "cookie";
import type { User } from "../../drizzle/schema.js";
import { getUserByClerkId, upsertUser } from "../db.js";

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
export const clerkClient = clerkSecretKey ? createClerkClient({ secretKey: clerkSecretKey }) : null;

/**
 * Extracts and verifies Clerk session token from Request.
 * Returns hydrated database User or null if unauthenticated.
 */
export async function authenticateClerkRequest(req: Request): Promise<User | null> {
  if (!clerkSecretKey) {
    return null;
  }

  // 1. Check Authorization Bearer header
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  }

  // 2. Check __session cookie if header not provided
  if (!token && req.headers.cookie) {
    try {
      const cookies = parseCookieHeader(req.headers.cookie);
      token = cookies["__session"];
    } catch {
      // cookie parse error
    }
  }

  if (!token) {
    return null;
  }

  try {
    const verified = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });

    const clerkUserId = verified.sub;
    if (!clerkUserId) return null;

    let user = await getUserByClerkId(clerkUserId);
    const now = new Date();

    if (!user && clerkClient) {
      try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || null;
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || "Penulis";
        const avatarUrl = clerkUser.imageUrl || null;
        const username = clerkUser.username || null;

        await upsertUser({
          openId: clerkUserId,
          clerkId: clerkUserId,
          name,
          email,
          avatarUrl,
          username,
          loginMethod: "clerk",
          lastSignedIn: now,
        });

        user = await getUserByClerkId(clerkUserId);
      } catch (err) {
        console.error("[Clerk] Failed to fetch user details from Clerk API:", err);
      }
    } else if (user) {
      await upsertUser({
        openId: user.openId,
        clerkId: user.clerkId ?? clerkUserId,
        lastSignedIn: now,
      });
    }

    return user ?? null;
  } catch (error) {
    console.warn("[Clerk] Token verification failed:", error);
    return null;
  }
}
