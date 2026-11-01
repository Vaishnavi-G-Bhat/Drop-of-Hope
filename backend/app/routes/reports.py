from flask import Blueprint, request, session

from ..extensions import db
from ..models import Report
from ..utils.auth import login_required
from ..utils.responses import error_response, success_response

reports_bp = Blueprint('reports', __name__)


@reports_bp.route('/reports', methods=['POST'])
@login_required
def create_report():
    payload = request.get_json(silent=True) or {}
    target_type = payload.get('target_type')
    target_id = payload.get('target_id')
    reason = (payload.get('reason') or '').strip()
    if target_type not in {'donor', 'blood_bank', 'request'} or not target_id or not reason:
        return error_response('VALIDATION_ERROR', 'target_type, target_id and reason are required', 400)
    report = Report(reporter_id=session['user_id'], target_type=target_type, target_id=int(target_id), reason=reason)
    db.session.add(report)
    db.session.commit()
    return success_response({'id': report.id}, 'Report submitted.')
