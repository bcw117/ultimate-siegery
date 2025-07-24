import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Configure connection with proper pooling and timeouts
export const client = postgres(connectionString, {
  prepare: false,
  max: 1, // Maximum number of connections in the pool for serverless
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 60 * 30, // Maximum connection lifetime (30 minutes)
});

export const db = drizzle(client);
