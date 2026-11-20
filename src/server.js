const mongoose = require("mongoose");
const { loadConfig } = require("./config/env");
const { createApp } = require("./app");

async function start() {
  const config = loadConfig();
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB.");

  const app = createApp({ config });
  const server = app.listen(config.port, () => {
    console.log(`Authentication API listening at http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Failed to start the API:", error.message);
  process.exit(1);
});
