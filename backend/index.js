import connectDB from "./src/config/database.js";
import { env } from "./src/config/env.js";
import server from "./src/server.js";

const startServer = async function () {
  await connectDB();

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
