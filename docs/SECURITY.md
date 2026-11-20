# Security Notes

- Passwords are hashed with bcryptjs; plaintext passwords are never persisted.
- Signup and login enforce input validation and a 72-byte password upper bound compatible with bcrypt.
- The Mongoose model excludes `passwordHash` from ordinary query projections and JSON output.
- JWTs are signed with an environment-configured secret, include issuer/audience claims and have a configurable expiry.
- Protected routes require `Authorization: Bearer <token>` and confirm the user still exists.
- Helmet adds standard HTTP security headers.
- Signup/login share a rate limiter to slow repeated authentication attempts.
- Responses use a generic invalid-credentials message for unknown email and wrong password.
- `.env` is ignored by Git; only `.env.example` is committed.

## Production hardening before real deployment
Use a high-entropy secret from a secret manager, HTTPS, a managed MongoDB deployment with restricted network access, monitoring, a stricter per-IP/per-account rate-limit strategy, email verification, password reset flow, refresh-token rotation/revocation and security review. Never commit production credentials.
