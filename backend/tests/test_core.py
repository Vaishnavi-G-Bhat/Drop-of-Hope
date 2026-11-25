import pytest

from app import create_app
from app.extensions import db


@pytest.fixture
def client():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()


def test_frontend_and_assets_are_served_by_the_api_app(client):
    homepage = client.get('/')
    stylesheet = client.get('/css/theme.css')
    frontend_config = client.get('/js/config.js')

    assert homepage.status_code == 200
    assert b'<title>Drop of Hope' in homepage.data
    assert homepage.headers['Cache-Control'] == 'no-store'
    assert stylesheet.status_code == 200
    assert b'--brand: #d91445' in stylesheet.data
    assert stylesheet.headers['Cache-Control'] == 'no-store'
    assert frontend_config.status_code == 200
    assert b'${location.origin}/api' in frontend_config.data


def test_frontend_requests_are_not_rate_limited(client):
    for path in ('/', '/css/theme.css'):
        response = None
        for _ in range(201):
            response = client.get(path)
        assert response.status_code == 200


def test_register_and_login(client):
    response = client.post('/api/auth/register/donor', json={
        'email': 'donor@example.com',
        'password': 'Password1!',
        'full_name': 'Jane Doe',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['success'] is True

    login = client.post('/api/auth/login', json={'email': 'donor@example.com', 'password': 'Password1!'})
    assert login.status_code == 200
    assert login.get_json()['success'] is True

    me = client.get('/api/auth/me')
    assert me.status_code == 200
    assert me.get_json()['data']['user']['role'] == 'donor'


def test_donor_can_update_availability(client):
    client.post('/api/auth/register/donor', json={
        'email': 'availability@example.com',
        'password': 'Password1!',
        'full_name': 'Available Donor',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/login', json={
        'email': 'availability@example.com',
        'password': 'Password1!',
    })

    unavailable = client.put(
        '/api/donors/me/availability',
        json={'availability_status': 'Unavailable'},
    )
    available = client.put(
        '/api/donors/me/availability',
        json={'availability_status': 'Available'},
    )

    assert unavailable.get_json()['data']['availability_status'] == 'Unavailable'
    assert available.get_json()['data']['availability_status'] == 'Available'


def test_role_protection(client):
    client.post('/api/auth/register/donor', json={
        'email': 'donor1@example.com',
        'password': 'Password1!',
        'full_name': 'Jane Doe',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/login', json={'email': 'donor1@example.com', 'password': 'Password1!'})
    resp = client.get('/api/admin/stats')
    assert resp.status_code == 403


def test_blood_bank_stock_update(client):
    client.post('/api/auth/register/blood-bank', json={
        'email': 'bank@example.com',
        'password': 'Password1!',
        'full_name': 'Bank Admin',
        'phone': '9876543211',
        'name': 'City Blood Bank',
        'license_number': 'B-001',
        'address': 'MG Road',
        'city': 'Bengaluru',
        'area': 'MG Road',
        'pin_code': '560001',
        'contact_phone': '9876543211',
        'open_hours': '9am-9pm',
    })
    client.post('/api/auth/login', json={'email': 'bank@example.com', 'password': 'Password1!'})
    resp = client.put('/api/blood-bank/stock', json={'stock': [{'blood_group': 'A+', 'units': 10}]})
    assert resp.status_code == 200
    assert resp.get_json()['success'] is True


def test_public_search_with_verified_donor_and_blood_bank(client):
    from app.models import BloodStock, User

    client.post('/api/auth/register/donor', json={
        'email': 'search-donor@example.com',
        'password': 'Password1!',
        'full_name': 'Search Donor',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/register/blood-bank', json={
        'email': 'search-bank@example.com',
        'password': 'Password1!',
        'full_name': 'Bank Contact',
        'phone': '9876543211',
        'name': 'Search Blood Bank',
        'city': 'Bengaluru',
        'pin_code': '560001',
        'contact_phone': '9876543211',
    })

    donor_user = User.query.filter_by(email='search-donor@example.com').one()
    bank_user = User.query.filter_by(email='search-bank@example.com').one()
    donor_user.is_verified = True
    bank_user.is_verified = True
    db.session.add(BloodStock(
        blood_bank_id=bank_user.blood_bank.id,
        blood_group='O+',
        units=4,
    ))
    db.session.commit()

    donor_search = client.get('/api/search/donors?blood_group=O%2B')
    bank_search = client.get('/api/search/blood-banks?blood_group=O%2B')
    emergency_search = client.get('/api/search/emergency?blood_group=O%2B')

    assert donor_search.status_code == 200
    assert donor_search.get_json()['data']['items'][0]['blood_group'] == 'O+'
    assert donor_search.get_json()['data']['items'][0]['country'] == 'India'
    assert donor_search.get_json()['data']['items'][0]['masked_phone'] is None
    location_search = client.get(
        '/api/search/donors?country=India&state=Karnataka&district=Bengaluru%20Urban'
    )
    assert location_search.get_json()['data']['total'] == 1
    wrong_location = client.get('/api/search/donors?state=Tamil%20Nadu')
    assert wrong_location.get_json()['data']['total'] == 0
    assert bank_search.status_code == 200
    assert bank_search.get_json()['data']['items'][0]['units_reported'] == 4
    assert emergency_search.status_code == 200
    assert emergency_search.get_json()['data']['donors']['total'] == 1
    assert emergency_search.get_json()['data']['blood_banks']['total'] == 1


def test_emergency_search_returns_all_matching_listings_and_details(client):
    from app.models import BloodStock, User

    for index in range(2):
        client.post('/api/auth/register/donor', json={
            'email': f'multi-donor-{index}@example.com',
            'password': 'Password1!',
            'full_name': f'Matching Donor {index}',
            'phone': f'987654321{index}',
            'age': 26,
            'blood_group': 'O+',
            'country': 'India',
            'state': 'Karnataka',
            'district': 'Bengaluru Urban',
            'city': 'Bengaluru',
            'area': 'MG Road',
            'pin_code': '560001',
        })
        donor_user = User.query.filter_by(email=f'multi-donor-{index}@example.com').one()
        donor_user.is_verified = True

    for index in range(3):
        client.post('/api/auth/register/blood-bank', json={
            'email': f'multi-bank-{index}@example.com',
            'password': 'Password1!',
            'full_name': f'Bank Contact {index}',
            'phone': f'987654322{index}',
            'name': f'Matching Blood Bank {index}',
            'license_number': f'LIC-{index}',
            'address': f'{index} MG Road',
            'city': 'Bengaluru',
            'area': 'MG Road',
            'pin_code': '560001',
            'contact_phone': f'987654322{index}',
            'open_hours': '9am-9pm',
        })
        bank_user = User.query.filter_by(email=f'multi-bank-{index}@example.com').one()
        bank_user.is_verified = True
        if index < 2:
            db.session.add(BloodStock(
                blood_bank_id=bank_user.blood_bank.id,
                blood_group='O+',
                units=4 + index,
            ))
    db.session.commit()

    response = client.get(
        '/api/search/emergency?blood_group=O%2B&city=Bengaluru'
        '&area=MG%20Road&pin_code=560001&location_scope=city'
    )
    data = response.get_json()['data']

    assert response.status_code == 200
    assert data['donors']['total'] == 2
    assert all(item['pin_code'] == '560001' for item in data['donors']['items'])
    assert data['blood_banks']['total'] == 2
    first_bank = data['blood_banks']['items'][0]
    assert first_bank['blood_group'] == 'O+'
    assert first_bank['units_reported'] in (4, 5)
    assert first_bank['license_number'].startswith('LIC-')
    assert first_bank['open_hours'] == '9am-9pm'
    assert first_bank['pin_code'] == '560001'


def test_city_scoped_emergency_search_ranks_matching_area_first(client):
    from app.models import User

    donors = [
        {
            'email': 'nearby@example.com',
            'full_name': 'Nearby Donor',
            'area': 'MG Road',
            'pin_code': '560001',
            'city': 'Bengaluru',
        },
        {
            'email': 'citywide@example.com',
            'full_name': 'Citywide Donor',
            'area': 'Whitefield',
            'pin_code': '560066',
            'city': 'Bengaluru',
        },
        {
            'email': 'other-city@example.com',
            'full_name': 'Other City Donor',
            'area': 'Central',
            'pin_code': '570001',
            'city': 'Mysuru',
        },
    ]
    for donor in donors:
        response = client.post('/api/auth/register/donor', json={
            'email': donor['email'],
            'password': 'Password1!',
            'full_name': donor['full_name'],
            'phone': '9876543210',
            'age': 26,
            'blood_group': 'O+',
            'country': 'India',
            'state': 'Karnataka',
            'district': 'Bengaluru Urban',
            'city': donor['city'],
            'area': donor['area'],
            'pin_code': donor['pin_code'],
        })
        assert response.status_code == 201
        user = User.query.filter_by(email=donor['email']).one()
        user.is_verified = True
    db.session.commit()

    response = client.get(
        '/api/search/emergency?blood_group=O%2B&city=BENGALURU'
        '&area=MG%20Road&pin_code=560001&location_scope=city'
    )
    donor_items = response.get_json()['data']['donors']['items']

    assert response.status_code == 200
    assert len(donor_items) == 2
    assert donor_items[0]['area'] == 'MG Road'
    assert donor_items[1]['area'] == 'Whitefield'


def test_donor_request_details_and_donation_confirmation(client):
    from datetime import date
    from app.models import User

    donor_registration = client.post('/api/auth/register/donor', json={
        'email': 'nearby-donor@example.com',
        'password': 'Password1!',
        'full_name': 'Nearby Donor',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'area': 'MG Road',
        'pin_code': '560001',
    })
    assert donor_registration.status_code == 201
    donor_user = User.query.filter_by(email='nearby-donor@example.com').one()
    donor_user.is_verified = True
    db.session.commit()

    patient_registration = client.post('/api/auth/register/patient', json={
        'email': 'requester@example.com',
        'password': 'Password1!',
        'full_name': 'Requester Example',
        'phone': '9876543211',
        'city': 'Bengaluru',
    })
    assert patient_registration.status_code == 201
    client.post('/api/auth/login', json={
        'email': 'requester@example.com',
        'password': 'Password1!',
    })
    request_response = client.post('/api/requests', json={
        'patient_name': 'Patient Example',
        'blood_group': 'O+',
        'units_needed': 2,
        'urgency': 'Urgent',
        'required_date': date.today().isoformat(),
        'hospital_name': 'City Hospital',
        'city': 'Bengaluru',
        'area': 'MG Road',
        'pin_code': '560001',
        'contact_phone': '9876543212',
        'notes': 'Contact at the hospital reception.',
    })
    assert request_response.status_code == 201
    request_id = request_response.get_json()['data']['id']
    client.post('/api/auth/logout')

    client.post('/api/auth/login', json={
        'email': 'nearby-donor@example.com',
        'password': 'Password1!',
    })
    donor_requests = client.get('/api/donors/me/requests').get_json()['data']['items']
    request_item = next(item for item in donor_requests if item['id'] == request_id)
    assert request_item['units_needed'] == 2
    assert request_item['required_date'] == date.today().isoformat()
    assert 'patient_name' not in request_item
    assert 'contact_phone' not in request_item
    assert 'notes' not in request_item

    accepted = client.post(
        f'/api/donors/me/requests/{request_id}/respond',
        json={'response': 'Accepted'},
    )
    assert accepted.status_code == 200
    accepted_item = next(
        item for item in client.get('/api/donors/me/requests').get_json()['data']['items']
        if item['id'] == request_id
    )
    assert accepted_item['patient_name'] == 'Patient Example'
    assert accepted_item['contact_phone'] == '9876543212'
    assert accepted_item['notes'] == 'Contact at the hospital reception.'

    client.post('/api/auth/logout')
    client.post('/api/auth/login', json={
        'email': 'requester@example.com',
        'password': 'Password1!',
    })
    confirm = client.post(
        f'/api/requests/{request_id}/confirm-donation',
        json={'donor_id': donor_user.donor.id},
    )
    assert confirm.status_code == 200
    db.session.refresh(donor_user.donor)
    assert donor_user.donor.last_donation_date == date.today()
    assert donor_user.donor.total_donations == 1

    duplicate_confirm = client.post(
        f'/api/requests/{request_id}/confirm-donation',
        json={'donor_id': donor_user.donor.id},
    )
    assert duplicate_confirm.status_code == 409
    db.session.refresh(donor_user.donor)
    assert donor_user.donor.total_donations == 1


@pytest.mark.parametrize(
    'password',
    ['password1!', 'PASSWORD1!', 'Password!!', 'Password1', 'Pass1!'],
)
def test_registration_rejects_weak_passwords(client, password):
    response = client.post('/api/auth/register/patient', json={
        'email': 'patient@example.com',
        'password': password,
        'full_name': 'Pat Example',
        'phone': '9876543210',
        'city': 'Bengaluru',
    })

    assert response.status_code == 400
    assert 'special character' in response.get_json()['error']['message']


def test_donation_follow_up_notification_is_created_once(client):
    from datetime import date, timedelta
    from app.models import Notification, User

    client.post('/api/auth/register/donor', json={
        'email': 'reminder@example.com',
        'password': 'Password1!',
        'full_name': 'Reminder Donor',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'country': 'India',
        'state': 'Karnataka',
        'district': 'Bengaluru Urban',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/login', json={
        'email': 'reminder@example.com',
        'password': 'Password1!',
    })
    donor = User.query.filter_by(email='reminder@example.com').one().donor
    donor.last_donation_date = date.today() - timedelta(days=89)
    db.session.commit()
    before_due = client.get('/api/notifications')
    assert before_due.get_json()['data']['total'] == 0

    donor.last_donation_date = date.today() - timedelta(days=90)
    db.session.commit()

    first = client.get('/api/notifications')
    second = client.get('/api/notifications')

    assert first.get_json()['data']['total'] == 1
    assert second.get_json()['data']['total'] == 1
    notification = Notification.query.filter_by(user_id=donor.user_id).one()
    assert notification.type == 'system'
    assert 'not medical clearance' in notification.message
