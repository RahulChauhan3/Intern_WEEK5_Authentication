const express = require("express");
const helmet = require("helmet");
const { createAuthRouter } = require("./routes/auth.routes");
const { createUserRouter } = require("./routes/user.routes");
const { createAuthenticate } = require("./middleware/authenticate");
const { notFound, errorHandler } = require("./middleware/error-handler");
const { createAuthService } = require("./services/auth.service");
const { createUserRepository } = require("./repositories/user.repository");

function createApp({ config, userRepository = createUserRepository() }) {
  const app = express();
  const authService = createAuthService({ userRepository, config });
  const authenticate = createAuthenticate(authService, userRepository);

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      data: { status: "ok", service: "SDM Week 5 Authentication API", timestamp: new Date().toISOString() }
    });
  });

  app.use("/api/auth", createAuthRouter(authService));
  app.use("/api/users", createUserRouter(authenticate));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
