from flask import jsonify


def success_response(data=None, message=None, status=200):
    payload = {'success': True}
    if data is not None:
        payload['data'] = data
    if message is not None:
        payload['message'] = message
    return jsonify(payload), status


def error_response(code, message, status=400, fields=None):
    payload = {'success': False, 'error': {'code': code, 'message': message}}
    if fields:
        payload['error']['fields'] = fields
    return jsonify(payload), status


def paginated_response(items, page, per_page, total):
    return {'items': items, 'page': page, 'per_page': per_page, 'total': total}
