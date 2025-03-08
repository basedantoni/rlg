import { db } from '#/db/drizzle';
import { categories } from '#/db/schema/categories';
import { createUserFilter } from '#/db/utils';

export const getCategories = async () => {
  const userFilter = await createUserFilter(categories);
  const rows = await db.select().from(categories).limit(20).where(userFilter);
  return rows;
};
