# Vercel Deployment Research Notes

## Official sources consulted

| Topic | Key finding | Source |
| --- | --- | --- |
| Express deployment | Vercel can deploy an Express application when the app is exported or exposed through a supported server entrypoint. | [Express on Vercel](https://vercel.com/docs/frameworks/backend/express) |
| Static files | Vercel serves static assets from `public/**`; `express.static()` is ignored in the Vercel Express environment. | [Express on Vercel](https://vercel.com/docs/frameworks/backend/express) |
| SPA routing | Same-application rewrites can be defined in root `vercel.json` so direct visits to client-side routes preserve the visible URL. | [Rewrites on Vercel](https://vercel.com/docs/routing/rewrites) |
| Express routing | Vercel's Express guide shows an `/api` entrypoint with `vercel.json` rewrite routing incoming requests to that function. | [Using Express.js with Vercel](https://vercel.com/kb/guide/using-express-with-vercel) |
| Media storage | Vercel Blob supports public storage for images and provides direct URL delivery suitable for publicly displayed editorial media. | [Vercel Blob](https://vercel.com/docs/vercel-blob) |

## Application implications

Fauzi / Journal currently uses a long-running Express bootstrap, Manus-specific runtime plugins, `/manus-storage` image paths, and platform-provided storage credentials. The Vercel adaptation should export a reusable Express app for the Vercel function, build public files into root `public/`, use a rewrite for SPA deep links while preserving `/api/*`, and use public Vercel Blob URLs for editor-uploaded/public imagery. Database, OAuth, and outbound email require external configuration in Vercel project settings.
