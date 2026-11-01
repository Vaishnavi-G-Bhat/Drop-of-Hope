from datetime import datetime, timezone

from sqlalchemy import CheckConstraint

from .extensions import db


def utcnow():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint("role IN ('donor','patient','blood_bank','admin')", name='ck_users_role'),
        CheckConstraint("preferred_language IN ('en','kn')", name='ck_users_language'),
        CheckConstraint("is_verified IN (0, 1)", name='ck_users_verified'),
        CheckConstraint("is_active IN (0, 1)", name='ck_users_active'),
    )
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(32), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    preferred_language = db.Column(db.String(5), nullable=False, default='en')
    is_verified = db.Column(db.Boolean, nullable=False, default=False)
    verified_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    donor = db.relationship('Donor', uselist=False, back_populates='user', cascade='all, delete-orphan')
    patient = db.relationship('Patient', uselist=False, back_populates='user', cascade='all, delete-orphan')
    blood_bank = db.relationship('BloodBank', uselist=False, back_populates='user', cascade='all, delete-orphan')


class Donor(db.Model):
    __tablename__ = 'donors'
    __table_args__ = (
        CheckConstraint("age BETWEEN 18 AND 65", name='ck_donors_age'),
        CheckConstraint("blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')", name='ck_donors_blood_group'),
        CheckConstraint("availability_status IN ('Available','Unavailable','Contact me first')", name='ck_donors_availability'),
        CheckConstraint("notify_opt_in IN (0,1)", name='ck_donors_notify_opt_in'),
    )
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    blood_group = db.Column(db.String(10), nullable=False)
    city = db.Column(db.String(120), nullable=False)
    area = db.Column(db.String(120), nullable=True)
    pin_code = db.Column(db.String(10), nullable=False)
    availability_status = db.Column(db.String(30), nullable=False, default='Available')
    status_updated_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    notify_opt_in = db.Column(db.Boolean, nullable=False, default=False)
    notify_area = db.Column(db.String(120), nullable=True)
    last_donation_date = db.Column(db.Date, nullable=True)
    total_donations = db.Column(db.Integer, nullable=False, default=0)
    user = db.relationship('User', back_populates='donor')


class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    city = db.Column(db.String(120), nullable=True)
    area = db.Column(db.String(120), nullable=True)
    pin_code = db.Column(db.String(10), nullable=True)
    user = db.relationship('User', back_populates='patient')


class BloodBank(db.Model):
    __tablename__ = 'blood_banks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    license_number = db.Column(db.String(120), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(120), nullable=False)
    area = db.Column(db.String(120), nullable=True)
    pin_code = db.Column(db.String(10), nullable=False)
    contact_phone = db.Column(db.String(20), nullable=True)
    open_hours = db.Column(db.String(255), nullable=True)
    user = db.relationship('User', back_populates='blood_bank')


class BloodStock(db.Model):
    __tablename__ = 'blood_stock'
    __table_args__ = (
        CheckConstraint("blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')", name='ck_stock_blood_group'),
        CheckConstraint("units >= 0", name='ck_stock_units'),
        db.UniqueConstraint('blood_bank_id', 'blood_group', name='uq_stock_bank_group'),
    )
    id = db.Column(db.Integer, primary_key=True)
    blood_bank_id = db.Column(db.Integer, db.ForeignKey('blood_banks.id'), nullable=False)
    blood_group = db.Column(db.String(10), nullable=False)
    units = db.Column(db.Integer, nullable=False, default=0)
    last_updated_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)


class BloodRequest(db.Model):
    __tablename__ = 'blood_requests'
    __table_args__ = (
        CheckConstraint("blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')", name='ck_requests_blood_group'),
        CheckConstraint("units_needed >= 1", name='ck_requests_units'),
        CheckConstraint("urgency IN ('Normal','Urgent','Critical')", name='ck_requests_urgency'),
        CheckConstraint("status IN ('Pending','Response received','Resolved','Cancelled')", name='ck_requests_status'),
        CheckConstraint("flagged_for_review IN (0, 1)", name='ck_requests_flagged'),
    )
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_name = db.Column(db.String(255), nullable=True)
    blood_group = db.Column(db.String(10), nullable=False)
    units_needed = db.Column(db.Integer, nullable=False)
    hospital_name = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(120), nullable=False)
    area = db.Column(db.String(120), nullable=True)
    pin_code = db.Column(db.String(10), nullable=False)
    required_date = db.Column(db.Date, nullable=True)
    urgency = db.Column(db.String(20), nullable=False, default='Normal')
    contact_phone = db.Column(db.String(20), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), nullable=False, default='Pending')
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    status_updated_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    flagged_for_review = db.Column(db.Boolean, nullable=False, default=False)


class DonationResponse(db.Model):
    __tablename__ = 'donation_responses'
    __table_args__ = (
        CheckConstraint("response IN ('Accepted','Declined')", name='ck_response_value'),
        db.UniqueConstraint('request_id', 'donor_id', name='uq_donation_response'),
    )
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('blood_requests.id'), nullable=False)
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=False)
    response = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=True)
    responded_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class Notification(db.Model):
    __tablename__ = 'notifications'
    __table_args__ = (
        CheckConstraint("type IN ('emergency_request','response_received','status_update','verification','system')", name='ck_notification_type'),
        CheckConstraint("is_read IN (0, 1)", name='ck_notification_read'),
    )
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('blood_requests.id'), nullable=True)
    type = db.Column(db.String(40), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class Report(db.Model):
    __tablename__ = 'reports'
    __table_args__ = (
        CheckConstraint("target_type IN ('donor','blood_bank','request')", name='ck_report_target_type'),
        CheckConstraint("status IN ('Open','Resolved','Dismissed')", name='ck_report_status'),
    )
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    target_type = db.Column(db.String(20), nullable=False)
    target_id = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Open')
    admin_note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)


class RequestStatusHistory(db.Model):
    __tablename__ = 'request_status_history'
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('blood_requests.id'), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
