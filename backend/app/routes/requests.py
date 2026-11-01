from datetime import date, datetime, timezone

from flask import Blueprint, request, session

from ..extensions import db
from ..models import (
    BloodBank,
    BloodRequest,
    BloodStock,
    DonationResponse,
    Donor,
    Notification,
    RequestStatusHistory,
    User,
)
from ..utils.auth import login_required, role_required
from ..utils.responses import error_response, success_response
from ..utils.validators import validate_phone, validate_pincode, validate_units

requests_bp = Blueprint('requests', __name__)


def create_request_notification(request_obj):
    donors = Donor.query.join(User, User.id == Donor.user_id).filter(
        User.is_verified == True,
        User.is_active == True,
        Donor.availability_status != 'Unavailable',
    ).all()
    for donor in donors:
        match = donor.blood_group == request_obj.blood_group
        if donor.notify_opt_in and donor.user.is_verified and donor.user.is_active and donor.user.id != request_obj.requester_id:
            if donor.notify_area and donor.notify_area.lower() in {request_obj.city.lower(), request_obj.pin_code}:
                if match:
                    count = Notification.query.filter(
                        Notification.user_id == donor.user_id,
                        Notification.type == 'emergency_request',
                        Notification.created_at >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0),
                    ).count()
                    if count < 5:
                        db.session.add(
                            Notification(
                                user_id=donor.user_id,
                                request_id=request_obj.id,
                                type='emergency_request',
                                title='Emergency blood request',
                                message=f'An emergency request for {request_obj.blood_group} is active in {request_obj.city}.',
                            )
                        )
    for bank in BloodBank.query.join(User, User.id == BloodBank.user_id).filter(User.is_verified == True, User.is_active == True).all():
        if bank.city.lower() == request_obj.city.lower():
            db.session.add(
                Notification(
                    user_id=bank.user_id,
                    request_id=request_obj.id,
                    type='emergency_request',
                    title='Emergency request in your city',
                    message=f'An emergency {request_obj.blood_group} request has been created in {request_obj.city}.',
                )
            )


@requests_bp.route('/requests', methods=['POST'])
@login_required
@role_required('patient')
def create_request():
    payload = request.get_json(silent=True) or {}
    try:
        patient = User.query.get(session['user_id']).patient
        order = {
            'patient_name': payload.get('patient_name') or patient.user.full_name,
            'blood_group': payload.get('blood_group'),
            'units_needed': validate_units(payload.get('units_needed')),
        }
        if not order['blood_group'] or order['blood_group'] not in {'A+','A-','B+','B-','AB+','AB-','O+','O-'}:
            raise ValueError('blood_group is required')
        required_date = payload.get('required_date')
        if not required_date:
            raise ValueError('required_date is required')
        req_date = date.fromisoformat(required_date)
        if req_date < date.today():
            raise ValueError('required_date cannot be in the past')
        req = BloodRequest(
            requester_id=session['user_id'],
            patient_name=order['patient_name'],
            blood_group=order['blood_group'],
            units_needed=order['units_needed'],
            hospital_name=payload.get('hospital_name'),
            city=(payload.get('city') or patient.city or '').strip(),
            area=payload.get('area') or patient.area,
            pin_code=validate_pincode(payload.get('pin_code') or patient.pin_code),
            required_date=req_date,
            urgency=payload.get('urgency', 'Normal'),
            contact_phone=validate_phone(payload.get('contact_phone')) if payload.get('contact_phone') else '',
            notes=payload.get('notes'),
            status='Pending',
            created_at=datetime.now(timezone.utc),
            status_updated_at=datetime.now(timezone.utc),
        )
        db.session.add(req)
        db.session.flush()
        db.session.add(RequestStatusHistory(request_id=req.id, status='Pending', created_at=datetime.now(timezone.utc)))
        create_request_notification(req)
        db.session.commit()
        return success_response({'id': req.id}, 'Request created successfully', 201)
    except ValueError as exc:
        return error_response('VALIDATION_ERROR', str(exc), 400)


@requests_bp.route('/requests/mine', methods=['GET'])
@login_required
@role_required('patient')
def my_requests():
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 10)), 1), 50)
    q = BloodRequest.query.filter_by(requester_id=session['user_id'])
    if request.args.get('status'):
        q = q.filter_by(status=request.args.get('status'))
    q = q.order_by(BloodRequest.created_at.desc())
    total = q.count()
    items = [{
        'id': r.id,
        'blood_group': r.blood_group,
        'status': r.status,
        'city': r.city,
        'hospital_name': r.hospital_name,
        'required_date': r.required_date.isoformat() if r.required_date else None,
    } for r in q.offset((page - 1) * per_page).limit(per_page).all()]
    return success_response({'items': items, 'page': page, 'per_page': per_page, 'total': total})


@requests_bp.route('/requests/<int:request_id>', methods=['GET'])
@login_required
def view_request(request_id):
    req = BloodRequest.query.get_or_404(request_id)
    if req.requester_id != session['user_id'] and session['role'] != 'admin':
        return error_response('FORBIDDEN', 'Forbidden', 403)
    responses = DonationResponse.query.filter_by(request_id=req.id).all()
    donor_responses = []
    for resp in responses:
        item = {'id': resp.id, 'donor_id': resp.donor_id, 'response': resp.response, 'message': resp.message, 'responded_at': resp.responded_at.isoformat()}
        if resp.response == 'Accepted':
            donor_obj = Donor.query.get(resp.donor_id)
            if donor_obj:
                item['full_phone'] = donor_obj.user.phone
        donor_responses.append(item)
    timeline = [{'status': h.status, 'at': h.created_at.isoformat()} for h in RequestStatusHistory.query.filter_by(request_id=req.id).order_by(RequestStatusHistory.created_at.asc()).all()]
    return success_response({
        'request': {
            'id': req.id,
            'requester_id': req.requester_id,
            'patient_name': req.patient_name,
            'blood_group': req.blood_group,
            'units_needed': req.units_needed,
            'hospital_name': req.hospital_name,
            'city': req.city,
            'area': req.area,
            'pin_code': req.pin_code,
            'required_date': req.required_date.isoformat() if req.required_date else None,
            'urgency': req.urgency,
            'contact_phone': req.contact_phone,
            'notes': req.notes,
            'status': req.status,
            'created_at': req.created_at.isoformat(),
            'status_updated_at': req.status_updated_at.isoformat(),
            'flagged_for_review': bool(req.flagged_for_review),
        },
        'responses': donor_responses,
        'timeline': timeline,
    })


@requests_bp.route('/requests/<int:request_id>/status', methods=['PUT'])
@login_required
@role_required('patient')
def update_request_status(request_id):
    req = BloodRequest.query.filter_by(id=request_id, requester_id=session['user_id']).first_or_404()
    payload = request.get_json(silent=True) or {}
    target = payload.get('status')
    if target not in {'Resolved', 'Cancelled'}:
        return error_response('VALIDATION_ERROR', 'status must be Resolved or Cancelled', 400)
    if req.status in {'Resolved', 'Cancelled'}:
        return error_response('CONFLICT', 'This request is already closed.', 409)
    req.status = target
    req.status_updated_at = datetime.now(timezone.utc)
    db.session.add(RequestStatusHistory(request_id=req.id, status=target, created_at=datetime.now(timezone.utc)))
    db.session.commit()
    return success_response({'status': req.status}, 'Status updated.')


@requests_bp.route('/requests/<int:request_id>/confirm-donation', methods=['POST'])
@login_required
@role_required('patient')
def confirm_donation(request_id):
    req = BloodRequest.query.filter_by(id=request_id, requester_id=session['user_id']).first_or_404()
    payload = request.get_json(silent=True) or {}
    donor_id = payload.get('donor_id')
    response = DonationResponse.query.filter_by(request_id=req.id, donor_id=donor_id, response='Accepted').first()
    if not response:
        return error_response('NOT_FOUND', 'Accepted donor not found for this request.', 404)
    donor = Donor.query.get(donor_id)
    donor.total_donations += 1
    donor.last_donation_date = date.today()
    req.status = 'Resolved'
    req.status_updated_at = datetime.now(timezone.utc)
    db.session.add(Notification(user_id=donor.user_id, request_id=req.id, type='system', title='Thank you', message='Your donation was confirmed and appreciated.'))
    db.session.commit()
    return success_response({'donor_id': donor_id, 'status': 'Resolved'}, 'Donation confirmed.')


@requests_bp.route('/blood-bank/requests', methods=['GET'])
@login_required
@role_required('blood_bank')
def blood_bank_requests():
    bank = User.query.get(session['user_id']).blood_bank
    items = []
    for req in BloodRequest.query.filter_by(city=bank.city).filter(BloodRequest.status != 'Resolved').filter(BloodRequest.status != 'Cancelled').all():
        stock = BloodStock.query.filter_by(blood_bank_id=bank.id, blood_group=req.blood_group).first()
        items.append({'id': req.id, 'blood_group': req.blood_group, 'city': req.city, 'status': req.status, 'stock': {'units': stock.units if stock else 0, 'last_updated_at': stock.last_updated_at.isoformat() if stock else None}})
    return success_response({'items': items, 'total': len(items)})
