# Enquiry e-mail notifications

When a visitor sends the Contact form, the website **stores the enquiry first**, then e-mails it to the team. A failed
e-mail never loses an enquiry: the failure is recorded on the stored row and the enquiry can be sent again.

- Recipient: `mhcai@myhomeconstructions.com` (set with `NOTIFY_TO`; several addresses can be separated with commas).
- Sender: `SiteSureLabs <noreply@sitesurelabs.com>` (set with `NOTIFY_FROM`). `sitesurelabs.com` is a verified Amazon SES domain.
- **Replying to the e-mail answers the visitor**: the visitor's address is the `Reply-To`.
- Subject: `[SiteSureLabs] demo enquiry from Asha Rao (Acme Builders) [SSL-1A2B3C4D]`. The reference matches the stored enquiry.
  In any environment other than production the subject starts with `[development]` or `[test]`, so a test message is never mistaken for a real enquiry.

## How it works

1. `POST /api/enquiries` validates, abuse-checks and **stores** the enquiry, and answers the visitor immediately.
2. A background task sends the e-mail over SMTP (and calls the webhook, if `WEBHOOK_URL` is set).
3. Temporary failures (network, 4xx replies) are retried twice (after 2 s and 8 s). Wrong credentials and rejected senders are not retried.
4. The outcome is saved on the enquiry: `notified` and `notify_error` (the error type and SMTP code only, never a message text or a secret).
5. `python -m app.cli resend-pending` sends everything that was not delivered, once.

Safety details: line breaks in a visitor's name cannot inject e-mail headers; the connection to the SMTP server uses TLS and
**verifies the server's certificate before credentials are sent**; no password is logged or printed anywhere.

## Development (nothing real is ever sent)

```bash
docker compose -f docker-compose.dev.yml up -d mailpit      # local mail catcher; web UI at http://localhost:8025
```

In `backend/.env`:

```
NOTIFY_TO=mhcai@myhomeconstructions.com
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_STARTTLS=false
```

Run the API, submit the form on the local site, and open http://localhost:8025 to see the message. Mailpit keeps mail in
memory only and accepts everything, so no real mailbox can receive a development message.

Tests: `cd backend && pytest`. They use a fake SMTP server and never connect to a real one.

## Production (Amazon SES, region ap-south-1 / Mumbai)

What is already in place (checked 2026-11-09): SES is **out of the sandbox** (production access, 50,000 e-mails per day, healthy),
and the domain `sitesurelabs.com` is a **verified identity**, so the sender above works for any recipient.

What is needed: **SES SMTP credentials** for the server. Create them once:

1. AWS console, **Amazon SES**, region **Asia Pacific (Mumbai)**.
2. **SMTP settings** (left menu) > **Create SMTP credentials**.
3. Keep the suggested IAM user name (or use `ses-smtp-sitesurelabs`) > **Create user**.
4. **Download the credentials** (or copy the two values). They are shown once. They are an SMTP user name (starts with `AKIA`) and an SMTP password.
   These are not your normal AWS keys; the IAM user can only send e-mail.

Then, on the server (EC2 instance "SiteSureLabs"; use EC2 > Connect > Session Manager), copy `deploy/enable-email-notifications.sh`
to the server and run:

```bash
sudo bash enable-email-notifications.sh
```

It asks for the SMTP user name and password (the password is typed hidden), backs up `.env`, writes the settings, restarts only the
API container, sends a test e-mail to `mhcai@myhomeconstructions.com`, and **restores the old `.env` automatically if the test fails**.
The secrets go only into the server's `.env` (mode 600). Do not paste them into chat, tickets or the repository.

Afterwards, check the inbox of `mhcai@myhomeconstructions.com` (and the spam folder, the first time) for
`[SiteSureLabs] test e-mail from the website (production)`. If your mail system filters new senders, mark `noreply@sitesurelabs.com` as safe.

## Operating it

Run inside the API container on the server:

```bash
docker exec sitesurelabs-api-1 python -m app.cli status                 # settings (no secrets) + how many enquiries are undelivered
docker exec sitesurelabs-api-1 python -m app.cli send-test              # send a test message
docker exec sitesurelabs-api-1 python -m app.cli resend-pending --dry-run
docker exec sitesurelabs-api-1 python -m app.cli resend-pending         # send what was missed
curl -s https://sitesurelabs.com/api/health                              # "notifications": true when e-mail is configured
```

| Symptom | Meaning |
|---|---|
| `notifications: false` in `/api/health`, or a warning at API start | `NOTIFY_TO` or `SMTP_HOST` is not set: enquiries are stored but nobody is told |
| `notify_error: email: SMTPAuthenticationError(535)` | wrong SMTP user name or password (re-run the script with new credentials) |
| `email: SMTPSenderRefused(554)` or `(550)` | the `From` address is not at a verified domain |
| `email: ConnectionRefusedError` / `TimeoutError` | the server cannot reach `email-smtp.ap-south-1.amazonaws.com:587` (security group, network) |
| e-mail arrives in spam | add SPF/DMARC for `sitesurelabs.com`, or mark the sender safe in the receiving mailbox |

## Not covered

- Enquiries are not read from the website; they are in the SQLite volume. `ADMIN_TOKEN` (off by default) enables the read-only
  `GET /api/admin/enquiries` endpoint if a list is needed.
- A confirmation e-mail to the visitor is not sent (it would need its own consent wording and abuse limits).
