const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const { createApp } = require("../src/app");

function makeTestApp() {
  const records = [];
  let nextId = 1;
  const repository = {
    async findByEmail(email, options = {}) {
      const user = records.find(item => item.email === email);
      if (!user) return null;
      return options.includePasswordHash ? { ...user } : { ...user, passwordHash: undefined };
    },
    async create(data) {
      if (records.some(item => item.email === data.email)) {
        const error = new Error("Duplicate key");
        error.code = 11000;
        throw error;
      }
      const user = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
      records.push(user);
      return { ...user };
    },
    async findPublicById(id) {
      const user = records.find(item => item.id === String(id));
      return user ? { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } : null;
    },
    records
  };
  const config = {
    jwtSecret: "test_secret_for_automated_tests_only_123456789",
    jwtExpiresIn: "1h",
    bcryptSaltRounds: 10
  };
  return { app: createApp({ config, userRepository: repository }), repository };
}

test("signup creates account, hashes password and returns JWT", async () => {
  const { app, repository } = makeTestApp();
  const response = await request(app).post("/api/auth/signup").send({
    name: "Rahul Chauhan", email: "Rahul@example.com", password: "StrongPass123!"
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.token);
  assert.equal(response.body.data.user.email, "rahul@example.com");
  assert.equal(response.body.data.user.passwordHash, undefined);
  assert.notEqual(repository.records[0].passwordHash, "StrongPass123!");
  assert.equal(await bcrypt.compare("StrongPass123!", repository.records[0].passwordHash), true);
});

test("signup rejects invalid input", async () => {
  const { app } = makeTestApp();
  const response = await request(app).post("/api/auth/signup").send({
    name: "R", email: "not-an-email", password: "short"
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("signup rejects duplicate email", async () => {
  const { app } = makeTestApp();
  const payload = { name: "Rahul Chauhan", email: "rahul@example.com", password: "StrongPass123!" };
  assert.equal((await request(app).post("/api/auth/signup").send(payload)).status, 201);
  const duplicate = await request(app).post("/api/auth/signup").send(payload);
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error.code, "EMAIL_ALREADY_REGISTERED");
});

test("login returns a JWT for correct credentials", async () => {
  const { app } = makeTestApp();
  const payload = { name: "Rahul Chauhan", email: "rahul@example.com", password: "StrongPass123!" };
  await request(app).post("/api/auth/signup").send(payload);
  const response = await request(app).post("/api/auth/login").send({
    email: "RAHUL@example.com", password: "StrongPass123!"
  });
  assert.equal(response.status, 200);
  assert.ok(response.body.data.token);
});

test("login rejects incorrect password with generic credentials error", async () => {
  const { app } = makeTestApp();
  await request(app).post("/api/auth/signup").send({
    name: "Rahul Chauhan", email: "rahul@example.com", password: "StrongPass123!"
  });
  const response = await request(app).post("/api/auth/login").send({
    email: "rahul@example.com", password: "WrongPass123!"
  });
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "INVALID_CREDENTIALS");
});

test("protected profile rejects missing and invalid bearer tokens", async () => {
  const { app } = makeTestApp();
  const missing = await request(app).get("/api/users/me");
  assert.equal(missing.status, 401);
  assert.equal(missing.body.error.code, "AUTH_TOKEN_REQUIRED");

  const invalid = await request(app).get("/api/users/me").set("Authorization", "Bearer not.a.valid.token");
  assert.equal(invalid.status, 401);
  assert.equal(invalid.body.error.code, "INVALID_OR_EXPIRED_TOKEN");
});

test("protected profile accepts a valid JWT and returns public user data", async () => {
  const { app } = makeTestApp();
  const signup = await request(app).post("/api/auth/signup").send({
    name: "Rahul Chauhan", email: "rahul@example.com", password: "StrongPass123!"
  });
  const token = signup.body.data.token;
  const response = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
  assert.equal(response.status, 200);
  assert.equal(response.body.data.user.email, "rahul@example.com");
  assert.equal(response.body.data.user.passwordHash, undefined);
});

test("health endpoint responds successfully", async () => {
  const { app } = makeTestApp();
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, "ok");
});
