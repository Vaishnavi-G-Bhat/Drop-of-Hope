# API Contract

This project exposes all endpoints under `/api`.

## Auth

- POST `/api/auth/register/donor`
- POST `/api/auth/register/patient`
- POST `/api/auth/register/blood-bank`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- PUT `/api/auth/language`

Registration accepts `email`, `password` (at least 8 characters, including uppercase and lowercase letters, a number, and a special character), `full_name`, and a 10-digit `phone`. Donors also provide `age` (18–65), `blood_group`, `country`, `state`, `district`, `city`, and a 6-digit `pin_code`; requesters provide `city` and may provide `area` and `pin_code`; blood banks provide `name`, `city`, and `pin_code`, with license, address, area, public contact phone, and opening hours optional. Public registration supports donor, patient, and blood-bank roles, not admin. Registration does not sign the account in. New donor and blood-bank accounts require admin verification to appear in public search.

Authentication uses the Flask session cookie. Browser clients must send credentials and use a consistent hostname for the API and frontend.
The backend currently supports email/password login only; Google OAuth is not implemented.

## Search

- GET `/api/search/donors`
- GET `/api/search/blood-banks`
- GET `/api/search/emergency`

Search accepts optional `blood_group`, `country`, `state`, `district`, `city`, and `pin_code`; donor searches also accept `area` and `compatible=true`. Results contain verified, active listings. Contact fields are only returned for a signed-in session. Emergency search accepts `location_scope=city` to include all matching donors in the city while ranking the request's PIN code and area first. Blood-bank search can be queried once per blood group; the API does not expose a consolidated inventory summary. Search results and stock are reported information and must be confirmed directly.

## Donor

- GET `/api/donors/me`
- PUT `/api/donors/me`
- PUT `/api/donors/me/availability`
- POST `/api/donors/me/confirm`
- PUT `/api/donors/me/notifications`
- GET `/api/donors/me/requests`
- POST `/api/donors/me/requests/<request_id>/respond`
- GET `/api/donors/me/history`
- GET `/api/donors/me/certificate`

The donor request list contains open same-city requests matching the donor's blood group. It shows blood group, units, urgency, required date, hospital and location before acceptance. The requester's name, notes and phone are returned only after that donor accepts.

## Patient

- GET `/api/patients/me`
- PUT `/api/patients/me`

Patient profile routes require the patient role.

## Blood bank

- GET `/api/blood-bank/me`
- PUT `/api/blood-bank/me`
- GET `/api/blood-bank/stock`
- PUT `/api/blood-bank/stock`
- POST `/api/blood-bank/stock/confirm`

Blood-bank profile and stock routes require the blood-bank role. The profile update currently handles account phone, bank name, city, area, PIN code, contact phone, and open hours; it does not update address or license number.

## Requests

- POST `/api/requests`
- GET `/api/requests/mine`
- GET `/api/requests/<id>`
- PUT `/api/requests/<id>/status`
- POST `/api/requests/<id>/confirm-donation`
- GET `/api/blood-bank/requests`

Request creation and status changes require the patient role. Creation requires blood group, units (at least one), and a future/current `required_date`, plus a valid city and 6-digit PIN code. Blood-bank request listing is read-only; there is no blood-bank endpoint for changing a request's status.

After a requester confirms an accepted donation, the donor's `last_donation_date` and `total_donations` are updated once. Request details show verified same-city donor matches, with matching area and PIN code ranked first; donor contact details remain masked in search.

## Notifications

- GET `/api/notifications`
- PUT `/api/notifications/<id>/read`
- PUT `/api/notifications/read-all`

For donors with a recorded last donation date, polling notifications creates a follow-up reminder after 90 days. This is informational only, not medical clearance; donors should confirm eligibility with a licensed blood bank or healthcare professional.

## Admin

- GET `/api/admin/stats`
- GET `/api/admin/users`
- PUT `/api/admin/users/<id>/verify`
- PUT `/api/admin/users/<id>/active`
- DELETE `/api/admin/users/<id>`
- GET `/api/admin/requests`
- GET `/api/admin/reports`
- PUT `/api/admin/reports/<id>`
- DELETE `/api/admin/stock/<id>`
