# Host nginx config for sitesurelabs.com (applied 2026-11-09)

`sitesurelabs.conf` is a copy of `/etc/nginx/sites-available/sitesurelabs.conf` on the production EC2 instance
(`i-0a0585c546363305e`). It is the TLS-terminating nginx in front of the Docker containers (it proxies to `127.0.0.1:8080`).

What changed on 2026-11-09:
- `https://www.sitesurelabs.com/...` and `http://www.sitesurelabs.com/...` answer with **one** permanent redirect (301) to
  `https://sitesurelabs.com/...`, keeping the path and query string.
- `http://sitesurelabs.com/...` redirects to HTTPS in one hop (it used to return 404 for other hosts).
- `Strict-Transport-Security: max-age=31536000` is sent on the main host (no `includeSubDomains` or `preload` yet).

Checked after applying: `nginx -t`, 10 redirect and header checks, and the 65-check matrix against the public site; both
containers untouched and healthy. The certificate already covers both names (valid to 27 Jan 2027).

**Rollback (on the server, as root):**

```bash
cp -p /etc/nginx/sites-available/sitesurelabs.conf.bak-20261109 /etc/nginx/sites-available/sitesurelabs.conf && nginx -t && systemctl reload nginx
```

Notes: browsers remember HSTS for a year, so keep HTTPS working. Adding `includeSubDomains` or `preload` later is a separate,
harder-to-undo decision. `systemctl` prints a harmless "unit file changed on disk, run daemon-reload" notice on this host that
is unrelated to this change.
