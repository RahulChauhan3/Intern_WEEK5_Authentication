const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body = {}) {
  const errors = [];
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 80) errors.push("Name must be between 2 and 80 characters.");
  if (!EMAIL_PATTERN.test(email) || email.length > 254) errors.push("A valid email address is required.");
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) errors.push("Password must be at least 8 characters and no more than 72 UTF-8 bytes.");
  return { errors, value: { name, email, password } };
}

function validateLogin(body = {}) {
  const errors = [];
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) errors.push("A valid email address is required.");
  if (!password || Buffer.byteLength(password, "utf8") > 72) errors.push("A password of no more than 72 UTF-8 bytes is required.");
  return { errors, value: { email, password } };
}

module.exports = { validateSignup, validateLogin };
