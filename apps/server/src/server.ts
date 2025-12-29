import fs from "node:fs";
import http from "node:http";
import { YAML } from "bun";
import cors, { type CorsOptions } from "cors";
import type { ErrorRequestHandler } from "express";
import express from "express";
import swaggerUi, { type JsonObject } from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { setupAuth } from "./auth/authSetup";
import env from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

const app = express();

// Define CORS options
const corsOptions: CorsOptions = {
  origin: env.ALLOWED_ORIGINS_REGEX?.split(",").map(
    (origin) => new RegExp(origin),
  ),
  credentials: true,
};
app.use(cors(corsOptions));

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Swagger
const file = fs.readFileSync("./build/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file) as JsonObject;
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup Authentication
await setupAuth(app);

// Other Routes
RegisterRoutes(app);
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Register error and not found handlers
app.use(errorHandler as ErrorRequestHandler);
app.use(notFoundHandler);

// Start the server
const port = env.SERVER_PORT;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  process.exit();
});
