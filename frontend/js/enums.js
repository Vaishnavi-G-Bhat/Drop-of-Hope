export const BLOOD_GROUPS = Object.freeze([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]);

export const AVAILABILITY_STATUSES = Object.freeze([
  'Available',
  'Unavailable',
  'Contact me first',
]);

export const REQUEST_STATUSES = Object.freeze([
  'Pending',
  'Response received',
  'Resolved',
  'Cancelled',
]);

export const URGENCY_LEVELS = Object.freeze(['Normal', 'Urgent', 'Critical']);
export const DONATION_RESPONSES = Object.freeze(['Accepted', 'Declined']);
export const NOTIFICATION_TYPES = Object.freeze([
  'emergency_request',
  'response_received',
  'status_update',
  'verification',
  'system',
]);
export const REPORT_TARGET_TYPES = Object.freeze(['donor', 'blood_bank', 'request']);
export const REPORT_STATUSES = Object.freeze(['Open', 'Resolved', 'Dismissed']);
export const FRESHNESS_STATUSES = Object.freeze(['Current', 'Needs confirmation']);
export const ROLES = Object.freeze(['donor', 'patient', 'blood_bank', 'admin']);
export const LANGUAGES = Object.freeze(['en', 'kn']);
