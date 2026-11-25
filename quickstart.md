# Quickstart

## Run the application (one server on port 5500)

The Flask app serves both the frontend and API on port `5500`. Run only the Flask command below; no separate frontend server is needed.

### Windows (PowerShell)

Use Python 3.13 for the backend environment. Flask serves both the frontend and API on port `5500`; do not start a separate `http.server`.

```powershell
cd "D:\projects\Drop Of Hope\backend"
py -3.13 -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m flask --app run init-db
.\venv\Scripts\python.exe seed.py
.\venv\Scripts\python.exe run.py
```

### macOS / Linux

```bash
cd "Drop Of Hope/backend"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
flask --app run init-db
python seed.py
python run.py
```
Open `http://127.0.0.1:5500/`. The same server handles API requests under `/api`, so the frontend and backend share one port and session-cookie origin.

If port `5500` is already in use, stop the existing Flask server before starting this one.
## Demo login

Admin account created by the seed script:

- Email: `admin@truedrop.local`
- Password: `Admin@123`
