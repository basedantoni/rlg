import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

export const db =
  process.env.NODE_ENV === "production"
    ? drizzle({
        connection: {
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN,
        },
        schema,
      })
    : drizzle({ connection: process.env.DB_FILE_NAME!, schema });
