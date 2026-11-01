from flask import Blueprint, request, session

from ..extensions import db
from ..models import Patient, User
from ..utils.auth import login_required, role_required
from ..utils.responses import error_response, success_response
from ..utils.validators import validate_phone, validate_pincode

patient_bp = Blueprint('patient', __name__)


@patient_bp.route('/me', methods=['GET'])
@login_required
@role_required('patient')
def patient_me():
    user = User.query.get(session['user_id'])
    profile = user.patient
    return success_response({
        'id': profile.id,
        'email': user.email,
        'full_name': user.full_name,
        'phone': user.phone,
        'city': profile.city,
        'area': profile.area,
        'pin_code': profile.pin_code,
    })


@patient_bp.route('/me', methods=['PUT'])
@login_required
@role_required('patient')
def update_patient_me():
    payload = request.get_json(silent=True) or {}
    user = User.query.get(session['user_id'])
    profile = user.patient
    if 'city' in payload:
        profile.city = payload['city']
    if 'area' in payload:
        profile.area = payload['area']
    if 'pin_code' in payload:
        profile.pin_code = validate_pincode(payload['pin_code'])
    if 'phone' in payload:
        user.phone = validate_phone(payload['phone'])
    db.session.commit()
    return success_response({'status': 'updated'}, 'Patient profile updated.')
