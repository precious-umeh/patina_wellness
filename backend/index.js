import mongoose from "mongoose";
import connectDB from "./src/config/database.js";
import { env } from "./src/config/env.js";
import server from "./src/server.js";

let httpServer;
let isShuttingDown = false;

const shutdown = (signal, exitCode = 0) => {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10000);

  forceExitTimer.unref();

  void (async () => {
    try {
      if (httpServer) {
        await new Promise((resolve, reject) => {
          httpServer.close((error) => {
            if (error) return reject(error);
            resolve();
          });
        });
      }

      await mongoose.disconnect();

      console.log("HTTP server and MongoDB connection closed.");
      process.exitCode = exitCode;
    } catch (error) {
      console.error("Error during graceful shutdown:", error);
      process.exitCode = 1;
    } finally {
      clearTimeout(forceExitTimer);
    }
  })();
};

const startServer = async function () {
  await connectDB();

  httpServer = server.listen(env.port);

  await new Promise((resolve, reject) => {
    const onStartupError = (error) => {
      httpServer.off("listening", onListening);
      reject(error);
    };

    const onRuntimeError = (error) => {
      console.error("HTTP server error:", error);
      void shutdown("HTTP server error", 1);
    };

    const onListening = () => {
      httpServer.off("error", onStartupError);
      httpServer.on("error", onRuntimeError);

      console.log(`Server running on port ${env.port}`);
      resolve;
    };

    httpServer.once("error", onStartupError);
    httpServer.once("listening", onListening);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch(async (error) => {
  console.error("Failed to start Patina backend:", error);

  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error(
      "Failed to close MongoDB after startup failure:",
      disconnectError,
    );
  }

  process.exitCode = 1;
});
