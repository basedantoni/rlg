const runSeed = async () => {
  if (!process.env.DB_FILE_NAME) {
    throw new Error("DB_FILE_NAME is not defined");
  }

  console.log("⏳ Seeding...");
};

runSeed().catch((err) => {
  console.error("❌ Seeding failed");
  console.error(err);
  process.exit(1);
});
