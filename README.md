# SiteSureLabs Website

The official website of **SiteSureLabs**, a company that builds smart software and AI tools for businesses, especially in construction and site work.

## What the website does

- **Introduces the company** and the custom software and AI work it does for businesses.
- **Showcases the products:**
  - **Anviksha**
  - **SiteVision**
  - **Digi Reco**
  - **Parichay**
  - A preview of a **robotic inspection dog** that is still in development.
- **Collects enquiries.** Visitors can use the contact form to request a demo, propose a project or ask a general question. Every enquiry is saved so none are lost, and the team can be notified by email.

## Pages

| Page | Purpose |
| --- | --- |
| Home | Overview of the company, a scroll-through tour of the products and a "Request a demo" section |
| Products | All products in one place, each with its own detail page |
| Services | The custom work the company offers |
| About | The company's approach and its founder, Amod Jupally |
| Contact | The enquiry form |
| Privacy and Terms | Draft legal pages |

## Highlights

- Dark and light looks, which visitors can switch between.
- Works on phones, tablets and computers.
- Product pictures are real screenshots from the company's demo videos.
- Business email addresses only on the contact form, plus built-in spam protection.

## Running it

You need **Node.js** and **Python** installed. Open two terminals in the project folder.

**Terminal 1: the part that saves enquiries**
```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt
cp .env.example .env
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2: the website**
```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

To put the site online, run `docker compose up -d --build` after copying `.env.example` to `.env` and filling it in.
