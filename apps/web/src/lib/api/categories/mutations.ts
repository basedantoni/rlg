import { db } from '@/db/drizzle';
import {
  NewCategoryParams,
  insertCategorySchema,
  categories,
  CategoryId,
  UpdateCategoryParams,
  updateCategorySchema,
  categoryIdSchema,
} from '@/db/schema/categories';
import { getUserAuth } from '@/lib/auth/utils';
import { and, eq } from 'drizzle-orm';

export const createCategory = async (category: NewCategoryParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newCategory = insertCategorySchema.parse({
    ...category,
    userId: session.user.id,
  });

  try {
    const [c] = await db.insert(categories).values(newCategory).returning();
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateCategory = async (
  id: CategoryId,
  category: UpdateCategoryParams
) => {
  const { session } = await getUserAuth();
  const { id: categoryId } = categoryIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newCategory = updateCategorySchema.parse({
    ...category,
    userId: session.user.id,
  });
  try {
    const [c] = await db
      .update(categories)
      .set({ ...newCategory, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(categories.id, categoryId!),
          eq(categories.userId, session.user.id)
        )
      )
      .returning();
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteCategory = async (id: CategoryId) => {
  const { session } = await getUserAuth();
  const { id: postId } = categoryIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    const [c] = await db
      .delete(categories)
      .where(
        and(eq(categories.id, postId!), eq(categories.userId, session.user.id))
      )
      .returning();
    return { post: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
