PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('donor','patient','blood_bank','admin')) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en' CHECK(preferred_language IN ('en', 'kn')),
  is_verified INTEGER DEFAULT 0 CHECK(is_verified IN (0, 1)),
  verified_by INTEGER REFERENCES users(id),
  verified_at TEXT,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE REFERENCES users(id),
  age INTEGER CHECK(age BETWEEN 18 AND 65),
  blood_group TEXT CHECK(blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  city TEXT NOT NULL,
  area TEXT,
  pin_code TEXT NOT NULL,
  availability_status TEXT DEFAULT 'Available' CHECK(availability_status IN ('Available','Unavailable','Contact me first')),
  status_updated_at TEXT,
  notify_opt_in INTEGER DEFAULT 0 CHECK(notify_opt_in IN (0,1)),
  notify_area TEXT,
  last_donation_date TEXT,
  total_donations INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE REFERENCES users(id),
  city TEXT,
  area TEXT,
  pin_code TEXT
);

CREATE TABLE IF NOT EXISTS blood_banks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE REFERENCES users(id),
  name TEXT NOT NULL,
  license_number TEXT,
  address TEXT,
  city TEXT NOT NULL,
  area TEXT,
  pin_code TEXT NOT NULL,
  contact_phone TEXT,
  open_hours TEXT
);

CREATE TABLE IF NOT EXISTS blood_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blood_bank_id INTEGER REFERENCES blood_banks(id),
  blood_group TEXT CHECK(blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  units INTEGER CHECK(units >= 0),
  last_updated_at TEXT,
  updated_by INTEGER REFERENCES users(id),
  UNIQUE(blood_bank_id, blood_group)
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER REFERENCES users(id),
  patient_name TEXT,
  blood_group TEXT,
  units_needed INTEGER CHECK(units_needed >= 1),
  hospital_name TEXT,
  city TEXT,
  area TEXT,
  pin_code TEXT,
  required_date TEXT,
  urgency TEXT DEFAULT 'Normal' CHECK(urgency IN ('Normal','Urgent','Critical')),
  contact_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Response received','Resolved','Cancelled')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status_updated_at TEXT,
  flagged_for_review INTEGER DEFAULT 0 CHECK(flagged_for_review IN (0,1))
);

CREATE TABLE IF NOT EXISTS donation_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER REFERENCES blood_requests(id),
  donor_id INTEGER REFERENCES donors(id),
  response TEXT CHECK(response IN ('Accepted','Declined')),
  message TEXT,
  responded_at TEXT,
  UNIQUE(request_id, donor_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  request_id INTEGER REFERENCES blood_requests(id),
  type TEXT CHECK(type IN ('emergency_request','response_received','status_update','verification','system')),
  title TEXT,
  message TEXT,
  is_read INTEGER DEFAULT 0 CHECK(is_read IN (0,1)),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER REFERENCES users(id),
  target_type TEXT CHECK(target_type IN ('donor','blood_bank','request')),
  target_id INTEGER,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Open' CHECK(status IN ('Open','Resolved','Dismissed')),
  admin_note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_donors_blood_group_city_pin ON donors(blood_group, city, pin_code);
CREATE INDEX IF NOT EXISTS idx_blood_stock_blood_group ON blood_stock(blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status_group_city ON blood_requests(status, blood_group, city);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
