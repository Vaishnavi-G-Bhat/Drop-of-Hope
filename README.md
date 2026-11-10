# Drop of Hope

Drop of Hope is a blood donor and emergency blood availability portal. This repository contains its Flask JSON API, SQL database schema and seed data, and a static frontend foundation.

## Overview

The platform supports donor matching, emergency requests, donor verification, and blood-bank stock visibility. The frontend is a static HTML/CSS/JavaScript ES-module app that communicates with the backend over its `/api` endpoints. It does not need a JavaScript build step or npm.

## Project structure

- `backend/` — Flask application, API contract, and backend tests
- `database/` — raw SQL schema and seed scripts
- `frontend/` — static frontend foundation, shared modules, styles, assets, and API check page
- `README.md` — project overview and setup instructions

### Frontend files

```text
frontend/
  assets/       brand SVG assets
  admin/        administrator dashboard
  bloodbank/    blood-bank dashboard
  donor/        donor dashboard
  patient/      requester dashboard
  css/          shared theme, components, and page styles
  dev/          API check page
  js/           shared API/auth/UI plus home, search, auth,
                notification, and dashboard modules
  index.html    public home page
  login.html, register.html, search.html, notifications.html
```

The frontend includes the public home and search pages, login and registration forms, notifications, and role-protected donor, requester, blood-bank, and administrator dashboards. It uses the shared API client and session-cookie authentication; there is no JavaScript build step.

## Run locally

Run the backend and frontend in separate terminals. Use the same hostname (`127.0.0.1` or `localhost`) for both so the browser sends the session cookie consistently.

### Windows (PowerShell)

Terminal 1 — backend:

```powershell
cd "D:\projects\Drop Of Hope\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app run init-db
python seed.py
python run.py
```

Terminal 2 — frontend:

```powershell
cd "D:\projects\Drop Of Hope\frontend"
python -m http.server 5500
```

Open the site at `http://127.0.0.1:5500/`. The backend administrator created by `python seed.py` is `admin@truedrop.local` / `Admin@123`. Register donor, requester, or blood-bank accounts through the site; donor and blood-bank accounts require administrator verification before they appear in public search.

### macOS / Linux

Terminal 1 — backend:

```bash
cd "Drop Of Hope/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask --app run init-db
python seed.py
python run.py
```

Terminal 2 — frontend:

```bash
cd "Drop Of Hope/frontend"
python3 -m http.server 5500
```

Open the site at `http://127.0.0.1:5500/`.

The frontend uses browser ES modules, so serve it over HTTP rather than opening an HTML file with `file://`. A VS Code Live Server extension can also serve the `frontend/` folder.

## Frontend configuration

Configuration is in `frontend/js/config.js`:

- `API_BASE` defaults to the current page hostname on port `5000`, under `/api`. It can be overridden by setting `window.__API_BASE__` before the frontend modules load.
- `APP_NAME` is the frontend wordmark and product name.
- `DEMO_MODE` is currently `false`; demo-mode behavior has not been implemented.

The frontend sends API requests with credentials enabled so the backend session cookie can be used. Do not mix `localhost` and `127.0.0.1` between the frontend and backend.

## Frontend foundation

The current foundation includes:

- A shared API client with endpoint wrappers, a 15-second timeout, and structured API errors.
- In-memory authentication helpers and role-protection utilities.
- Shared layout, accessible toast/error/empty states, confirmation dialogs, blood-group selector, status badges, timeline, and loading skeleton helpers.
- English and Kannada shared-UI translations; language and text-size preferences are stored locally.
- Crimson/rose design tokens, responsive shared layout styles, and hand-made SVG brand assets.
- `dev/api-check.html` for checking public search endpoints and role-specific read endpoints against a running backend.

The end-user pages use the existing Flask APIs. The donor dashboard edits donor profile and availability, shows matching requests, and records responses. The requester dashboard creates and tracks requests, updates their status, confirms donations, and searches availability. The blood-bank dashboard edits its profile and inventory and reads incoming requests. The admin dashboard displays available statistics and supports user verification/activation and report status management. The API check page remains available at `/dev/api-check.html`.

The backend has no blood-bank action to update request status, no API to edit a blood bank's address/license after registration, no public admin registration, no Google OAuth login, and no search endpoint returning a single all-groups stock summary. The interface does not simulate these missing operations.

## Database

The raw schema and demo seed data live in the `database/` folder:

- `database/schema.sql`
- `database/seed.sql`

These are kept aligned with the backend models and are useful for local development and inspection.

## Assumptions

- The backend exposes a JSON API; the static frontend is a separate client.
- All timestamps are stored in UTC.
- The app is designed to work with SQLite during local development.

## Known integration notes

- The backend seed script currently prints only the admin demo account: `admin@truedrop.local` / `Admin@123`. Create other roles through the registration endpoints or the API check workflow.
- The backend API contract is documented in `backend/API_CONTRACT.md`.
- Populated donor search also failed when SQLite returned timezone-naive timestamps that the UTC freshness calculation could not subtract. Both the missing `session` import and timestamp normalization are fixed; the regression test exercises populated donor, blood-bank, and emergency searches.

## Running tests

```bash
cd "backend"
python -m pytest -q
```
