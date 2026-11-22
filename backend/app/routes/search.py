from datetime import datetime, timezone

from flask import Blueprint, request, session
from sqlalchemy import func

from ..extensions import db
from ..models import BloodBank, BloodStock, Donor, User
from ..utils.compat import COMPATIBILITY_MAP
from ..utils.freshness import freshness_for
from ..utils.masking import display_name, mask_phone
from ..utils.responses import success_response

search_bp = Blueprint('search', __name__)


def donor_location_score(donor, city=None, pin_code=None, area=None, country=None, state=None, district=None):
    score = 0
    if pin_code and donor.pin_code == pin_code:
        score += 3
    if area and donor.area and donor.area.lower() == area.lower():
        score += 2
    if city and donor.city.lower() == city.lower():
        score += 1
    if country and donor.country and donor.country.lower() == country.lower():
        score += 1
    if state and donor.state and donor.state.lower() == state.lower():
        score += 1
    if district and donor.district and donor.district.lower() == district.lower():
        score += 1
    return score


def donor_list_query(blood_group=None, city=None, pin_code=None, area=None, compatible=False, country=None, state=None, district=None):
    q = Donor.query.join(User, User.id == Donor.user_id).filter(
        User.is_verified == True,
        User.is_active == True,
        Donor.availability_status != 'Unavailable',
    )
    if blood_group:
        if compatible:
            allowed = set()
            for key, groups in COMPATIBILITY_MAP.items():
                if key == blood_group:
                    allowed = set(groups)
                    break
            allowed.update({blood_group})
            q = q.filter(Donor.blood_group.in_(list(allowed)))
        else:
            q = q.filter(Donor.blood_group == blood_group)
    if city:
        q = q.filter(func.lower(Donor.city) == city.lower())
    if pin_code:
        q = q.filter(Donor.pin_code == pin_code)
    if area:
        q = q.filter(func.lower(Donor.area) == area.lower())
    for field, value in ((Donor.country, country), (Donor.state, state), (Donor.district, district)):
        if value:
            q = q.filter(func.lower(field) == value.lower())
    return q.order_by(Donor.status_updated_at.desc())


@search_bp.route('/donors', methods=['GET'])
def search_donors():
    blood_group = request.args.get('blood_group')
    city = request.args.get('city')
    pin_code = request.args.get('pin_code')
    area = request.args.get('area')
    country = request.args.get('country')
    state = request.args.get('state')
    district = request.args.get('district')
    compatible = request.args.get('compatible', 'false').lower() == 'true'
    donors = donor_list_query(blood_group, city, pin_code, area, compatible, country, state, district).all()
    rows = []
    for donor in donors:
        latest = freshness_for(donor.status_updated_at, 30)
        score = donor_location_score(donor, city, pin_code, area, country, state, district) + (2 if latest == 'Current' else 0) + (
            2 if donor.availability_status == 'Available' else 1 if donor.availability_status == 'Contact me first' else 0
        )
        row = {
            'id': donor.id,
            'display_name': display_name(donor.user.full_name),
            'blood_group': donor.blood_group,
            'country': donor.country,
            'state': donor.state,
            'district': donor.district,
            'city': donor.city,
            'area': donor.area,
            'availability_status': donor.availability_status,
            'freshness': latest,
            'last_updated_at': donor.status_updated_at.isoformat() if donor.status_updated_at else None,
            'verified': bool(donor.user.is_verified),
            'match_score': score,
            'masked_phone': None,
            'donation_gap_notice': None,
        }
        if request.cookies.get('session') is not None or 'user_id' in session:
            row['masked_phone'] = mask_phone(donor.user.phone)
        if donor.last_donation_date:
            days_since = (datetime.now(timezone.utc).date() - donor.last_donation_date).days
            if days_since < 90:
                row['donation_gap_notice'] = (
                    'Donor may be within the usual gap between donations. Final eligibility must be confirmed by the blood bank or doctor.'
                )
        rows.append(row)
    rows = sorted(rows, key=lambda r: (-r['match_score'], -(datetime.fromisoformat(r['last_updated_at']).timestamp() if r['last_updated_at'] else 0)))
    return success_response({'items': rows, 'page': 1, 'per_page': len(rows), 'total': len(rows)})


@search_bp.route('/blood-banks', methods=['GET'])
def search_blood_banks():
    blood_group = request.args.get('blood_group')
    city = request.args.get('city')
    pin_code = request.args.get('pin_code')
    q = BloodBank.query.join(User, User.id == BloodBank.user_id).filter(User.is_verified == True, User.is_active == True)
    if city:
        q = q.filter(BloodBank.city == city)
    if pin_code:
        q = q.filter(BloodBank.pin_code == pin_code)
    items = []
    for bank in q.all():
        stock = BloodStock.query.filter_by(blood_bank_id=bank.id, blood_group=blood_group).first() if blood_group else None
        if not blood_group or stock:
            item = {
                'id': bank.id,
                'name': bank.name,
                'address': bank.address,
                'city': bank.city,
                'area': bank.area,
                'units_reported': stock.units if stock else 0,
                'last_updated_at': stock.last_updated_at.isoformat() if stock else None,
                'freshness': 'Current' if stock and stock.last_updated_at else 'Needs confirmation',
                'verified': True,
                'contact_phone': None,
            }
            if request.cookies.get('session') is not None or 'user_id' in session:
                item['contact_phone'] = bank.contact_phone
            items.append(item)
    return success_response({'items': items, 'page': 1, 'per_page': len(items), 'total': len(items)})


@search_bp.route('/emergency', methods=['GET'])
def emergency_search():
    blood_group = request.args.get('blood_group')
    city = request.args.get('city')
    pin_code = request.args.get('pin_code')
    compatible = request.args.get('compatible', 'false').lower() == 'true'
    city_scope = request.args.get('location_scope') == 'city'
    country = request.args.get('country')
    state = request.args.get('state')
    district = request.args.get('district')
    area = request.args.get('area')
    donors = donor_list_query(
        blood_group,
        city,
        None if city_scope else pin_code,
        None if city_scope else area,
        compatible,
        country,
        state,
        district,
    ).all()
    donor_items = []
    for donor in donors:
        latest = freshness_for(donor.status_updated_at, 30)
        match_score = donor_location_score(
            donor, city, pin_code, area, country, state, district
        ) + (2 if latest == 'Current' else 0) + (
            2 if donor.availability_status == 'Available' else 1 if donor.availability_status == 'Contact me first' else 0
        )
        donor_items.append({
            'id': donor.id,
            'display_name': display_name(donor.user.full_name),
            'blood_group': donor.blood_group,
            'country': donor.country,
            'state': donor.state,
            'district': donor.district,
            'city': donor.city,
            'area': donor.area,
            'availability_status': donor.availability_status,
            'freshness': latest,
            'last_updated_at': donor.status_updated_at.isoformat() if donor.status_updated_at else None,
            'verified': bool(donor.user.is_verified),
            'match_score': match_score,
            'masked_phone': mask_phone(donor.user.phone) if 'user_id' in session else None,
        })
    donor_items.sort(key=lambda item: -item['match_score'])

    bank_q = BloodBank.query.join(User, User.id == BloodBank.user_id).filter(User.is_verified == True, User.is_active == True)
    if city:
        bank_q = bank_q.filter(func.lower(BloodBank.city) == city.lower())
    if pin_code and not city_scope:
        bank_q = bank_q.filter(BloodBank.pin_code == pin_code)
    bank_items = []
    for bank in bank_q.all():
        stock = BloodStock.query.filter_by(blood_bank_id=bank.id, blood_group=blood_group).first() if blood_group else None
        bank_items.append({
            'id': bank.id,
            'name': bank.name,
            'address': bank.address,
            'city': bank.city,
            'area': bank.area,
            'units_reported': stock.units if stock else 0,
            'last_updated_at': stock.last_updated_at.isoformat() if stock else None,
            'freshness': 'Current' if stock and stock.last_updated_at else 'Needs confirmation',
            'verified': True,
            'contact_phone': bank.contact_phone if 'user_id' in session else None,
        })
    return success_response({
        'donors': {'items': donor_items, 'total': len(donor_items)},
        'blood_banks': {'items': bank_items, 'total': len(bank_items)},
        'disclaimer': 'Results show potential donors and reported stock. Please confirm directly. Medical eligibility is decided by the blood bank or doctor.',
    })
