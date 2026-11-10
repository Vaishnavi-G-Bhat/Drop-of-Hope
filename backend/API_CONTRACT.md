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

Registration accepts `email`, `password` (at least 8 characters), `full_name`, and a 10-digit `phone`. Donors also provide `age` (18–65), `blood_group`, `city`, and a 6-digit `pin_code`; requesters provide `city` and may provide `area` and `pin_code`; blood banks provide `name`, `city`, and `pin_code`, with license, address, area, public contact phone, and opening hours optional. Public registration supports donor, patient, and blood-bank roles, not admin. Registration does not sign the account in. New donor and blood-bank accounts require admin verification to appear in public search.

Authentication uses the Flask session cookie. Browser clients must send credentials and use a consistent hostname for the API and frontend.
The backend currently supports email/password login only; Google OAuth is not implemented.

## Search

- GET `/api/search/donors`
- GET `/api/search/blood-banks`
- GET `/api/search/emergency`

Search accepts optional `blood_group`, `city`, and `pin_code`; donor searches also accept `area` and `compatible=true`. Results contain verified, active listings. Contact fields are only returned for a signed-in session. Blood-bank search can be queried once per blood group; the API does not expose a consolidated inventory summary. Search results and stock are reported information and must be confirmed directly.

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

## Notifications

- GET `/api/notifications`
- PUT `/api/notifications/<id>/read`
- PUT `/api/notifications/read-all`

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
