# SDM Technology Internship — Week 5
## Secure User Authentication API

A backend authentication service built with Node.js, Express and MongoDB. It supports account registration, password hashing, login, signed JWT access tokens and a protected user-profile endpoint.

> **Submission status:** Source, API documentation, Postman collection, automated tests and a visual demo walkthrough are included. A real MongoDB-backed local run and live Postman recording must be performed on your machine before claiming live execution evidence.

---

## 1. Project overview

This project demonstrates a standard stateless authentication flow:

1. A new user submits their name, email and password.
2. The API validates the request and hashes the password with bcrypt.
3. MongoDB stores the user profile and password hash.
4. During login, bcrypt compares the submitted password with the stored hash.
5. If credentials match, the API signs a JWT with a configured secret and expiry.
6. A client sends the token as a Bearer token to a protected endpoint.
7. The API verifies the token and confirms that the user still exists before returning the profile.

## 2. Features

- User signup with name, email and password validation.
- Email normalization and duplicate-account protection.
- bcrypt password hashing (configurable salt rounds; default 12).
- User login with generic invalid-credentials responses.
- JWT access token with expiry, issuer and audience claims.
- Protected `GET /api/users/me` endpoint.
- MongoDB persistence through Mongoose.
- Consistent JSON success and error responses.
- Helmet security headers and authentication rate limiting.
- Centralized error handling and unknown-route handling.
- Postman collection with positive and negative test cases.
- Automated API tests using Node's test runner and Supertest.

## 3. Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20+ | JavaScript server runtime |
| HTTP framework | Express 4 | API routing and middleware |
| Database | MongoDB | Persistent user records |
| ODM | Mongoose | Schema and database access |
| Password hashing | bcryptjs | One-way password hashing |
| Authentication | jsonwebtoken | JWT signing and verification |
| Security headers | Helmet | Baseline HTTP security headers |
| Rate limiting | express-rate-limit | Limits repeated signup/login attempts |
| Configuration | dotenv | Loads environment configuration |
| API testing | Postman | Manual endpoint verification |
| Automated tests | node:test + Supertest | API behavior checks |

## 4. API endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Register an account |
| POST | `/api/auth/login` | No | Authenticate and receive JWT |
| GET | `/api/users/me` | Bearer JWT | Return current user's profile |

Detailed request/response examples are in [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md).

## 5. Project structure

```text
SDM_Week5_Authentication/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── env.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── error-handler.js
│   ├── models/
│   │   └── User.js
│   ├── repositories/
│   │   └── user.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   └── auth.service.js
│   └── utils/
│       ├── http-error.js
│       └── validators.js
├── test/
│   └── auth.test.js
├── postman/
│   └── SDM-Week5-Authentication.postman_collection.json
├── docs/
│   ├── API_REFERENCE.md
│   ├── SECURITY.md
│   └── DEMO_RECORDING_GUIDE.md
├── Output/
│   ├── demo-walkthrough.mp4
│   ├── demo-storyboard.png
│   └── test-plan.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 6. Prerequisites

- Node.js 20 or newer and npm.
- MongoDB Community Server running locally, or a MongoDB Atlas connection string.
- Postman for manual endpoint testing.

## 7. Installation and configuration

### Step 1 — Install packages

```bash
npm install
```

### Step 2 — Create environment file

Copy `.env.example` to `.env` and configure your local values:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sdm_week5_auth
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

Generate a strong local JWT secret instead of using the example value. Never commit `.env`.

### Step 3 — Start MongoDB

Ensure your local MongoDB service is running, or use a MongoDB Atlas URI in `MONGODB_URI`.

### Step 4 — Start the API

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The API listens at `http://localhost:3000` by default. The server connects to MongoDB before accepting requests.

## 8. Test with Postman

1. Start MongoDB and the API.
2. Open Postman and choose **Import**.
3. Select `postman/SDM-Week5-Authentication.postman_collection.json`.
4. Run the requests in order:
   - Health check
   - Signup
   - Login
   - Protected profile with valid token
   - Protected profile without token
   - Login with wrong password
   - Duplicate signup
5. The signup and login requests save the returned token in the collection variable `accessToken`.

The collection uses `http://localhost:3000` as its default base URL.

## 9. Automated tests

Run:

```bash
npm test
```

The test suite checks:
- Successful signup and JWT issuance.
- Password is hashed and can be verified with bcrypt.
- Invalid signup input.
- Duplicate email rejection.
- Successful login.
- Incorrect password rejection.
- Missing and invalid Bearer token rejection.
- Successful access to a protected route.
- Health endpoint response.

The automated tests use an isolated in-memory repository adapter so they do not require a running MongoDB instance. They exercise the real Express routes, service logic, bcrypt and JWT code. They do not replace a final integration test against your MongoDB instance.

## 10. Demo video and output evidence

`Output/demo-walkthrough.mp4` is a visual walkthrough of the endpoint sequence and expected API behavior. It is not a live screen recording of Postman or MongoDB. Follow `docs/DEMO_RECORDING_GUIDE.md` to record the actual local application workflow for an evaluator who requires live footage.

Never expose `.env`, passwords or complete JWTs in a public recording.

## 11. Security considerations

- Passwords are never stored in plaintext.
- Password hashes are excluded from normal user queries and JSON responses.
- JWTs are signed using a secret from environment configuration.
- Tokens have an expiry and issuer/audience validation.
- Protected routes require a valid Bearer token and a still-existing account.
- Authentication endpoints are rate-limited.
- See [`docs/SECURITY.md`](docs/SECURITY.md) for production hardening recommendations.

## 12. Important scope notes

This is an educational authentication API, not a complete production identity platform. It does not include email verification, password reset, refresh-token rotation, logout/revocation, roles/permissions or account lockout. Those should be added before production use.

---

**Prepared for:** SDM Technology Internship — Week 5: Authentication  
**Project:** Secure Signup/Login with Hashed Passwords and JWT
