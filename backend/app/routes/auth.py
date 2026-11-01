from datetime import datetime, timezone

from flask import Blueprint, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db, limiter
from ..models import BloodBank, Donor, Patient, User
from ..utils.auth import login_required
from ..utils.responses import error_response, success_response
from ..utils.validators import (
    validate_age,
    validate_email,
    validate_password,
    validate_phone,
    validate_pincode,
)

auth_bp = Blueprint('auth', __name__)


def build_user_payload(user):
    return {
        'id': user.id,
        'role': user.role,
        'full_name': user.full_name,
        'email': user.email,
        'is_verified': bool(user.is_verified),
        'preferred_language': user.preferred_language,
    }


@auth_bp.route('/register/donor', methods=['POST'])
def register_donor():
    payload = request.get_json(silent=True) or {}
    try:
        email = validate_email(payload.get('email'))
        password = validate_password(payload.get('password'))
        full_name = (payload.get('full_name') or '').strip()
        if not full_name:
            raise ValueError('full_name is required')
        phone = validate_phone(payload.get('phone'))
        age = validate_age(payload.get('age'))
        blood_group = payload.get('blood_group')
        city = (payload.get('city') or '').strip()
        pin_code = validate_pincode(payload.get('pin_code'))
        if blood_group not in {'A+','A-','B+','B-','AB+','AB-','O+','O-'}:
            raise ValueError('Invalid blood_group')
        if not city:
            raise ValueError('city is required')
        if User.query.filter_by(email=email).first():
            return error_response('CONFLICT', 'Email already registered.', 409)
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role='donor',
            full_name=full_name,
            phone=phone,
            preferred_language='en',
            is_verified=False,
            is_active=True,
        )
        db.session.add(user)
        db.session.flush()
        donor = Donor(
            user_id=user.id,
            age=age,
            blood_group=blood_group,
            city=city,
            area=(payload.get('area') or '').strip() or None,
            pin_code=pin_code,
            availability_status='Available',
            status_updated_at=datetime.now(timezone.utc),
            notify_opt_in=False,
            last_donation_date=None,
            total_donations=0,
        )
        db.session.add(donor)
        db.session.commit()
        return success_response({'user': build_user_payload(user)}, 'Donor registered successfully.', 201)
    except ValueError as exc:
        return error_response('VALIDATION_ERROR', str(exc), 400)


@auth_bp.route('/register/patient', methods=['POST'])
def register_patient():
    payload = request.get_json(silent=True) or {}
    try:
        email = validate_email(payload.get('email'))
        password = validate_password(payload.get('password'))
        full_name = (payload.get('full_name') or '').strip()
        if not full_name:
            raise ValueError('full_name is required')
        phone = validate_phone(payload.get('phone'))
        city = (payload.get('city') or '').strip()
        if not city:
            raise ValueError('city is required')
        if User.query.filter_by(email=email).first():
            return error_response('CONFLICT', 'Email already registered.', 409)
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role='patient',
            full_name=full_name,
            phone=phone,
            preferred_language='en',
            is_verified=True,
            is_active=True,
        )
        db.session.add(user)
        db.session.flush()
        patient = Patient(
            user_id=user.id,
            city=city,
            area=(payload.get('area') or '').strip() or None,
            pin_code=validate_pincode(payload.get('pin_code')) if payload.get('pin_code') else None,
        )
        db.session.add(patient)
        db.session.commit()
        return success_response({'user': build_user_payload(user)}, 'Patient registered successfully.', 201)
    except ValueError as exc:
        return error_response('VALIDATION_ERROR', str(exc), 400)


@auth_bp.route('/register/blood-bank', methods=['POST'])
def register_blood_bank():
    payload = request.get_json(silent=True) or {}
    try:
        email = validate_email(payload.get('email'))
        password = validate_password(payload.get('password'))
        full_name = (payload.get('full_name') or '').strip()
        if not full_name:
            raise ValueError('full_name is required')
        phone = validate_phone(payload.get('phone'))
        name = (payload.get('name') or '').strip()
        city = (payload.get('city') or '').strip()
        pin_code = validate_pincode(payload.get('pin_code'))
        if not name or not city:
            raise ValueError('name and city are required')
        if User.query.filter_by(email=email).first():
            return error_response('CONFLICT', 'Email already registered.', 409)
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            role='blood_bank',
            full_name=full_name,
            phone=phone,
            preferred_language='en',
            is_verified=False,
            is_active=True,
        )
        db.session.add(user)
        db.session.flush()
        bank = BloodBank(
            user_id=user.id,
            name=name,
            license_number=payload.get('license_number'),
            address=payload.get('address'),
            city=city,
            area=(payload.get('area') or '').strip() or None,
            pin_code=pin_code,
            contact_phone=payload.get('contact_phone'),
            open_hours=payload.get('open_hours'),
        )
        db.session.add(bank)
        db.session.commit()
        return success_response({'user': build_user_payload(user)}, 'Blood bank registered successfully.', 201)
    except ValueError as exc:
        return error_response('VALIDATION_ERROR', str(exc), 400)


@auth_bp.route('/login', methods=['POST'])
@limiter.limit('10/minute')
def login():
    payload = request.get_json(silent=True) or {}
    email = validate_email(payload.get('email')) if payload.get('email') else ''
    password = payload.get('password') or ''
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return error_response('VALIDATION_ERROR', 'Invalid email or password', 401)
    session.clear()
    session['user_id'] = user.id
    session['role'] = user.role
    session['preferred_language'] = user.preferred_language
    return success_response({'user': build_user_payload(user)}, 'Logged in successfully.')


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return success_response({}, 'Logged out successfully.')


@auth_bp.route('/me', methods=['GET'])
@login_required
def me():
    user = User.query.get(session['user_id'])
    profile = None
    if user.role == 'donor' and user.donor:
        profile = {
            'id': user.donor.id,
            'user_id': user.id,
            'blood_group': user.donor.blood_group,
            'city': user.donor.city,
            'area': user.donor.area,
            'pin_code': user.donor.pin_code,
            'availability_status': user.donor.availability_status,
            'status_updated_at': user.donor.status_updated_at.isoformat() if user.donor.status_updated_at else None,
        }
    elif user.role == 'patient' and user.patient:
        profile = {'id': user.patient.id, 'user_id': user.id, 'city': user.patient.city, 'area': user.patient.area, 'pin_code': user.patient.pin_code}
    elif user.role == 'blood_bank' and user.blood_bank:
        profile = {
            'id': user.blood_bank.id,
            'user_id': user.id,
            'name': user.blood_bank.name,
            'city': user.blood_bank.city,
            'area': user.blood_bank.area,
            'pin_code': user.blood_bank.pin_code,
            'contact_phone': user.blood_bank.contact_phone,
        }
    notification_count = 0
    if user.id:
        notification_count = 0
    return success_response({
        'user': build_user_payload(user),
        'profile': profile,
        'unread_notifications': notification_count,
        'verification_pending': bool(not user.is_verified and user.role in {'donor', 'blood_bank'}),
    })


@auth_bp.route('/language', methods=['PUT'])
@login_required
def set_language():
    payload = request.get_json(silent=True) or {}
    lang = (payload.get('preferred_language') or 'en').strip()
    if lang not in {'en', 'kn'}:
        return error_response('VALIDATION_ERROR', 'preferred_language must be en or kn', 400)
    user = User.query.get(session['user_id'])
    user.preferred_language = lang
    db.session.commit()
    return success_response({'preferred_language': lang}, 'Language updated.')
