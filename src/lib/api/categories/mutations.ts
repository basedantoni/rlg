import { db } from "@/db/drizzle";
import {
  NewCategoryParams,
  insertCategorySchema,
  categories,
} from "@/db/schema/categories";
import { getUserAuth } from "@/lib/auth/utils";

export const createCategory = async (category: NewCategoryParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const newCategory = insertCategorySchema.parse({
    ...category,
    userId: session.user.id,
  });

  try {
    const [c] = await db.insert(categories).values(newCategory).returning();
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
