import fs from "node:fs";
import path from "node:path";

/**
 * The captured DOM for each route lives in /content/pages. Serving the markup
 * as-is keeps the original structure and class hooks, which is what the ported
 * production stylesheet targets.
 */
export function getPageHtml(name: string): string {
  const file = path.join(process.cwd(), "content", "pages", `${name}.html`);
  return fs.readFileSync(file, "utf8");
}
