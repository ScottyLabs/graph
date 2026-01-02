import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  SERVER_URL: z.url(),
  SERVER_PORT: z.number().default(80),
  ALLOWED_ORIGINS_REGEX: z.string(),
  AUTH_ISSUER: z.url(),
  AUTH_CLIENT_ID: z.string(),
  AUTH_CLIENT_SECRET: z.string(),
  AUTH_SESSION_SECRET: z.string(),
  AUTH_JWKS_URI: z.url(),
  REDIS_URL: z.string(),
  APP_ENV: z.enum(["development", "production"]).default("development"),
});

// Validate `process.env` against our schema and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export default env;
