import { createAboutPanel, type AboutPanelOptions, type AboutPanelHandle } from "@foss-earth/about/panel";
import { flightAboutContent } from "./content.js";

/** The shared viewer owns DOM rendering; the host supplies all build/version/deploy data. */
export function createFlightAboutPanel(options: Omit<AboutPanelOptions, "title">): AboutPanelHandle {
  const handle = createAboutPanel({ ...options, title: flightAboutContent.title });
  try {
  const document = options.document ?? globalThis.document;
  const content = document.createElement("section");
  const text = document.createElement("p"); text.textContent = flightAboutContent.description;
  content.append(text);
  const links = document.createElement("p");
  for (const item of flightAboutContent.links) {
    const link = document.createElement("a"); link.textContent = item.label; link.href = item.href;
    link.target = "_blank"; link.rel = "noopener noreferrer";
    links.append(link, document.createTextNode(" "));
  }
  content.append(links);
  handle.element.prepend(content);
  return handle;
  } catch (error) {
    try { handle.dispose(); } catch (cleanup) { throw new AggregateError([error, cleanup], "Flight About content and cleanup failed"); }
    throw error;
  }
}
