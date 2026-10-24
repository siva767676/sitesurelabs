#!/usr/bin/env bash
# Rebuilds every file under public/media from the original 4K product demo recordings.
# Requires ffmpeg. Usage:  SRC=/path/to/recordings ./scripts/encode-media.sh
#
#   anviksha-demo-4k.mp4   -> Anviksha
#   digi-reco-demo_4K.mp4  -> Digi Reco
#   marg-demo-4k.mp4       -> SiteVision
set -euo pipefail

SRC="${SRC:-/d/Siva.S/Desktop/v}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT/stills"

# Full demo: 1080p H.264 + AAC with faststart so the video can start before it finishes downloading.
demo() { ffmpeg -y -v error -i "$SRC/$2" -vf "fps=30,scale=1920:-2" -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$OUT/$1-demo.mp4"; }
# Silent 10 s teaser loop (960 px wide) cut from a segment that shows the real UI.
loop() { ffmpeg -y -v error -ss "$3" -t 10 -i "$SRC/$2" -an -vf "fps=24,scale=960:-2" -c:v libx264 -preset medium -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/$1-loop.mp4"; }
# Still frame (WebP, 1920 px wide) at a timestamp in seconds.
still() { ffmpeg -y -v error -ss "$3" -i "$SRC/$2" -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 "$OUT/stills/$1.webp"; }

A=anviksha-demo-4k.mp4; D=digi-reco-demo_4K.mp4; S=marg-demo-4k.mp4

demo anviksha "$A"; demo digireco "$D"; demo sitevision "$S"
loop anviksha "$A" 66; loop digireco "$D" 40; loop sitevision "$S" 96

still anviksha-defects "$A" 7;     still anviksha-modes "$A" 24;       still anviksha-collection "$A" 60
still anviksha-analysis "$A" 75;   still anviksha-report "$A" 86;      still anviksha-chat "$A" 105
still digireco-bulk "$D" 30;       still digireco-abstract "$D" 54;    still digireco-exceptions "$D" 84
still digireco-grn "$D" 102;       still digireco-dashboard "$D" 114;  still digireco-sites "$D" 126
still sitevision-capture "$S" 24;  still sitevision-floorplan "$S" 30; still sitevision-walkthrough "$S" 56
still sitevision-walkthrough2 "$S" 64; still sitevision-progress "$S" 78; still sitevision-drishti "$S" 98
still sitevision-chat "$S" 106;    still sitevision-cover "$S" 20

echo "media rebuilt in $OUT"
