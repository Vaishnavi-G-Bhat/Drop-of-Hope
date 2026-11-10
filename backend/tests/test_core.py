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


def test_register_and_login(client):
    response = client.post('/api/auth/register/donor', json={
        'email': 'donor@example.com',
        'password': 'Password1',
        'full_name': 'Jane Doe',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['success'] is True

    login = client.post('/api/auth/login', json={'email': 'donor@example.com', 'password': 'Password1'})
    assert login.status_code == 200
    assert login.get_json()['success'] is True

    me = client.get('/api/auth/me')
    assert me.status_code == 200
    assert me.get_json()['data']['user']['role'] == 'donor'


def test_role_protection(client):
    client.post('/api/auth/register/donor', json={
        'email': 'donor1@example.com',
        'password': 'Password1',
        'full_name': 'Jane Doe',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/login', json={'email': 'donor1@example.com', 'password': 'Password1'})
    resp = client.get('/api/admin/stats')
    assert resp.status_code == 403


def test_blood_bank_stock_update(client):
    client.post('/api/auth/register/blood-bank', json={
        'email': 'bank@example.com',
        'password': 'Password1',
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
    client.post('/api/auth/login', json={'email': 'bank@example.com', 'password': 'Password1'})
    resp = client.put('/api/blood-bank/stock', json={'stock': [{'blood_group': 'A+', 'units': 10}]})
    assert resp.status_code == 200
    assert resp.get_json()['success'] is True


def test_public_search_with_verified_donor_and_blood_bank(client):
    from app.models import BloodStock, User

    client.post('/api/auth/register/donor', json={
        'email': 'search-donor@example.com',
        'password': 'Password1',
        'full_name': 'Search Donor',
        'phone': '9876543210',
        'age': 26,
        'blood_group': 'O+',
        'city': 'Bengaluru',
        'pin_code': '560001',
    })
    client.post('/api/auth/register/blood-bank', json={
        'email': 'search-bank@example.com',
        'password': 'Password1',
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
    assert donor_search.get_json()['data']['items'][0]['masked_phone'] is None
    assert bank_search.status_code == 200
    assert bank_search.get_json()['data']['items'][0]['units_reported'] == 4
    assert emergency_search.status_code == 200
    assert emergency_search.get_json()['data']['donors']['total'] == 1
    assert emergency_search.get_json()['data']['blood_banks']['total'] == 1
