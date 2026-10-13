import { describe, expect, it } from "vitest";
import type { ReleaseManifest, ReleaseGraphOptions } from "@foss-earth/about";
import { createFlightReleaseGraph, flightAboutContent } from "../src/core.js";
const manifest: ReleaseManifest = { schemaVersion: 1, host: "@0sfs/simulator", artifacts: [
  { id: "simulator", repository: "0sfs/simulator", package: "@0sfs/simulator", version: "1.0.0", revision: "a".repeat(40), sha256: "b".repeat(64), role: "runtime", availability: "available" },
  { id: "ui", repository: "foss-earth/ui", package: "@foss-earth/ui", version: "1.0.0", revision: "c".repeat(40), sha256: "d".repeat(64), role: "runtime", availability: "available" },
  { id: "optional", repository: "0sfs/logo", role: "reference", availability: "unavailable", reason: "rights unresolved" },
], edges: [{ from: "simulator", to: "ui", type: "runtime", reason: "Installed public UI dependency" }] };
const labels: Omit<ReleaseGraphOptions, "owner"> = {
 title: "Installed Flight artifacts", date: "2026-10-08", summary: "Exact assembly fixture", sourceDocument: "release-manifest.json", sourceLabel: "Installed release", dataFile: "release-graph.json",
 ownership: { artifactOwners: { simulator: "0sfs", ui: "foss-earth", optional: "0sfs" }, allowedOwners: ["0sfs", "foss-earth"], dependencyOwners: { "0sfs": ["0sfs", "foss-earth"], "foss-earth": ["foss-earth"] } },
};
describe("flight release adapter", () => {
 it("reports supplied installed pins and real ownership without loading runtimes", () => {
  const graph = createFlightReleaseGraph(manifest, labels);
  expect(graph.status).toBe("installed"); expect(graph.nodes.find(node => node.id === "ui")?.owner).toBe("foss-earth");
  expect(graph.nodes.find(node => node.id === "simulator")?.artifact?.sha256).toBe("b".repeat(64));
  expect(graph.nodes.find(node => node.id === "optional")?.artifact?.availability).toBe("unavailable");
  expect(flightAboutContent.title).toBe("0sfs"); expect(globalThis).not.toHaveProperty("document");
 });
 it("delegates exact-pin and reverse dependency refusal to the shared contract", () => {
  expect(() => createFlightReleaseGraph({ ...manifest, artifacts: manifest.artifacts.map(item => item.id === "ui" ? { ...item, sha256: undefined } : item) }, labels)).toThrow();
  expect(() => createFlightReleaseGraph({ ...manifest, edges: [{ from: "ui", to: "simulator", type: "runtime", reason: "Forbidden reverse dependency" }] }, labels)).toThrow();
 });
});
