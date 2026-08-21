import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";
import { registerOAuthRoutes } from "./_core/oauth.js";
import { registerOAuthRecoveryRoute } from "./oauthRecovery.js";
import { registerStorageProxy } from "./_core/storageProxy.js";

/**
 * Shared Express application.
 * Exporting the app lets Vercel run it as a serverless function without opening a port.
 */
export function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Retain the legacy proxy only on the Manus runtime. Vercel media uses direct Blob URLs.
  if (!process.env.VERCEL) registerStorageProxy(app);
  registerOAuthRecoveryRoute(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}

const app = createApp();
export default app;
