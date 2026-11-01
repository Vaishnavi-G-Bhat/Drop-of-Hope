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

## Search

- GET `/api/search/donors`
- GET `/api/search/blood-banks`
- GET `/api/search/emergency`

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

## Requests

- POST `/api/requests`
- GET `/api/requests/mine`
- GET `/api/requests/<id>`
- PUT `/api/requests/<id>/status`
- POST `/api/requests/<id>/confirm-donation`
- GET `/api/blood-bank/requests`

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
