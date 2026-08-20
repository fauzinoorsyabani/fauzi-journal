import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

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

describe("OAuth callback state guard", () => {
  it("fails closed with 403 before any external token exchange when state does not match a browser cookie", async () => {
    const response = await fetch(`${baseUrl}/api/oauth/callback?code=placeholder-code&state=malformed-state`);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "invalid oauth state" });
  });

  it("returns 400 when callback parameters are absent", async () => {
    const response = await fetch(`${baseUrl}/api/oauth/callback`);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "code and state are required" });
  });
});
