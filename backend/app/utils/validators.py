import re
from datetime import date, datetime

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
PHONE_RE = re.compile(r'^\d{10}$')
PIN_RE = re.compile(r'^\d{6}$')


def require_fields(data, fields):
    missing = [field for field in fields if data.get(field) in (None, '')]
    if missing:
        raise ValueError(f'Missing required fields: {missing}')


def validate_email(value):
    if not value or not EMAIL_RE.match(value.strip()):
        raise ValueError('Invalid email format')
    return value.strip().lower()


def validate_password(value):
    if not value or len(value) < 8:
        raise ValueError('Password must be at least 8 characters long')
    return value


def validate_phone(value):
    digits = ''.join(ch for ch in str(value or '') if ch.isdigit())
    if len(digits) != 10:
        raise ValueError('Phone must be 10 digits')
    return digits


def validate_pincode(value):
    digits = ''.join(ch for ch in str(value or '') if ch.isdigit())
    if len(digits) != 6:
        raise ValueError('PIN code must be 6 digits')
    return digits


def validate_age(value):
    age = int(value)
    if age < 18 or age > 65:
        raise ValueError('Age must be between 18 and 65')
    return age


def validate_units(value):
    v = int(value)
    if v < 1:
        raise ValueError('Units must be at least 1')
    return v


def validate_required_date(value):
    if isinstance(value, str):
        try:
            d = date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError('required_date must be a valid ISO date') from exc
    elif isinstance(value, datetime):
        d = value.date()
    else:
        raise ValueError('required_date must be a valid date')
    if d < date.today():
        raise ValueError('required_date cannot be in the past')
    return d.isoformat()
