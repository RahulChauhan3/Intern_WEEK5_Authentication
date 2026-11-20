const dotenv = require("dotenv");
dotenv.config();

function loadConfig() {
  const port = Number(process.env.PORT || 3000);
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const jwtSecret = process.env.JWT_SECRET || "";

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }
  if (!Number.isInteger(saltRounds) || saltRounds < 10 || saltRounds > 15) {
    throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 10 and 15.");
  }
  if (process.env.NODE_ENV === "production" && jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters in production.");
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sdm_week5_auth",
    jwtSecret: jwtSecret || "development_only_change_this_secret_before_deploying_123456",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    bcryptSaltRounds: saltRounds,
    corsOrigin: process.env.CORS_ORIGIN || "*"
  };
}

module.exports = { loadConfig };
