import type { Server } from "node:http";
import { encodeOAuthState } from "@shared/const";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForToken = vi.fn().mockRejectedValue(new Error("Mock OAuth provider unavailable"));

vi.mock("./_core/sdk", () => ({
  sdk: { exchangeCodeForToken },
}));

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  process.env.VERCEL = "1";
  const { createApp } = await import("./app");
  server = createApp().listen(0);
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("OAuth test server did not expose a TCP port");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

beforeEach(() => {
  exchangeCodeForToken.mockClear();
});

describe("OAuth callback state guard", () => {
  it("fails closed and redirects to a recoverable Studio state when state does not match a browser cookie", async () => {
    const response = await fetch(`${baseUrl}/api/oauth/callback?code=placeholder-code&state=malformed-state`, { redirect: "manual" });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/studio?authError=state");
    expect(exchangeCodeForToken).not.toHaveBeenCalled();
  });

  it("returns 400 when callback parameters are absent", async () => {
    const response = await fetch(`${baseUrl}/api/oauth/callback`);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "code and state are required" });
  });

  it("accepts a matching browser nonce and reaches only the mocked provider exchange", async () => {
    const state = encodeOAuthState({
      redirectUri: "https://lensstory-sw8onh5d.manus.space/api/oauth/callback",
      nonce: "matching-browser-nonce",
    });
    const response = await fetch(`${baseUrl}/api/oauth/callback?code=placeholder-code&state=${encodeURIComponent(state)}`, {
      headers: { cookie: "__Host-oauth_state=matching-browser-nonce" },
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "OAuth callback failed" });
    expect(exchangeCodeForToken).toHaveBeenCalledWith("placeholder-code", state);
    expect(response.headers.get("set-cookie")).toContain("__Host-oauth_state=");
  });
});
