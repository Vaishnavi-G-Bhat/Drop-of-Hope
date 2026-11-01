from flask import Blueprint, request, session

from ..extensions import db
from ..models import Notification
from ..utils.auth import login_required
from ..utils.responses import success_response

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/notifications', methods=['GET'])
@login_required
def list_notifications():
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 10)), 1), 50)
    q = Notification.query.filter_by(user_id=session['user_id'])
    if request.args.get('unread') == 'true':
        q = q.filter_by(is_read=False)
    q = q.order_by(Notification.created_at.desc())
    total = q.count()
    items = [
        {'id': n.id, 'type': n.type, 'title': n.title, 'message': n.message, 'is_read': bool(n.is_read), 'created_at': n.created_at.isoformat() if n.created_at else None}
        for n in q.offset((page - 1) * per_page).limit(per_page).all()
    ]
    return success_response({'items': items, 'page': page, 'per_page': per_page, 'total': total})


@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@login_required
def mark_notification_read(notification_id):
    note = Notification.query.filter_by(id=notification_id, user_id=session['user_id']).first_or_404()
    note.is_read = True
    db.session.commit()
    return success_response({'id': note.id, 'is_read': True}, 'Notification marked as read.')


@notifications_bp.route('/notifications/read-all', methods=['PUT'])
@login_required
def read_all_notifications():
    Notification.query.filter_by(user_id=session['user_id'], is_read=False).update({'is_read': True})
    db.session.commit()
    return success_response({'updated': True}, 'All notifications marked as read.')
