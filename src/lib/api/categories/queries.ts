import { db } from "@/db/drizzle";
import { categories } from "@/db/schema/categories";

export const getCategories = async () => {
  const rows = await db.select().from(categories).limit(20);
  const c = rows;
  return { categories: c };
};
