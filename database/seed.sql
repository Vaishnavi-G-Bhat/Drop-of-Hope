-- Demo seed data for local testing.
-- Safe to run more than once with INSERT OR IGNORE / UPDATE logic.

INSERT OR IGNORE INTO users (
    id,
    email,
    password_hash,
    role,
    full_name,
    phone,
    preferred_language,
    is_verified,
    verified_by,
    verified_at,
    is_active,
    created_at
) VALUES (
    1,
    'admin@truedrop.local',
    '$2b$12$5J3b7j2tU9nJ6l6Z3UQV6u0.Iklk1JY8FCrV2k5iWvpcV5Yh9eN0O',
    'admin',
    'System Administrator',
    '9999999999',
    'en',
    1,
    NULL,
    CURRENT_TIMESTAMP,
    1,
    CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO donors (
    id,
    user_id,
    age,
    blood_group,
    city,
    area,
    pin_code,
    availability_status,
    status_updated_at,
    notify_opt_in,
    notify_area,
    last_donation_date,
    total_donations
) VALUES (
    1,
    1,
    28,
    'O+',
    'Bengaluru',
    'Koramangala',
    '560095',
    'Available',
    CURRENT_TIMESTAMP,
    1,
    '560095',
    DATE('2025-01-10'),
    2
);

INSERT OR IGNORE INTO blood_banks (
    id,
    user_id,
    name,
    license_number,
    address,
    city,
    area,
    pin_code,
    contact_phone,
    open_hours
) VALUES (
    1,
    1,
    'City Blood Bank',
    'BB-001',
    'MG Road',
    'Bengaluru',
    'MG Road',
    '560001',
    '9887766554',
    '9:00 AM - 8:00 PM'
);

INSERT OR IGNORE INTO blood_stock (
    id,
    blood_bank_id,
    blood_group,
    units,
    last_updated_at,
    updated_by
) VALUES (
    1,
    1,
    'O+',
    12,
    CURRENT_TIMESTAMP,
    1
);

INSERT OR IGNORE INTO blood_requests (
    id,
    requester_id,
    patient_name,
    blood_group,
    units_needed,
    hospital_name,
    city,
    area,
    pin_code,
    required_date,
    urgency,
    contact_phone,
    notes,
    status,
    created_at,
    status_updated_at,
    flagged_for_review
) VALUES (
    1,
    1,
    'Sample Patient',
    'O+',
    2,
    'Narayana Hospital',
    'Bengaluru',
    'Koramangala',
    '560095',
    DATE('2030-12-01'),
    'Urgent',
    '9876543210',
    'Need urgent support',
    'Pending',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
);

INSERT OR IGNORE INTO notifications (
    id,
    user_id,
    request_id,
    type,
    title,
    message,
    is_read,
    created_at
) VALUES (
    1,
    1,
    1,
    'emergency_request',
    'Emergency blood request',
    'A new emergency request is active in Bengaluru.',
    0,
    CURRENT_TIMESTAMP
);
