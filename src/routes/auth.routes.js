const express = require("express");
const rateLimit = require("express-rate-limit");

function createAuthRouter(authService) {
  const router = express.Router();
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      error: { code: "TOO_MANY_AUTH_ATTEMPTS", message: "Too many authentication attempts. Try again later." }
    }
  });

  router.post("/signup", authLimiter, async (req, res, next) => {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", authLimiter, async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createAuthRouter };
