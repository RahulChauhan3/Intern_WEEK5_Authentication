const HttpError = require("../utils/http-error");

function createAuthenticate(authService, userRepository) {
  return async function authenticate(req, res, next) {
    try {
      const header = req.get("authorization") || "";
      const [scheme, token] = header.split(" ");
      if (scheme !== "Bearer" || !token) {
        throw new HttpError(401, "AUTH_TOKEN_REQUIRED", "A Bearer token is required.");
      }

      let payload;
      try {
        payload = authService.verifyToken(token);
      } catch (_error) {
        throw new HttpError(401, "INVALID_OR_EXPIRED_TOKEN", "The access token is invalid or expired.");
      }

      const user = await userRepository.findPublicById(payload.sub);
      if (!user) throw new HttpError(401, "ACCOUNT_NOT_FOUND", "The account associated with this token no longer exists.");

      req.user = {
        id: String(user.id || user._id),
        name: user.name,
        email: user.email
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createAuthenticate };
