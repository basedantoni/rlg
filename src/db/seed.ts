import { env } from "@/lib/env.mjs";
import { db } from "./drizzle";
import { levelDefinitions } from "./schema/levelDefinitions";

const runSeed = async (): Promise<void> => {
  if (!env.DB_FILE_NAME) {
    throw new Error("DB_FILE_NAME is not defined");
  }

  const base = 50;
  const rate = 1.05;
  let threshold: number;
  let polynomialThreshold: number;

  for (let i = 1; i <= 20; i++) {
    threshold = Math.floor(base * i ** 1.2);
    await db.insert(levelDefinitions).values({
      level: i,
      xpTreshold: threshold,
    });
  }

  polynomialThreshold = base * 20 ** 1.2;

  for (let i = 21; i <= 100; i++) {
    threshold = Math.floor(base * i ** rate + polynomialThreshold);
    await db.insert(levelDefinitions).values({
      level: i,
      xpTreshold: threshold,
    });
  }

  console.log("⏳ Seeding...");
};

runSeed().catch((err) => {
  console.error("❌ Seeding failed");
  console.error(err);
  process.exit(1);
});
