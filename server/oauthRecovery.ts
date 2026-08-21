import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";

function queryParam(request: Request, key: string): string | undefined {
  const value = request.query[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * Application-owned OAuth callback registered ahead of framework routes.
 * It preserves the one-time nonce guard but sends interrupted logins back to
 * a recoverable Studio view instead of exposing a raw 403 response.
 */
export function registerOAuthRecoveryRoute(app: Express) {
  app.get("/api/oauth/callback", async (request: Request, response: Response) => {
    const code = queryParam(request, "code");
    const state = queryParam(request, "state");

    if (!code || !state) {
      response.status(400).json({ error: "code and state are required" });
      return;
    }

    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(request.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      response.redirect(303, "/studio?authError=state");
      return;
    }
    response.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        response.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });
      response.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(request), maxAge: ONE_YEAR_MS });
      response.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth recovery] Callback failed", error);
      response.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
