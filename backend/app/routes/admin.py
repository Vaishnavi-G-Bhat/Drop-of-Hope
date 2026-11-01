from flask import Blueprint, request, session

from ..extensions import db
from ..models import BloodRequest, BloodStock, Donor, Notification, Report, User
from ..utils.auth import login_required, role_required
from ..utils.responses import error_response, success_response

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/stats', methods=['GET'])
@login_required
@role_required('admin')
def admin_stats():
    stats = {
        'donors': Donor.query.count(),
        'patients': User.query.filter_by(role='patient').count(),
        'blood_banks': User.query.filter_by(role='blood_bank').count(),
        'requests_by_status': {s: BloodRequest.query.filter_by(status=s).count() for s in ['Pending','Response received','Resolved','Cancelled']},
        'open_reports': Report.query.filter_by(status='Open').count(),
        'pending_verifications': User.query.filter_by(is_verified=False).count(),
        'requests_by_blood_group': {g: BloodRequest.query.filter_by(blood_group=g).count() for g in ['A+','A-','B+','B-','AB+','AB-','O+','O-']},
        'requests_per_day': [],
    }
    return success_response(stats)


@admin_bp.route('/users', methods=['GET'])
@login_required
@role_required('admin')
def admin_users():
    role = request.args.get('role')
    is_verified = request.args.get('is_verified')
    q = request.args.get('q', '')
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 10)), 1), 50)
    query = User.query
    if role:
        query = query.filter_by(role=role)
    if is_verified is not None:
        query = query.filter_by(is_verified=is_verified.lower() == 'true')
    if q:
        query = query.filter(User.full_name.ilike(f'%{q}%'))
    total = query.count()
    items = [
        {'id': u.id, 'email': u.email, 'role': u.role, 'full_name': u.full_name, 'is_verified': bool(u.is_verified), 'is_active': bool(u.is_active)}
        for u in query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    ]
    return success_response({'items': items, 'page': page, 'per_page': per_page, 'total': total})


@admin_bp.route('/users/<int:user_id>/verify', methods=['PUT'])
@login_required
@role_required('admin')
def admin_verify_user(user_id):
    user = User.query.get_or_404(user_id)
    payload = request.get_json(silent=True) or {}
    user.is_verified = bool(payload.get('is_verified', True))
    db.session.commit()
    if user.is_verified:
        note = Notification(user_id=user.id, type='verification', title='Verification complete', message='Your account has been verified.')
        db.session.add(note)
        db.session.commit()
    return success_response({'id': user.id, 'is_verified': bool(user.is_verified)})


@admin_bp.route('/users/<int:user_id>/active', methods=['PUT'])
@login_required
@role_required('admin')
def admin_active_user(user_id):
    user = User.query.get_or_404(user_id)
    payload = request.get_json(silent=True) or {}
    user.is_active = bool(payload.get('is_active', user.is_active))
    db.session.commit()
    return success_response({'id': user.id, 'is_active': bool(user.is_active)})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
@role_required('admin')
def admin_delete_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return success_response({'id': user.id, 'is_active': False})


@admin_bp.route('/requests', methods=['GET'])
@login_required
@role_required('admin')
def admin_requests():
    status = request.args.get('status')
    flagged = request.args.get('flagged')
    query = BloodRequest.query
    if status:
        query = query.filter_by(status=status)
    if flagged is not None:
        query = query.filter_by(flagged_for_review=flagged.lower() == 'true')
    items = [{'id': r.id, 'status': r.status, 'blood_group': r.blood_group, 'city': r.city, 'flagged_for_review': bool(r.flagged_for_review)} for r in query.order_by(BloodRequest.created_at.desc()).all()]
    return success_response({'items': items, 'total': len(items)})


@admin_bp.route('/reports', methods=['GET'])
@login_required
@role_required('admin')
def admin_reports():
    status = request.args.get('status')
    query = Report.query
    if status:
        query = query.filter_by(status=status)
    items = [{'id': r.id, 'target_type': r.target_type, 'target_id': r.target_id, 'status': r.status, 'reason': r.reason} for r in query.order_by(Report.created_at.desc()).all()]
    return success_response({'items': items, 'total': len(items)})


@admin_bp.route('/reports/<int:report_id>', methods=['PUT'])
@login_required
@role_required('admin')
def update_report(report_id):
    report = Report.query.get_or_404(report_id)
    payload = request.get_json(silent=True) or {}
    report.status = payload.get('status', report.status)
    report.admin_note = payload.get('admin_note', report.admin_note)
    db.session.commit()
    return success_response({'id': report.id, 'status': report.status})


@admin_bp.route('/stock/<int:stock_id>', methods=['DELETE'])
@login_required
@role_required('admin')
def delete_stock(stock_id):
    stock = BloodStock.query.get_or_404(stock_id)
    db.session.delete(stock)
    db.session.commit()
    return success_response({'deleted': True, 'stock_id': stock_id})
