import { db } from "@/db/drizzle";
import { categories } from "@/db/schema/categories";
import { getUserAuth } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export const getCategories = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const rows = await db
    .select()
    .from(categories)
    .limit(20)
    .where(eq(categories.userId, session.user.id));
  const c = rows;
  return { categories: c };
};
