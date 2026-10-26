/**
 * Storage Module — Fauzi / Journal
 * Provides 2 clean, active adapters:
 * 1. Vercel Blob Storage (Production CDN when BLOB_READ_WRITE_TOKEN is set)
 * 2. Data URI Storage (100% Free, Zero-Configuration Offline/Local Fallback)
 */
import { put } from "@vercel/blob";

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  // Adapter 1: Vercel Blob Storage (CDN)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const key = `fauzi-journal/${appendHashSuffix(normalizeKey(relKey))}`;
      const payload = typeof data === "string" || Buffer.isBuffer(data) ? data : Buffer.from(data);
      const uploaded = await put(key, payload, {
        access: "public",
        addRandomSuffix: false,
        contentType,
      });
      return { key: uploaded.pathname, url: uploaded.url };
    } catch (err) {
      console.warn("[Storage] Vercel Blob upload failed, falling back to Data URI:", err);
    }
  }

  // Adapter 2: Data URI Storage (Free Fallback)
  const key = appendHashSuffix(normalizeKey(relKey));
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;
  return { key, url: dataUri };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/storage/${key}` };
}
