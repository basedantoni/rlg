import { env } from "@/lib/env.mjs";
import { defineLevelTresholds } from "./levelThresholds";

const runSeed = async (): Promise<void> => {
  if (!env.DB_FILE_NAME) {
    throw new Error("DB_FILE_NAME is not defined");
  }

  await defineLevelTresholds();

  console.log("⏳ Seeding...");
};

runSeed().catch((err) => {
  console.error("❌ Seeding failed");
  console.error(err);
  process.exit(1);
});
