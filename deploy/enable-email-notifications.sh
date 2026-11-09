#!/usr/bin/env bash
# Turn on e-mail notifications for enquiries on the production server, using Amazon SES.
#
# Run it ON THE SERVER (EC2 instance "SiteSureLabs"), as a user that can run docker, from anywhere:
#     sudo bash enable-email-notifications.sh
#
# It asks for the SES SMTP username and password. The password is typed hidden and is written only to the server's
# .env file (mode 600). It is never printed, logged or put on a command line. Before changing anything it backs up .env;
# if the test e-mail does not go through it restores the backup and restarts the API, so the site is left as it was.
#
# Create the credentials first: AWS console > Amazon SES (region Asia Pacific (Mumbai)) > SMTP settings > Create SMTP
# credentials. See docs/EMAIL_NOTIFICATIONS.md.
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/sitesurelabs}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
API_CONTAINER="${API_CONTAINER:-sitesurelabs-api-1}"
DEFAULT_TO="mhcai@myhomeconstructions.com"
DEFAULT_FROM="SiteSureLabs <noreply@sitesurelabs.com>"
DEFAULT_HOST="email-smtp.ap-south-1.amazonaws.com"
SKIP_DOCKER="${SKIP_DOCKER:-0}"   # tests only: edit the file, touch nothing else

# set_env KEY VALUE : replace the KEY= line (if there is one) or append it. The value is single-quoted so $, spaces and
# < > in it are kept literally by docker compose.
set_env() {
  local key="$1" value="$2" tmp
  case "$value" in *"'"*) echo "A value for $key contains a single quote, which this script does not support."; exit 1;; esac
  tmp="$(mktemp)"
  # ENVIRON (not awk -v) so backslashes and $ in the value are kept exactly as typed
  SET_KEY="$key" SET_VAL="$value" awk '
    BEGIN { k = ENVIRON["SET_KEY"]; v = ENVIRON["SET_VAL"]; done = 0 }
    index($0, k "=") == 1 { if (!done) { print k "=\047" v "\047"; done = 1 }; next }
    { print }
    END { if (!done) print k "=\047" v "\047" }
  ' "$ENV_FILE" > "$tmp"
  cat "$tmp" > "$ENV_FILE"
  rm -f "$tmp"
}

[ -f "$ENV_FILE" ] || { echo "Cannot find $ENV_FILE"; exit 1; }
if [ "$SKIP_DOCKER" != "1" ]; then
  docker inspect "$API_CONTAINER" >/dev/null 2>&1 || { echo "Cannot find the API container $API_CONTAINER (is docker running, and are you root?)"; exit 1; }
fi

if [ "${NONINTERACTIVE:-0}" = "1" ]; then   # tests only
  SMTP_USER="${TEST_SMTP_USER:?}"; SMTP_PASS="${TEST_SMTP_PASS:?}"
else
  read -r -p "SES SMTP username (starts with AKIA): " SMTP_USER
  read -r -s -p "SES SMTP password (typing is hidden): " SMTP_PASS; echo
fi
[ -n "$SMTP_USER" ] && [ -n "$SMTP_PASS" ] || { echo "Both the username and the password are required."; exit 1; }

BACKUP="$ENV_FILE.bak-$(date +%Y%m%d-%H%M%S)"
cp -p "$ENV_FILE" "$BACKUP"
chmod 600 "$ENV_FILE" "$BACKUP"
echo "Backup of .env saved as $BACKUP"

set_env NOTIFY_TO "${NOTIFY_TO_OVERRIDE:-$DEFAULT_TO}"
set_env NOTIFY_FROM "$DEFAULT_FROM"
set_env SMTP_HOST "$DEFAULT_HOST"
set_env SMTP_PORT "587"
set_env SMTP_USERNAME "$SMTP_USER"
set_env SMTP_PASSWORD "$SMTP_PASS"
unset SMTP_PASS
echo "Settings written (recipient: ${NOTIFY_TO_OVERRIDE:-$DEFAULT_TO}, server: $DEFAULT_HOST:587)."

if [ "$SKIP_DOCKER" = "1" ]; then echo "SKIP_DOCKER=1: file edited, nothing restarted."; exit 0; fi

restore() {
  echo "!! Restoring the previous .env and restarting the API"
  cp -p "$BACKUP" "$ENV_FILE"
  (cd "$APP_DIR" && docker compose up -d --no-build --no-deps api) >/dev/null 2>&1 || true
  echo "Restored. The site is as it was before this script."
  exit 1
}

echo "Restarting the API container (a few seconds; the database volume is untouched)..."
(cd "$APP_DIR" && docker compose up -d --no-build --no-deps api) 2>&1 | tail -3
ST=starting
for _ in $(seq 1 45); do ST="$(docker inspect "$API_CONTAINER" --format '{{.State.Health.Status}}' 2>/dev/null || echo none)"; [ "$ST" = healthy ] && break; sleep 2; done
echo "API health: $ST"
[ "$ST" = healthy ] || restore

echo "--- notification settings seen by the API (no secrets):"
docker exec "$API_CONTAINER" python -m app.cli status 2>&1 | grep -E "smtp server|credentials|from|to |configured|problem|enquiries" || true
echo "--- sending a test e-mail to the recipient..."
if docker exec "$API_CONTAINER" python -m app.cli send-test; then
  echo
  echo "DONE. Check the inbox of ${NOTIFY_TO_OVERRIDE:-$DEFAULT_TO} (and its spam folder) for: [SiteSureLabs] test e-mail from the website (production)."
  echo "Enquiries from the website will now be e-mailed there. Backup kept at $BACKUP (it contains the OLD password state; delete it when you are happy)."
else
  echo "The test e-mail failed (see the error above)."
  restore
fi
