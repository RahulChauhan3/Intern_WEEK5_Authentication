# API Reference

Base URL (local): `http://localhost:3000`

All responses are JSON and use a `success` boolean.

## `GET /api/health`
Returns service status and server timestamp. No authentication required.

## `POST /api/auth/signup`
Creates an account and returns a signed access token.

Request:
```json
{
  "name": "Rahul Chauhan",
  "email": "rahul@example.com",
  "password": "StrongPass123!"
}
```
Success: `201 Created`. Duplicate email: `409 Conflict`. Invalid fields: `400 Bad Request`.

## `POST /api/auth/login`
Checks email and password, then returns a signed access token.

Request:
```json
{
  "email": "rahul@example.com",
  "password": "StrongPass123!"
}
```
Success: `200 OK`. Incorrect credentials: `401 Unauthorized`.

## `GET /api/users/me`
Protected route. Send `Authorization: Bearer <JWT>`. Returns the authenticated user's public profile. Missing, invalid or expired token: `401 Unauthorized`.

## Error shape
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```
