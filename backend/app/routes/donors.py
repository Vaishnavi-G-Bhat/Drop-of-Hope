from datetime import date, datetime, timezone

from flask import Blueprint, request, session

from ..extensions import db
from ..models import BloodRequest, DonationResponse, Donor, Notification, User
from ..utils.auth import login_required, role_required
from ..utils.responses import error_response, success_response
from ..utils.validators import validate_age, validate_phone, validate_pincode

donor_bp = Blueprint('donor', __name__)


@donor_bp.route('/me', methods=['GET'])
@login_required
@role_required('donor')
def donor_me():
    user = User.query.get(session['user_id'])
    donor = user.donor
    return success_response({
        'id': donor.id,
        'email': user.email,
        'full_name': user.full_name,
        'phone': donor.user.phone,
        'age': donor.age,
        'blood_group': donor.blood_group,
        'city': donor.city,
        'area': donor.area,
        'pin_code': donor.pin_code,
        'availability_status': donor.availability_status,
        'notify_opt_in': donor.notify_opt_in,
        'notify_area': donor.notify_area,
        'last_donation_date': donor.last_donation_date.isoformat() if donor.last_donation_date else None,
        'total_donations': donor.total_donations,
    })


@donor_bp.route('/me', methods=['PUT'])
@login_required
@role_required('donor')
def update_donor_me():
    payload = request.get_json(silent=True) or {}
    donor = User.query.get(session['user_id']).donor
    if 'age' in payload:
        donor.age = validate_age(payload['age'])
    if 'city' in payload:
        donor.city = (payload['city'] or '').strip() or donor.city
    if 'area' in payload:
        donor.area = (payload['area'] or '').strip()
    if 'pin_code' in payload:
        donor.pin_code = validate_pincode(payload['pin_code'])
    if 'phone' in payload:
        donor.user.phone = validate_phone(payload['phone'])
    if 'last_donation_date' in payload and payload['last_donation_date']:
        donor.last_donation_date = date.fromisoformat(payload['last_donation_date'])
    db.session.commit()
    return success_response({'status': 'updated'}, 'Donor profile updated.')


@donor_bp.route('/me/availability', methods=['PUT'])
@login_required
@role_required('donor')
def update_availability():
    payload = request.get_json(silent=True) or {}
    donor = User.query.get(session['user_id']).donor
    status = payload.get('availability_status')
    if status not in {'Available', 'Unavailable', 'Contact me first'}:
        return error_response('VALIDATION_ERROR', 'Invalid availability_status', 400)
    donor.availability_status = status
    donor.status_updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return success_response({'availability_status': donor.availability_status}, 'Availability updated.')


@donor_bp.route('/me/confirm', methods=['POST'])
@login_required
@role_required('donor')
def confirm_donor_availability():
    donor = User.query.get(session['user_id']).donor
    donor.status_updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return success_response({'status_updated_at': donor.status_updated_at.isoformat()}, 'Availability confirmed.')


@donor_bp.route('/me/notifications', methods=['PUT'])
@login_required
@role_required('donor')
def update_notifications():
    payload = request.get_json(silent=True) or {}
    donor = User.query.get(session['user_id']).donor
    if 'notify_opt_in' in payload:
        donor.notify_opt_in = bool(payload['notify_opt_in'])
    if 'notify_area' in payload:
        donor.notify_area = payload['notify_area']
    db.session.commit()
    return success_response({'notify_opt_in': donor.notify_opt_in, 'notify_area': donor.notify_area}, 'Notification settings updated.')


@donor_bp.route('/me/requests', methods=['GET'])
@login_required
@role_required('donor')
def donor_requests():
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 10)), 1), 50)
    donor = User.query.get(session['user_id']).donor
    query = BloodRequest.query.filter(BloodRequest.status != 'Resolved').filter(BloodRequest.status != 'Cancelled')
    items = []
    for req in query.all():
        if donor.blood_group == req.blood_group:
            items.append({
                'id': req.id,
                'city': req.city,
                'area': req.area,
                'pin_code': req.pin_code,
                'blood_group': req.blood_group,
                'hospital_name': req.hospital_name,
                'urgency': req.urgency,
                'status': req.status,
            })
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    return success_response({'items': items[start:end], 'page': page, 'per_page': per_page, 'total': total})


@donor_bp.route('/me/requests/<int:request_id>/respond', methods=['POST'])
@login_required
@role_required('donor')
def donor_respond(request_id):
    payload = request.get_json(silent=True) or {}
    donor = User.query.get(session['user_id']).donor
    req = BloodRequest.query.get_or_404(request_id)
    response = payload.get('response')
    if response not in {'Accepted', 'Declined'}:
        return error_response('VALIDATION_ERROR', 'response must be Accepted or Declined', 400)
    existing = DonationResponse.query.filter_by(request_id=req.id, donor_id=donor.id).first()
    if existing:
        return error_response('CONFLICT', 'A response already exists for this donor and request.', 409)
    dr = DonationResponse(request_id=req.id, donor_id=donor.id, response=response, message=payload.get('message'))
    db.session.add(dr)
    if response == 'Accepted' and req.status == 'Pending':
        req.status = 'Response received'
        req.status_updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return success_response({'request_id': req.id, 'response': response}, 'Response recorded.')


@donor_bp.route('/me/history', methods=['GET'])
@login_required
@role_required('donor')
def donor_history():
    donor = User.query.get(session['user_id']).donor
    responses = DonationResponse.query.filter_by(donor_id=donor.id).all()
    items = []
    for r in responses:
        items.append({'request_id': r.request_id, 'response': r.response, 'responded_at': r.responded_at.isoformat() if r.responded_at else None})
    return success_response({'responses': items, 'total_donations': donor.total_donations})


@donor_bp.route('/me/certificate', methods=['GET'])
@login_required
@role_required('donor')
def donor_certificate():
    donor = User.query.get(session['user_id']).donor
    if donor.total_donations < 1:
        return error_response('NOT_FOUND', 'Certificate unavailable.', 404)
    cert = {
        'donor_name': donor.user.full_name,
        'blood_group': donor.blood_group,
        'total_donations': donor.total_donations,
        'last_donation_date': donor.last_donation_date.isoformat() if donor.last_donation_date else None,
        'issued_at': datetime.now(timezone.utc).isoformat(),
        'certificate_id': f'DTR-{donor.id}-{donor.total_donations}',
    }
    return success_response(cert, 'Certificate issued.')
