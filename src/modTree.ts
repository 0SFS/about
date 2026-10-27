/** Renders active mods into the About dependency tree, in the same nested rows as the build. */

export interface ModDependencyPart {
  name: string;
  from: "mod";
  version?: string;
  commit?: string;
  repository?: string;
  history?: readonly { hash: string; at: string; subject: string }[];
  listedAbove?: boolean;
  parts?: readonly ModDependencyPart[];
}

function element(document: Document, tag: string, className: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderPart(document: Document, part: ModDependencyPart, seen: Map<string, HTMLElement>): HTMLElement {
  const item = element(document, "li", "foss-earth-about__part");
  const key = `${part.name}@${part.version ?? ""}@${part.repository ?? ""}`;
  if (part.listedAbove) {
    const row = element(document, "div", "foss-earth-about__row");
    row.append(element(document, "span", "foss-earth-about__name", part.name));
    const above = element(document, "button", "foss-earth-about__above", "same copy as above");
    above.setAttribute("type", "button");
    above.addEventListener("click", () => {
      const target = seen.get(key);
      target?.scrollIntoView?.({ block: "nearest" });
      target?.querySelector<HTMLElement>("summary")?.focus();
    });
    row.append(above);
    item.append(row);
    return item;
  }
  const details = element(document, "details", "foss-earth-about__details");
  seen.set(key, details);
  const summary = element(document, "summary", "foss-earth-about__row");
  summary.append(element(document, "span", "foss-earth-about__name", part.name));
  if (part.version) summary.append(element(document, "span", "foss-earth-about__version", part.version));
  details.append(summary);
  const body = element(document, "div", "foss-earth-about__body");
  body.append(element(document, "p", "foss-earth-about__line", "Mod."));
  if (part.repository) {
    const link = element(document, "a", "foss-earth-about__link", "Source");
    link.setAttribute("href", part.repository);
    link.setAttribute("rel", "noopener noreferrer");
    body.append(link);
  }
  if (part.commit) body.append(element(document, "p", "foss-earth-about__line", part.commit));
  if (part.parts?.length) {
    const list = element(document, "ul", "foss-earth-about__parts");
    list.setAttribute("role", "list");
    list.append(...part.parts.map(child => renderPart(document, child, seen)));
    body.append(list);
  }
  details.append(body);
  item.append(details);
  return item;
}

/** Appends mod rows under the About "Built from" list, or as their own list when that list is absent. */
export function appendModDependencyTree(host: HTMLElement, parts: readonly ModDependencyPart[], document = host.ownerDocument): void {
  if (parts.length === 0) return;
  const existing = host.querySelector(".foss-earth-about__parts") ?? host.querySelector(".foss-earth-about__tree");
  const list = existing instanceof HTMLElement && existing.tagName === "UL"
    ? existing
    : element(document, "ul", "foss-earth-about__parts");
  if (!list.parentElement) {
    host.append(element(document, "h3", "foss-earth-about__heading", "Mods"));
    list.setAttribute("role", "list");
    host.append(list);
  }
  const seen = new Map<string, HTMLElement>();
  list.append(...parts.map(part => renderPart(document, part, seen)));
}
