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
  assets/       logo.svg, favicon.svg, hero-drop.svg
  css/          theme.css, components.css, pages.css
  dev/          api-check.html, api-check.js
  js/           api.js, auth.js, config.js, enums.js,
                i18n.js, layout.js, ui.js, utils.js
```

The current frontend contains shared UI and API foundations plus a backend API-check page. The home, search, login, registration, and role-specific application pages have not been implemented yet.

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

The home page has not been added yet. For now, open the API check page at `http://127.0.0.1:5500/dev/api-check.html`.

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

The home page has not been added yet. For now, open the API check page at `http://127.0.0.1:5500/dev/api-check.html`.

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

The frontend is in progress; the API check page can exercise the API, but the end-user pages and complete workflows are not yet available.

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
- During local integration testing, populated donor and blood-bank searches returned server errors. The search routes currently reference `session` without importing it; this backend issue must be corrected before those results can be used reliably.

## Running tests

```bash
cd "backend"
python -m pytest -q
```
