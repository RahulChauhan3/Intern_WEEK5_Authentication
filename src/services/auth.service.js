const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/http-error");
const { validateSignup, validateLogin } = require("../utils/validators");

function createAuthService({ userRepository, config }) {
  async function signup(payload) {
    const { errors, value } = validateSignup(payload);
    if (errors.length) throw new HttpError(400, "VALIDATION_ERROR", "Please correct the submitted fields.", errors);

    const existing = await userRepository.findByEmail(value.email);
    if (existing) throw new HttpError(409, "EMAIL_ALREADY_REGISTERED", "An account with this email already exists.");

    const passwordHash = await bcrypt.hash(value.password, config.bcryptSaltRounds);
    let user;
    try {
      user = await userRepository.create({
        name: value.name,
        email: value.email,
        passwordHash
      });
    } catch (error) {
      // The unique database index is the final protection against concurrent duplicate signups.
      if (error && error.code === 11000) {
        throw new HttpError(409, "EMAIL_ALREADY_REGISTERED", "An account with this email already exists.");
      }
      throw error;
    }

    const token = signToken(user);
    return { user: publicUser(user), token };
  }

  async function login(payload) {
    const { errors, value } = validateLogin(payload);
    if (errors.length) throw new HttpError(400, "VALIDATION_ERROR", "Please provide a valid email and password.", errors);

    const user = await userRepository.findByEmail(value.email, { includePasswordHash: true });
    // Same response for unknown email and wrong password to reduce account enumeration.
    if (!user) throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");

    const passwordMatches = await bcrypt.compare(value.password, user.passwordHash);
    if (!passwordMatches) throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");

    const token = signToken(user);
    return { user: publicUser(user), token };
  }

  function signToken(user) {
    return jwt.sign(
      { sub: String(user.id || user._id), email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn, issuer: "sdm-week5-auth-api", audience: "sdm-week5-client" }
    );
  }

  function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret, {
      issuer: "sdm-week5-auth-api",
      audience: "sdm-week5-client"
    });
  }

  return { signup, login, verifyToken };
}

function publicUser(user) {
  return {
    id: String(user.id || user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

module.exports = { createAuthService };
