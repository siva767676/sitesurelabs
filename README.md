# SiteSureLabs Website

This is the website for **SiteSureLabs**, a company that builds smart software (including AI) for businesses, especially in construction and site work.

The website does three things:

1. **Introduces the company** and what it does.
2. **Shows off the products**: Anviksha, SiteVision, Digi Reco and Parichay. It also shows a preview of a robotic inspection dog the company is working on.
3. **Collects enquiries.** A visitor can fill in a form to ask for a demo, propose a project, or just say hello. The details are saved, and the team can be notified by email.

Everything shown on the site comes from the product demo videos the company provided. Nothing is made up. Anything we couldn't confirm is marked `CONFIRM` in the code and listed in [What still needs your input](#what-still-needs-your-input).

---

## What's on the website

| Page | What visitors see |
| --- | --- |
| **Home** | A rotating globe at the top, a scroll-through tour of the four products, the robot dog preview, reasons to choose SiteSureLabs, and a "Request a demo" section |
| **Products** | An overview of each product |
| **Individual product pages** | The full story of one product: what problem it solves, what it does, and screenshots |
| **Services** | The eight kinds of custom work the company offers |
| **About** | The company's thinking and the founder, Amod Jupally |
| **Contact** | The enquiry form |
| **Privacy and Terms** | Draft legal pages (they still need a lawyer's review) |

Other things worth knowing:

- **Light and dark look.** The site opens in dark mode. Visitors can switch to light mode with a button at the top, and the site remembers their choice.
- **Works on phones.** It has been checked on phones and tablets, and the layout adapts to the screen.
- **Looks after accessibility.** It works with screen readers and keyboards, and people who prefer less motion get a calmer version.
- **Handles weak devices.** Phones and older computers get a simpler picture instead of the heavy 3D animation, so the site stays quick.
- **Uses real screenshots.** The product pictures are taken from the demo videos. The two illustrations (the Progress Tracker concept and the robot dog) are clearly labelled as concepts.

---

## What happens when someone fills in the contact form

1. The visitor sends the form.
2. The site checks that everything is filled in properly. It only accepts business email addresses (not Gmail, Yahoo and so on). You can turn this off if it costs you leads.
3. It blocks spam. That includes bots, people sending too many messages, and repeat submissions.
4. The enquiry is **saved first**, so it's never lost, even if the email system is down.
5. The team is then notified by email, or by a message to another tool such as a CRM, if either is set up.

For privacy, visitors' internet addresses are never stored in readable form.

All enquiries are kept in a single small database file, so there's no separate database to run or look after.

---

## Running it on your computer (for a developer)

You'll need two free programs installed first: **Node.js** (version 22.18 or later) and **Python** (version 3.11 or later).

The site has two parts that run side by side: the **website itself** and the **behind-the-scenes part** that saves enquiries.

**Start the behind-the-scenes part** (open a terminal in the project folder):

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt
cp .env.example .env
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

On Mac or Linux, use `.venv/bin/python` in place of `.venv/Scripts/python`.

**Start the website** (open a second terminal):

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

**Useful commands**

| Where | Command | What it does |
| --- | --- | --- |
| `frontend/` | `npm run dev` | Runs the site while you work on it |
| `frontend/` | `npm run build` | Prepares the final version for publishing |
| `frontend/` | `npm run lint` | Checks the code for mistakes |
| `backend/` | `python -m pytest` | Runs the automatic tests for the enquiry system |

If you want to share your local copy through a tunnel such as ngrok, the tunnel's address has to be allowed first. Run `ALLOWED_HOSTS=your-name.ngrok-free.dev npm run dev`.

---

## Putting the website online

The easiest way is **Docker**, a tool that packages the whole site so it runs the same way anywhere.

```bash
cp .env.example .env
# open .env and fill in the settings (see below)
docker compose up -d --build
```

The site will then be available at `http://localhost:8080`. For a real website, put a secure (HTTPS) layer in front of it. Services like Cloudflare or Caddy do this for you.

**Settings to fill in** (in the `.env` file):

| Setting | What it's for |
| --- | --- |
| `IP_HASH_SALT` | A long random phrase that keeps visitors' addresses private. **Required** for the live site |
| `PUBLIC_ORIGIN` | The web address of the site, such as `https://sitesurelabs.com` |
| Email settings (`SMTP_...`, `NOTIFY_TO`) | So the team gets an email for each enquiry |
| `ADMIN_TOKEN` | A password for viewing saved enquiries (optional) |

Put notes in `.env` on their own lines, never after a value, or the setting may break.

**Viewing enquiries.** Either use the `ADMIN_TOKEN` password with the admin address, or open a backup of the database in a free tool such as *DB Browser for SQLite*.

**Backups.** Enquiries are stored in one file that survives restarts and updates. Back it up regularly. Ask your developer to set up a scheduled backup. Running `docker compose down -v` **deletes** the data, so avoid that unless you mean it.

**If something looks wrong after going live**

- *Animations missing:* another program may be using the same port. Change `WEB_PORT` in `.env` to a free number and restart.
- *Contact form won't send:* check `.env` for a note written after a value, and remove it.

### Before going live, check these

1. Go through the [list below](#what-still-needs-your-input).
2. Point `sitesurelabs.com` at the server and turn on HTTPS.
3. Set up email (or webhook) notifications and the security phrase.
4. Set up regular backups.
5. Send one test enquiry on the live site and confirm it arrives.
6. Submit the site's sitemap (`https://sitesurelabs.com/sitemap.xml`) to Google Search Console so it appears in search.
7. If traffic grows, move the demo videos (about 47 MB) to a video delivery service.

---

## How the project is organised

You don't need this unless you're editing the site.

```
sitesurelabs/
├── backend/        The behind-the-scenes part: saves enquiries, blocks spam, sends notifications
├── frontend/       The website visitors see
│   ├── src/data/       The text and details of products, services and the company: edit here to change wording
│   ├── src/pages/      One file per page
│   ├── src/components/ Reusable pieces (header, footer, forms, animations)
│   └── public/         Logos, icons, product images and demo videos
├── docker-compose.yml   Instructions for running everything together online
└── .env.example         Template for the settings
```

**To change wording or product details,** edit the files in `frontend/src/data/`. Keep it short: each product gets a one-line summary, four highlights and four key capabilities.

---

## Choices we made, and why

- **Simple setup.** The site doesn't need a heavy server framework, because it's mostly information plus one form. A small step at build time still gives every page its own title and description for Google.
- **Real screenshots only.** No made-up screens are passed off as real.
- **Dark first.** Dark matches the brand. Light mode is a full alternative, not just inverted colours.
- **Orange is the highlight colour.** It comes from the logo and is used sparingly, so text stays easy to read.
- **One small database file.** Only a few enquiries arrive each day, so a full database system would be overkill. If the site ever needs to run on many servers at once, that's the time to upgrade.
- **Placeholders are marked.** Progress Tracker is hidden from search engines until its details are confirmed. The testimonials section stays empty until real, approved quotes are added.

---

## What still needs your input

The site is built, but these items need information, files or approvals from the company.

**Files and images**
- [ ] **Original logo file.** The current logo was traced from a picture (JPG). If the designer has the original (SVG, AI or PDF), use it instead for the sharpest result.
- [ ] **Product numbers.** Anviksha shows "10,000+ images processed" and "150+ live users". Please confirm they're current. Send similar numbers for the other products if you want them shown.
- [ ] **Progress Tracker.** All of its wording is a placeholder. It needs a description, features and screenshots.
- [ ] **Robot dog.** The site shows a concept image made for the website, not the real robot. Confirm the company is happy to announce it, whether it has a name, and send real photos or video when they exist.

**Permissions**
- [ ] **Customer branding in the demos.** The videos and screenshots show "My Home Group / My Home Constructions" names. Confirm you may publish them, or re-record with neutral sample data.
- [ ] **Parichay demo.** It shows worker names, photos, ID-style numbers and contractor names. Confirm this is sample data or that it's fine to publish. Otherwise re-record with neutral data.

**Business details to confirm** (search the code for `CONFIRM`)
- [ ] The contact email. `hello@sitesurelabs.com` is a placeholder. Add any postal address or phone number too.
- [ ] Social media links (none are shown until provided).
- [ ] That the eight listed services are all ones you can really deliver.
- [ ] The wording on the About page, including the claim that the company is product-first.
- [ ] How each product is deployed (the section stays hidden until confirmed).
- [ ] The Digi Reco description (it's based on the demo, which covers steel reconciliation).
- [ ] The Privacy Policy and Terms: company legal name, how long data is kept, governing law and service providers. A lawyer should review both.
- [ ] Case studies, results and testimonials, which should only go up with approval.

**Accounts and settings**
- [ ] Email or webhook details, the admin password and the security phrase.
- [ ] A backup schedule for the enquiries database.
- [ ] Optional: Cloudflare Turnstile keys, an extra spam-protection check on the form.
- [ ] The domain name and HTTPS set-up.
