import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

describe("site metadata", () => {
  it("uses the Fauzi / Journal identity in the browser title and description", () => {
    expect(indexHtml).toContain("<title>Fauzi / Journal — The Everyday Archive</title>");
    expect(indexHtml).toContain(
      'content="Fauzi / Journal is a visual archive of field notes, culture, and the work beneath the surface."',
    );
  });
});
