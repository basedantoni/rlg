import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
        server: {
                NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
                DB_FILE_NAME: z.string.min(1),
        },
        client: {},
        runtimeEnv: {
                NODE_ENV: process.env.NODE_ENV,
                DB_FILE_NAME: process.env.DB_FILE_NAME,
        }
})
