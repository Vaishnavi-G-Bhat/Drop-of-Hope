# TrueDrop Backend

This is the backend for the TrueDrop blood donor and emergency blood availability portal.

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

## Assumptions

- The project is implemented as a JSON API only and intentionally contains no frontend HTML or CSS.
- Search endpoints return paginated data structures as dictionaries for compatibility with the API contract.
- The app keeps all timestamps in UTC.

## Running tests

```bash
pytest -q
```
