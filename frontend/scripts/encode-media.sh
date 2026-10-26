#!/usr/bin/env bash
# Rebuilds every file under public/media from the original 4K product demo recordings.
# Requires ffmpeg. Usage:  SRC=/path/to/recordings ./scripts/encode-media.sh
#                       ONLY=variants ./scripts/encode-media.sh   (just the 960/1280 px copies of the stills)
#
#   anviksha-demo-4k.mp4   -> Anviksha
#   digi-reco-demo_4K.mp4  -> Digi Reco
#   marg-demo-4k.mp4       -> SiteVision
#   parichay-demo-4k.mp4   -> Parichay
# A recording that is not in SRC is skipped, so one product can be rebuilt without the others.
set -euo pipefail

SRC="${SRC:-/d/Siva.S/Desktop/v}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT/stills"

# Full demo: 1080p H.264 + AAC with faststart so the video can start before it finishes downloading.
demo() { ffmpeg -y -v error -i "$SRC/$2" -vf "fps=30,scale=1920:-2" -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$OUT/$1-demo.mp4"; }
# Still frame (WebP, 1920 px wide) at a timestamp in seconds.
still() { ffmpeg -y -v error -ss "$3" -i "$SRC/$2" -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 "$OUT/stills/$1.webp"; }

A=anviksha-demo-4k.mp4; D=digi-reco-demo_4K.mp4; S=marg-demo-4k.mp4; P=parichay-demo-4k.mp4
have() { [ -f "$SRC/$1" ] || { echo "skipping $1 (not in $SRC)"; return 1; }; }

# Smaller copies of every still (960 and 1280 px wide) for phones. Pages pick one with srcset (see src/lib/images.ts).
# Derived from the 1920 px stills, so ONLY=variants can run without the source recordings.
variants() {
  local f b
  for f in "$OUT"/stills/*.webp; do
    case "$f" in *-960.webp|*-1280.webp) continue ;; esac
    b="${f%.webp}"
    [ "$b-960.webp" -nt "$f" ] && [ "$b-1280.webp" -nt "$f" ] && continue
    ffmpeg -y -v error -i "$f" -vf "scale=960:-2"  -c:v libwebp -quality 76 "$b-960.webp"
    ffmpeg -y -v error -i "$f" -vf "scale=1280:-2" -c:v libwebp -quality 78 "$b-1280.webp"
  done
}
if [ "${ONLY:-}" = "variants" ]; then variants; echo "still variants rebuilt in $OUT/stills"; exit 0; fi

if have "$A"; then
  demo anviksha "$A"
  still anviksha-defects "$A" 7;     still anviksha-modes "$A" 24;       still anviksha-collection "$A" 60
  still anviksha-analysis "$A" 75;   still anviksha-report "$A" 86;      still anviksha-chat "$A" 105
fi
if have "$D"; then
  demo digireco "$D"
  still digireco-bulk "$D" 30;       still digireco-abstract "$D" 54;    still digireco-exceptions "$D" 84
  still digireco-grn "$D" 102;       still digireco-dashboard "$D" 114;  still digireco-sites "$D" 126
fi
if have "$S"; then
  demo sitevision "$S"
  still sitevision-capture "$S" 24;  still sitevision-floorplan "$S" 30; still sitevision-walkthrough "$S" 56
  still sitevision-walkthrough2 "$S" 64; still sitevision-progress "$S" 78; still sitevision-drishti "$S" 98
  still sitevision-chat "$S" 106;    still sitevision-cover "$S" 20
fi
if have "$P"; then
  demo parichay "$P"
  still parichay-title "$P" 12;      still parichay-register "$P" 30;    still parichay-photo "$P" 45
  still parichay-duplicate "$P" 53;  still parichay-pass "$P" 60;        still parichay-batch "$P" 68
  still parichay-dashboard "$P" 94
fi

variants
echo "media rebuilt in $OUT"
