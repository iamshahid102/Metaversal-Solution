"""Mirror the current metaversalsolution.com production build.

The live site ships a Next.js App Router client build plus a self-contained
Nuxt app at /universe/. To reproduce its animations and 3D scene exactly, the
build's own HTML, CSS and JS are served from /mirror/* and wired to the public
routes by next.config.ts.

Rewrites performed:
  /_next/  -> /mirror/_next/
  /_nuxt/  -> /mirror/_nuxt/
and an early click handler forces full-page navigation so the mirrored Next
router never asks this server for RSC payloads it cannot provide.
"""

from __future__ import annotations

import os
import posixpath
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = "https://metaversalsolution.com"
OUT = os.path.join("public", "mirror")
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

PAGES = {
    "home": "/",
    "services": "/services",
    "products": "/products",
    "about": "/about",
    "projects": "/projects",
    "contact": "/contact",
    "ai-fraud-detection": "/projects/ai-fraud-detection",
    "zurbez": "/projects/zurbez",
    "aws-devops-pipeline": "/projects/aws-devops-pipeline",
    "nouvelle-spaces": "/projects/nouvelle-spaces",
    "fabric-data-infrastructure": "/projects/fabric-data-infrastructure",
    "safar": "/projects/safar",
}

FORCE_MPA = b"""<script>(function(){document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var u;try{u=new URL(a.getAttribute('href'),location.href)}catch(_){return}if(u.origin!==location.origin||u.hash&&u.pathname===location.pathname)return;if(a.target&&a.target!=='_self')return;if(a.hasAttribute('download'))return;e.preventDefault();e.stopPropagation();location.assign(u.href);},true);})();</script>"""

seen: set[str] = set()
queue: list[str] = []
missing: list[str] = []
downloaded: list[tuple[str, int]] = []


def resolve(path: str, ref: str) -> str:
    if ref.startswith("/mirror/"):
        return posixpath.normpath(ref)
    if ref.startswith("/"):
        return "/mirror" + ref
    base = posixpath.dirname(path)
    return posixpath.normpath(posixpath.join(base, ref))


def enqueue(path: str) -> None:
    path = path.split("#")[0].split("?")[0].rstrip("/")
    if not path.startswith("/mirror/"):
        return
    if path in seen or path in queue:
        return
    queue.append(path)


def fetch(url: str) -> bytes:
    last: Exception | None = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as exc:  # noqa: BLE001
            last = exc
            time.sleep(0.6 * (attempt + 1))
    raise RuntimeError(f"failed {url}: {last}")


def save(path: str, data: bytes) -> None:
    parts = [p for p in path.strip("/").split("/") if p]
    dest = Path("public", *parts)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    downloaded.append((path, len(data)))


def rewrite(text: str) -> str:
    # inline flight payloads escape slashes, so handle \/_next\/ as well
    text = text.replace("\\/_next\\/", "\\/mirror\\/_next\\/")
    text = text.replace("\\/_nuxt\\/", "\\/mirror\\/_nuxt\\/")
    text = text.replace("\\/_next/", "\\/mirror\\/_next/")
    text = text.replace("\\/_nuxt/", "\\/mirror\\/_nuxt/")
    return text.replace("/_next/", "/mirror/_next/").replace("/_nuxt/", "/mirror/_nuxt/")


ABS_RE = re.compile(r"[\"'(](/mirror/(?:_next|_nuxt)/[^\"')?#]+)")
REL_RE = re.compile(r"[\"'](\.{1,2}/[^\"')?#]+\.(?:js|mjs|css|woff2?|png|webp|svg|json))[\"']")
IMPORT_RE = re.compile(r"(?:from|import\s*\(|require\s*\()\s*[\"'](\.{1,2}/[^\"']+)[\"']")


def harvest(path: str, text: str, kind: str) -> None:
    for m in ABS_RE.finditer(text):
        enqueue(m.group(1))
    if kind == "js":
        for m in REL_RE.finditer(text):
            enqueue(resolve(path, m.group(1)))
    if kind == "css":
        for m in re.finditer(r"url\(([^)]+)\)", text):
            ref = m.group(1).strip().strip("'\"")
            if ref.startswith(("data:", "http:", "https:", "#")):
                continue
            enqueue(resolve(path, ref))


def mirror_pages() -> None:
    for name, route in PAGES.items():
        html = fetch(BASE + route).decode("utf-8", "replace")
        html = rewrite(html)
        html = html.replace("<head>", "<head>" + FORCE_MPA.decode(), 1)
        save(f"/mirror/pages/{name}.html", html.encode("utf-8"))
        harvest(f"/mirror/pages/{name}.html", html, "html")
        # absolute media that lives outside /_next (images, brand, fonts)
        for m in re.finditer(r"src=\"(/(?:projects|images|brand|fonts)/[^\"]+\.(?:webp|png|jpe?g|svg|ico|woff2?))\"", html):
            url = m.group(1)
            local = "public" + url
            if not os.path.exists(local):
                try:
                    save("/mirror-media" + url, fetch(BASE + url))
                    os.replace("public/mirror-media" + url, local)
                except Exception as exc:  # noqa: BLE001
                    missing.append(f"{url} ({exc})")


def mirror_universe() -> None:
    html = fetch(BASE + "/universe/index.html").decode("utf-8", "replace")
    html = rewrite(html)
    save("/mirror/universe/index.html", html.encode("utf-8"))
    harvest("/mirror/universe/index.html", html, "html")


def drain() -> None:
    while queue:
        path = queue.pop(0)
        if path in seen:
            continue
        seen.add(path)
        url = BASE + path[len("/mirror") :]
        try:
            data = fetch(url)
        except Exception as exc:  # noqa: BLE001
            missing.append(f"{path} ({exc})")
            continue
        kind = "bin"
        if path.endswith((".js", ".mjs")):
            kind = "js"
            text = data.decode("utf-8", "replace")
            text = rewrite(text)
            data = text.encode("utf-8")
        elif path.endswith(".css"):
            kind = "css"
            text = rewrite(data.decode("utf-8", "replace"))
            data = text.encode("utf-8")
        elif path.endswith((".html", ".json")):
            kind = "html"
            text = rewrite(data.decode("utf-8", "replace"))
            data = text.encode("utf-8")
        try:
            save(path, data)
        except OSError as exc:
            missing.append(f"{path} (save: {exc})")
            continue
        if kind in ("js", "css", "html"):
            harvest(path, data.decode("utf-8", "replace"), kind)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    mirror_pages()
    mirror_universe()
    drain()
    total = sum(size for _, size in downloaded)
    print(f"downloaded {len(downloaded)} files, {total / 1024 / 1024:.2f} MB")
    print(f"missing: {len(missing)}")
    for item in missing[:20]:
        print("  !", item)
    leftovers = []
    for root, _, files in os.walk(OUT):
        for f in files:
            if f.endswith((".html", ".js", ".css")):
                p = os.path.join(root, f)
                text = open(p, encoding="utf-8", errors="replace").read()
                if re.search(r"[\"'(]/_(?:next|nuxt)/", text):
                    leftovers.append(p)
    print(f"unrewritten asset urls in {len(leftovers)} files")
    for p in leftovers[:10]:
        print("  ~", p)


if __name__ == "__main__":
    main()
