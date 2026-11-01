from flask import Flask
from werkzeug.security import generate_password_hash

from .extensions import db
from .models import User


def init_db():
    db.create_all()
    print('Database initialized.')


def create_admin_user(email='admin@truedrop.local', password='Admin@123', name='System Administrator'):
    user = User.query.filter_by(email=email.lower()).first()
    if user is None:
        user = User(
            email=email.lower(),
            password_hash=generate_password_hash(password),
            role='admin',
            full_name=name,
            phone='9999999999',
            preferred_language='en',
            is_verified=True,
            is_active=True,
        )
        db.session.add(user)
        db.session.commit()
        print(f'Created admin: {user.email} / {password}')
    else:
        print(f'Admin already exists: {user.email}')


def register_cli(app: Flask):
    @app.cli.command('init-db')
    def init_db_cmd():
        init_db()

    @app.cli.command('create-admin')
    def create_admin_cmd():
        create_admin_user()
