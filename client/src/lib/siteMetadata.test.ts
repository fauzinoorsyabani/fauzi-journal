import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

describe("site metadata", () => {
  it("uses the Fauzi / Journal Indonesian identity in browser metadata", () => {
    expect(indexHtml).toContain('<html lang="id">');
    expect(indexHtml).toContain("<title>Fauzi / Journal — Arsip Keseharian</title>");
    expect(indexHtml).toContain(
      'content="Fauzi / Journal adalah arsip visual tentang catatan lapangan, budaya, dan kerja di balik permukaan."',
    );
  });
});
