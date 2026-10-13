import { graphFromReleaseManifest, type ReleaseManifest, type ReleaseGraphOptions } from "@foss-earth/about";
export { flightAboutContent } from "./content.js";

/** Consume the same exact assembly snapshot as package resolution, without importing its runtimes. */
export function createFlightReleaseGraph(manifest: ReleaseManifest, options: Omit<ReleaseGraphOptions, "owner">) {
  return graphFromReleaseManifest(manifest, { ...options, owner: "0sfs" });
}
