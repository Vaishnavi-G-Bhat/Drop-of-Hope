from datetime import datetime, timezone

from flask import Blueprint, request, session

from ..extensions import db
from ..models import BloodBank, BloodStock, User
from ..utils.auth import login_required, role_required
from ..utils.responses import error_response, success_response
from ..utils.validators import validate_phone, validate_pincode

blood_bank_bp = Blueprint('blood_bank', __name__)


@blood_bank_bp.route('/me', methods=['GET'])
@login_required
@role_required('blood_bank')
def bank_me():
    user = User.query.get(session['user_id'])
    bank = user.blood_bank
    return success_response({
        'id': bank.id,
        'email': user.email,
        'full_name': user.full_name,
        'phone': user.phone,
        'name': bank.name,
        'license_number': bank.license_number,
        'address': bank.address,
        'city': bank.city,
        'area': bank.area,
        'pin_code': bank.pin_code,
        'contact_phone': bank.contact_phone,
        'open_hours': bank.open_hours,
        'verified': bool(user.is_verified),
    })


@blood_bank_bp.route('/me', methods=['PUT'])
@login_required
@role_required('blood_bank')
def update_bank_me():
    payload = request.get_json(silent=True) or {}
    user = User.query.get(session['user_id'])
    bank = user.blood_bank
    if 'phone' in payload:
        user.phone = validate_phone(payload['phone'])
    if 'name' in payload:
        bank.name = payload['name']
    if 'city' in payload:
        bank.city = payload['city']
    if 'area' in payload:
        bank.area = payload['area']
    if 'pin_code' in payload:
        bank.pin_code = validate_pincode(payload['pin_code'])
    if 'contact_phone' in payload:
        bank.contact_phone = payload['contact_phone']
    if 'open_hours' in payload:
        bank.open_hours = payload['open_hours']
    db.session.commit()
    return success_response({'status': 'updated'}, 'Blood bank profile updated.')


@blood_bank_bp.route('/stock', methods=['GET'])
@login_required
@role_required('blood_bank')
def bank_stock():
    bank = User.query.get(session['user_id']).blood_bank
    groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
    payload = {}
    for group in groups:
        stock = BloodStock.query.filter_by(blood_bank_id=bank.id, blood_group=group).first()
        payload[group] = {'units': stock.units if stock else 0, 'last_updated_at': stock.last_updated_at.isoformat() if stock else None}
    return success_response({'stock': payload})


@blood_bank_bp.route('/stock', methods=['PUT'])
@login_required
@role_required('blood_bank')
def update_bank_stock():
    payload = request.get_json(silent=True) or {}
    bank = User.query.get(session['user_id']).blood_bank
    for item in payload.get('stock', []):
        group = item.get('blood_group')
        if group not in {'A+','A-','B+','B-','AB+','AB-','O+','O-'}:
            return error_response('VALIDATION_ERROR', f'Invalid blood_group: {group}', 400)
        units = int(item.get('units', 0))
        if units < 0:
            return error_response('VALIDATION_ERROR', 'Units must be >= 0', 400)
        stock = BloodStock.query.filter_by(blood_bank_id=bank.id, blood_group=group).first()
        if stock:
            stock.units = units
            stock.last_updated_at = datetime.now(timezone.utc)
            stock.updated_by = session['user_id']
        else:
            stock = BloodStock(
                blood_bank_id=bank.id,
                blood_group=group,
                units=units,
                last_updated_at=datetime.now(timezone.utc),
                updated_by=session['user_id'],
            )
            db.session.add(stock)
    db.session.commit()
    return success_response({'updated': True}, 'Stock updated.')


@blood_bank_bp.route('/stock/confirm', methods=['POST'])
@login_required
@role_required('blood_bank')
def confirm_stock():
    bank = User.query.get(session['user_id']).blood_bank
    for stock in BloodStock.query.filter_by(blood_bank_id=bank.id).all():
        stock.last_updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return success_response({'confirmed': True}, 'Stock confirmation recorded.')
