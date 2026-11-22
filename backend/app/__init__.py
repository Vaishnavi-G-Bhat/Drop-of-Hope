from pathlib import Path

from flask import Flask, send_from_directory
from sqlalchemy import inspect, text

from .cli import register_cli
from .config import Config
from .extensions import cors, db, limiter
from .routes.admin import admin_bp
from .routes.auth import auth_bp
from .routes.blood_banks import blood_bank_bp
from .routes.donors import donor_bp
from .routes.notifications import notifications_bp
from .routes.patients import patient_bp
from .routes.reports import reports_bp
from .routes.requests import requests_bp
from .routes.search import search_bp
from .utils.responses import error_response

FRONTEND_DIR = Path(__file__).resolve().parents[2] / 'frontend'


def create_app(test_config=None):
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    if test_config:
        app.config.from_mapping(test_config)

    db.init_app(app)
    limiter.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(donor_bp, url_prefix='/api/donors')
    app.register_blueprint(patient_bp, url_prefix='/api/patients')
    app.register_blueprint(requests_bp, url_prefix='/api')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(blood_bank_bp, url_prefix='/api/blood-bank')
    app.register_blueprint(notifications_bp, url_prefix='/api')
    app.register_blueprint(reports_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @limiter.exempt
    @app.get('/')
    def serve_frontend():
        return serve_frontend_file('index.html')

    @limiter.exempt
    @app.get('/<path:filename>')
    def serve_frontend_asset(filename):
        return serve_frontend_file(filename)

    def serve_frontend_file(filename):
        response = send_from_directory(FRONTEND_DIR, filename, conditional=False)
        response.headers['Cache-Control'] = 'no-store'
        return response

    @app.errorhandler(400)
    def handle_400(_error):
        return error_response('VALIDATION_ERROR', 'Invalid request payload.', 400)

    @app.errorhandler(401)
    def handle_401(_error):
        return error_response('UNAUTHENTICATED', 'Authentication required.', 401)

    @app.errorhandler(403)
    def handle_403(_error):
        return error_response('FORBIDDEN', 'You do not have permission to access this resource.', 403)

    @app.errorhandler(404)
    def handle_404(_error):
        return error_response('NOT_FOUND', 'Resource not found.', 404)

    @app.errorhandler(405)
    def handle_405(_error):
        return error_response('VALIDATION_ERROR', 'Method not allowed.', 405)

    @app.errorhandler(409)
    def handle_409(_error):
        return error_response('CONFLICT', 'The request conflicts with existing data.', 409)

    @app.errorhandler(429)
    def handle_429(_error):
        return error_response('RATE_LIMITED', 'Too many requests. Please try again later.', 429)

    @app.errorhandler(500)
    def handle_500(_error):
        return error_response('SERVER_ERROR', 'An unexpected error occurred.', 500)

    register_cli(app)
    with app.app_context():
        db.create_all()
        donor_columns = {column['name'] for column in inspect(db.engine).get_columns('donors')}
        for name, definition in (
            ('country', "VARCHAR(120) NOT NULL DEFAULT 'India'"),
            ('state', 'VARCHAR(120)'),
            ('district', 'VARCHAR(120)'),
        ):
            if name not in donor_columns:
                db.session.execute(text(f'ALTER TABLE donors ADD COLUMN {name} {definition}'))
        db.session.commit()
    return app
