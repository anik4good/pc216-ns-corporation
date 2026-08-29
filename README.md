# N.S. CORPORATION — Website (v2)

Premium one-page website for a Japan-based vehicle exporter, plus a **vehicle stock manager** you can use yourself from a phone or computer.

- Public site: homepage (hero → about → vehicle stock → how it works → services → global reach → inquiry → bank info) and a detail page per vehicle.
- Admin panel at `/admin` — add/edit/delete vehicles, upload photos, change status (AVAILABLE / RESERVED / SOLD). Sold vehicles stay on the site with a SOLD badge; their price is hidden unless you choose to show it.
- WhatsApp buttons everywhere (floating button, hero, each vehicle page with a pre-filled stock-number message).

## Run locally (Node 18+)

```bash
npm install
npm start
```

- Website: http://localhost:8084
- Admin: http://localhost:8084/admin
- Default login: user `admin`, password `ns-admin-2026` — **change it** via `ADMIN_PASSWORD` (see below).

## Run with Docker

```bash
docker compose up -d --build
```

Serves on port **8084**. Vehicle data and uploaded photos are stored in `./data/` (mounted as a volume, so they survive redeploys and container rebuilds).

## Changing the admin password

Set environment variables before starting:

- `ADMIN_USER` (default `admin`)
- `ADMIN_PASSWORD` (default `ns-admin-2026`)
- `SESSION_SECRET` (any long random string — set it so logins survive restarts)

With Docker, edit the `environment:` block in `docker-compose.yml`.

## Managing vehicles (no coding needed)

1. Open `http://YOUR-SITE/admin` and sign in.
2. **+ Add Vehicle** — fill the form, upload several photos at once, set the price and status.
3. When a car is sold: open the list, switch the status to **SOLD** (or use Edit). The car stays online with a SOLD badge; the price is hidden automatically (you can un-hide it in Edit).
4. Delete removes the vehicle and its photos permanently.

## Data & backups

Everything you add lives in two places — easy to back up by copying one folder:

- `data/db.json` — all vehicle records
- `data/uploads/` — uploaded photos

## Project structure

```
index.html            homepage
vehicle.html          vehicle detail page
assets/               site css/js/images (content lives in assets/js/content.js)
admin/                vehicle manager (login + dashboard)
server/               Node/Express API + JSON store
data/                 created at runtime: db.json + uploads/ (backup this)
```

## Still to fill in (placeholders on the site)

- Bank details (Bank name, branch, account no., SWIFT…) — in `assets/js/content.js` under `bank.fields`
- Facebook / Instagram links — `contactInfo.socials` in the same file
- Full company address & business hours — `contactInfo` in the same file
