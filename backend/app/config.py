import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parents[1]

APP_NAME = 'TrueDrop'


class Config:  # pragma: no cover
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{BASE_DIR / "app.db"}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = ['http://localhost:*', 'http://127.0.0.1:*']
    DONOR_FRESHNESS_DAYS = 30
    STOCK_FRESHNESS_HOURS = 24
    MIN_DONATION_GAP_DAYS = 90
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    TESTING = False
