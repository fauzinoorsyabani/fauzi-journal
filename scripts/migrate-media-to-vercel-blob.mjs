import { put } from "@vercel/blob";

const sourceOrigin = (process.env.LEGACY_MEDIA_ORIGIN ?? "https://lensstory-sw8onh5d.manus.space").replace(/\/+$/, "");
const assets = {
  "lensstories-hero.jpg": "/manus-storage/lensstories-hero_12cce36a.jpg",
  "lensstories-people.jpg": "/manus-storage/lensstories-people_497231a3.jpg",
  "lensstories-impact.jpg": "/manus-storage/lensstories-impact_64901fa7.jpg",
  "lensstories-bts.jpg": "/manus-storage/lensstories-bts_e0db8756.jpg",
  "lensstories-mark.png": "/manus-storage/lensstories-mark_71722fa8.png",
};

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("Set BLOB_READ_WRITE_TOKEN or run this after `vercel env pull`.");
}

const uploaded = {};
for (const [filename, sourcePath] of Object.entries(assets)) {
  const response = await fetch(`${sourceOrigin}${sourcePath}`);
  if (!response.ok) throw new Error(`Could not fetch ${filename}: ${response.status}`);
  const blob = await put(`fauzi-journal/${filename}`, Buffer.from(await response.arrayBuffer()), {
    access: "public",
    addRandomSuffix: false,
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
  });
  uploaded[filename] = blob.url;
}

console.log(JSON.stringify(uploaded, null, 2));
