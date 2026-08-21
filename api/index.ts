import type { RequestHandler } from "express";

/**
 * Vercel Function entrypoint for tRPC, OAuth, and editorial upload routes.
 * The application is imported inside the request handler so an unexpected
 * startup failure can return a controlled service response instead of causing
 * Vercel to terminate the entire function invocation.
 */
const handler: RequestHandler = async (request, response, next) => {
  try {
    const { default: app } = await import("../server/app");
    return app(request, response, next);
  } catch (error) {
    console.error("[Vercel API] Unable to initialize application", error);
    response.status(503).json({ error: "API initialization unavailable" });
  }
};

export default handler;
