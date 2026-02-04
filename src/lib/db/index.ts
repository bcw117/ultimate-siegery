import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

config({ path: ".env.local" });

export const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema: { ...schema, ...relations } });
