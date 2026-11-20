# Test Plan and Expected Results

| Scenario | Request | Expected HTTP status | Expected result |
|---|---|---:|---|
| Health | `GET /api/health` | 200 | API reports `ok` |
| Signup | `POST /api/auth/signup` | 201 | Public user and JWT returned |
| Invalid signup | Missing/invalid fields | 400 | Validation error details |
| Duplicate signup | Same email again | 409 | Duplicate email error |
| Login | Correct email/password | 200 | JWT returned |
| Wrong password | Incorrect password | 401 | Generic invalid credentials |
| Protected profile | Valid Bearer JWT | 200 | Public profile returned |
| Missing token | No Authorization header | 401 | Token required |
| Invalid token | Malformed/expired JWT | 401 | Invalid or expired token |

Automated test cases are implemented in `test/auth.test.js`. Run `npm test`.
