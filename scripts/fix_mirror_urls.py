"""Make every asset URL inside the mirror point at /mirror/*.

Next's inline flight payload escapes slashes (\\/_next\\/...), so a plain
string replace misses them. This script normalizes both the escaped and raw
forms, idempotently, and reports anything left behind.
"""

from __future__ import annotations

import glob
import re

BS = chr(92)
FILES = [
    f
    for f in glob.glob("public/mirror/**/*", recursive=True)
    if f.endswith((".html", ".js", ".css", ".json"))
]


def variants(prefix: str) -> list[str]:
    raw = "/" + prefix + "/"
    esc = BS + "/" + prefix + BS + "/"
    mixed = BS + "/" + prefix + "/"
    return [esc, mixed, raw]


def normalize(text: str, prefix: str) -> tuple[str, int]:
    changes = 0
    mirrored = "/mirror/" + prefix + "/"
    for form in variants(prefix):
        token = "\x00" + prefix + "\x00"
        # protect already-mirrored escaped forms
        if form.startswith(BS):
            already = BS + "/mirror" + BS + "/" + prefix + BS + "/"
            text = text.replace(already, token)
            changes += text.count(form)
            text = text.replace(form, BS + "/mirror" + BS + "/" + prefix + BS + "/")
            text = text.replace(token, already)
        else:
            already = "/mirror/" + prefix + "/"
            text = text.replace(already, token)
            changes += text.count(form)
            text = text.replace(form, already)
            text = text.replace(token, already)
    return text, changes


total = 0
for path in FILES:
    text = open(path, encoding="utf-8", errors="replace").read()
    before = text
    for prefix in ("_next", "_nuxt"):
        text, _ = normalize(text, prefix)
    if text != before:
        open(path, "w", encoding="utf-8").write(text)
        total += 1

print(f"normalized {total} files")

# diagnostics: any _next/_nuxt reference not immediately under /mirror/
bad = []
for path in FILES:
    text = open(path, encoding="utf-8", errors="replace").read()
    for m in re.finditer(r"_next", text):
        ctx = text[max(0, m.start() - 10) : m.start() + 10]
        if "/mirror/_next" not in ctx and "/mirror" + BS + "/_next" not in ctx:
            bad.append((path, repr(ctx)))
            break
print(f"files with unmirrored _next: {len(bad)}")
for item in bad[:5]:
    print(" !", item)

for path in ["public/mirror/pages/home.html", "public/mirror/universe/index.html"]:
    text = open(path, encoding="utf-8", errors="replace").read()
    esc = text.count(BS + "/_next" + BS) + text.count(BS + "/_nuxt" + BS)
    raw = len(re.findall(r"(?<!mirror)/(?:_next|_nuxt)/", text))
    print(path, "escaped:", esc, "raw:", raw, "bytes:", len(text))
