# TrueDrop Backend

This repository contains the backend for the TrueDrop blood donor and emergency blood availability portal.

## Overview

TrueDrop is a blood availability platform for donor matching, emergency requests, donor verification, and blood-bank stock visibility. The backend exposes a JSON API intended for a separate frontend client.

## Project structure

- `backend/` — Flask application and API code
- `database/` — raw SQL schema and seed scripts
- `README.md` — project overview and setup instructions

## Setup

### Windows (PowerShell)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app run init-db
python seed.py
python run.py
```

### macOS / Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask --app run init-db
python seed.py
python run.py
```

## Database

The raw schema and demo seed data live in the `database/` folder:

- `database/schema.sql`
- `database/seed.sql`

These are kept aligned with the backend models and are useful for local development and inspection.

## Assumptions

- The project is implemented as a JSON API only and intentionally contains no frontend HTML or CSS.
- Search endpoints return payloads compatible with the API contract.
- All timestamps are stored in UTC.
- The app is designed to work with SQLite during local development.

## Running tests

```bash
cd backend
python -m pytest -q
```

