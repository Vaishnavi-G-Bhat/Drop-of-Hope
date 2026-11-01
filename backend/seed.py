from werkzeug.security import generate_password_hash

from app import create_app
from app.extensions import db
from app.models import User


def seed_data():
    app = create_app()
    with app.app_context():
        db.create_all()
        admin = User.query.filter_by(email='admin@truedrop.local').first()
        if not admin:
            admin = User(
                email='admin@truedrop.local',
                password_hash=generate_password_hash('Admin@123'),
                role='admin',
                full_name='System Admin',
                phone='9999999999',
                preferred_language='en',
                is_verified=True,
                is_active=True,
            )
            db.session.add(admin)
            db.session.commit()
        print('Demo credentials: admin@truedrop.local / Admin@123')


if __name__ == '__main__':
    seed_data()
