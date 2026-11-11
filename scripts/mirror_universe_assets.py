"""Mirror the runtime textures of the /universe/ Nuxt app.

The universe bundle builds its texture URLs at runtime from root-absolute
paths (`/image/<name>.png`, `/image/frame/<name>.png`), so the recursive
crawler in mirror.py never saw them. Without them the WebGL sky renders as a
black canvas. This script collects every name referenced by the mirrored
bundle and downloads the images to their live paths under public/.
"""

from __future__ import annotations

import glob
import re
import urllib.request
from pathlib import Path

BASE = "https://metaversalsolution.com"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

BUNDLE_GLOB = "public/mirror/_nuxt/*.js"

# names passed to formattedPrincipleImage()/formattedFrameImage() plus the
# `image:` fields of the principles data used by the sky renderer
PRINCIPLE_RE = re.compile(r'(?:image:"|formattedPrincipleImage\(")([A-Za-z0-9_.-]+\.png)"')
FRAME_RE = re.compile(r'formattedFrameImage\("([A-Za-z0-9_.-]+\.png)"\)')


def fetch(url: str) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.read()
    except Exception as exc:  # noqa: BLE001
        print(f"  ! {url} -> {exc}")
        return None


def collect() -> tuple[set[str], set[str]]:
    principles: set[str] = set()
    frames: set[str] = set()
    for path in glob.glob(BUNDLE_GLOB):
        text = Path(path).read_text(encoding="utf-8", errors="replace")
        principles.update(PRINCIPLE_RE.findall(text))
        frames.update(FRAME_RE.findall(text))
    return principles, frames


def local_path(url_path: str) -> Path:
    """Map a live URL path to where this app serves it.

    /_nuxt and /_next live under public/mirror/ (see next.config.ts rewrites);
    root media such as /image is served straight from public.
    """
    parts = [p for p in url_path.strip("/").split("/") if p]
    if parts and parts[0] in ("_nuxt", "_next"):
        # /_next is reserved by the Vercel output finalizer, so its mirror
        # lives under next-static/ inside public/mirror.
        if parts[0] == "_next":
            parts[0] = "next-static"
        return Path("public", "mirror", *parts)
    return Path("public", *parts)


def download(url_path: str, rewrite: bool = False) -> None:
    dest = local_path(url_path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    data = fetch(BASE + url_path)
    if data is None:
        return
    if rewrite:
        text = data.decode("utf-8", "replace")
        text = text.replace("/_nuxt/", "/mirror/_nuxt/")
        data = text.encode("utf-8")
    dest.write_bytes(data)
    print(f"  {url_path}  {len(data):>7} bytes")


def mirror_chunks() -> None:
    """Download the lazy webpack chunks declared by the Nuxt runtime.

    The runtime builds `f.p + <hash> + ".js"` from a hash map, so the crawler
    could not see these URLs. Without them the sky renderer never boots.
    """
    runtime = Path("public/mirror/_nuxt/74d6a05.js")
    text = runtime.read_text(encoding="utf-8", errors="replace")
    match = re.search(r'\{(0:"[0-9a-f]+",(?:\d+:"[0-9a-f]+",?)+)\}\s*\[e\]\+"\.js"', text)
    if not match:
        print("  ! chunk map not found")
        return
    hashes = re.findall(r'"([0-9a-f]{7})"', match.group(1))
    print(f"chunks ({len(hashes)}):")
    for chunk in hashes:
        download(f"/_nuxt/{chunk}.js", rewrite=True)


AUDIO_RE = re.compile(r'[A-Z][A-Z0-9_]{3,}:"([a-z0-9_]+)"')


def mirror_audio() -> None:
    """The universe plays ambient/music cues from /audio/sound/<key>.mp3."""
    names: set[str] = set()
    for path in glob.glob(BUNDLE_GLOB):
        text = Path(path).read_text(encoding="utf-8", errors="replace")
        names.update(AUDIO_RE.findall(text))
    print(f"audio ({len(names)} candidate keys):")
    for name in sorted(names):
        download(f"/audio/sound/{name}.mp3")


def mirror_chunk_images() -> None:
    """Fetch webpack-emitted images referenced by the chunk bundles."""
    refs: set[str] = set()
    for path in glob.glob("public/mirror/_nuxt/*.js"):
        text = Path(path).read_text(encoding="utf-8", errors="replace")
        refs.update(re.findall(r'"(img/[A-Za-z0-9_.-]+\.(?:png|jpe?g|webp|svg|gif))"', text))
    if not refs:
        return
    print(f"chunk images ({len(refs)}):")
    for ref in sorted(refs):
        download(f"/_nuxt/{ref}")


def main() -> None:
    principles, frames = collect()
    # the keyhole uses a plain key icon next to the frame assets
    principles.add("key.png")
    print(f"principles ({len(principles)}):")
    for name in sorted(principles):
        download(f"/image/{name}")
    print(f"frames ({len(frames)}):")
    for name in sorted(frames):
        download(f"/image/frame/{name}")
    mirror_chunks()
    mirror_chunk_images()
    mirror_audio()
    total = sum(
        p.stat().st_size for p in Path("public/image").rglob("*") if p.is_file()
    )
    print(f"total image payload: {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "audio":
        mirror_audio()
    else:
        main()
