#!/usr/bin/env bash
# usage: matrix.sh <base-url> [expected-sitemap-count]
# Runs the HTTP status / redirect / header matrix. Exit 1 on any failure.
BASE="${1:-http://127.0.0.1:8081}"
WANT_URLS="${2:-13}"
FAIL=0
t() { # path wantStatus [wantLocation]
  code=$(curl -s -o /tmp/mb -D /tmp/mh -w '%{http_code}' "$BASE$1")
  loc=$(grep -i '^location:' /tmp/mh | head -1 | sed 's/^[Ll]ocation: *//' | tr -d '\r')
  if [ "$code" != "$2" ] || { [ -n "${3:-}" ] && [ "$loc" != "$3" ]; }; then echo "FAIL $1 got $code '$loc' want $2 '${3:-}'"; FAIL=1; else echo "ok   $1 $code $loc"; fi
}
hdr() { grep -qi "$1" /tmp/mh && echo "ok   header: $1" || { echo "FAIL missing header: $1"; FAIL=1; }; }
body() { grep -q "$1" /tmp/mb && echo "ok   body has: $1" || { echo "FAIL body lacks: $1"; FAIL=1; }; }

t / 200; hdr 'content-security-policy'; hdr 'x-frame-options'; hdr 'x-content-type-options'; hdr 'referrer-policy'; hdr 'permissions-policy'; hdr 'cache-control: no-cache'; body '<h1'
for p in /products /services /about /contact /blog /products/anviksha /products/site-vision /products/digi-reco /products/parichay /blog/digital-construction-inspection-guide /blog/manual-vs-ai-construction-inspection /blog/360-degree-construction-documentation; do t "$p" 200; body '<h1'; done
t /about 200; body 'rel="canonical" href="https://sitesurelabs.com/about"'
t /products/progress-tracker 200; body 'noindex'
t /privacy 200; body 'noindex'; t /terms 200; body 'noindex'
t /about/ 301 /about
t /about/index.html 301 /about
t /index.html 301 /
t '/about/?x=1' 301 '/about?x=1'
t /products/sitevision 301 /products/site-vision
t /products/sitevision/ 301 /products/site-vision
t /products/does-not-exist 404; body 'noindex'
t /nope 404; t /blog/nope 404; t /404.html 404
t /sitemap.xml 200; N=$(grep -o '<loc>' /tmp/mb | wc -l); [ "$N" = "$WANT_URLS" ] && echo "ok   sitemap has $N urls" || { echo "FAIL sitemap has $N urls, want $WANT_URLS"; FAIL=1; }
t /robots.txt 200; t /llms.txt 200
if [ -n "${ASSET:-}" ]; then t "/assets/$ASSET" 200; hdr 'immutable'; hdr 'content-security-policy'; fi
t /assets/missing.js 404
t /media/anviksha-demo-720.mp4 200; hdr 'content-security-policy'; hdr 'accept-ranges'
t /media/anviksha-demo.mp4 200
t /api/health 502; hdr 'x-robots-tag: noindex'
if [ "$FAIL" != "0" ]; then echo "== MATRIX FAILED"; exit 1; fi
echo "== MATRIX PASSED"
